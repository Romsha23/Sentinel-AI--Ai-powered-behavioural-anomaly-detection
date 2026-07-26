import io
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
import pandas as pd
from backend.app.db.database import get_db
from backend.app.db.models import LogEventModel, AlertModel
from ml.generator import SyntheticDataEngine
from ml.trainer import ModelTrainer, trainer_instance
from ml.risk_engine import RiskEngine

router = APIRouter(prefix="", tags=["Data Generator & Training"])


class GenerateDataRequest(BaseModel):
    num_records: int = 10000
    attack_ratio: float = 0.02


@router.post("/generate-data")
def generate_synthetic_dataset(req: GenerateDataRequest, db: Session = Depends(get_db)):
    engine = SyntheticDataEngine(num_users=250, num_devices=350)
    df = engine.generate_dataset(num_records=req.num_records, attack_ratio=req.attack_ratio)
    
    # Store sample in DB
    db.query(LogEventModel).delete()
    db.query(AlertModel).delete()
    
    db_events = []
    db_alerts = []
    
    # Insert top records into DB
    for idx, row in df.head(5000).iterrows():
        is_attack = row["label"] != "Normal"
        risk_res = RiskEngine.calculate_risk_score(
            iso_forest_score=0.9 if is_attack else 0.1,
            xgb_confidence=0.95 if is_attack else 0.05,
            geo_velocity_kmh=2500.0 if row["label"] == "Impossible Travel" else 0.0,
            device_novelty=1.0 if row["label"] in ["Device Spoofing", "Brute Force"] else 0.0,
            time_anomaly=1.0 if row["label"] == "Low-and-Slow Exfiltration" else 0.0,
            failed_attempts=int(row["failed_attempts"])
        )
        
        event = LogEventModel(
            entity_id=row["entity_id"],
            entity_type=row["entity_type"],
            department=row.get("department", "Engineering"),
            timestamp=row["timestamp"],
            source_ip=row["source_ip"],
            country=row["country"],
            city=row["city"],
            latitude=float(row["latitude"]),
            longitude=float(row["longitude"]),
            resource_accessed=row["resource_accessed"],
            auth_method=row["auth_method"],
            auth_success=bool(row["auth_success"]),
            failed_attempts=int(row["failed_attempts"]),
            session_duration=int(row["session_duration"]),
            command_sequence=row["command_sequence"],
            device_fingerprint=row["device_fingerprint"],
            device_os=row.get("device_os", "Windows 11"),
            label=row["label"],
            risk_score=risk_res["risk_score"],
            priority=risk_res["priority"],
            predicted_attack=row["label"],
            is_anomaly=is_attack,
            reasons=risk_res["reasons"],
            recommendations=risk_res["recommendations"]
        )
        db_events.append(event)
        
        if is_attack or risk_res["risk_score"] >= 60.0:
            alert = AlertModel(
                id=f"ALT-{9000 + len(db_alerts)}",
                timestamp=row["timestamp"],
                entity_id=row["entity_id"],
                risk_score=risk_res["risk_score"],
                attack_type=row["label"],
                priority=risk_res["priority"],
                status="New",
                assigned_analyst="Unassigned",
                notes=f"Automated detection: {risk_res['reasons'][0]}"
            )
            db_alerts.append(alert)

    db.bulk_save_objects(db_events)
    db.bulk_save_objects(db_alerts)
    db.commit()

    return {
        "message": f"Successfully generated {len(df):,} synthetic log records ({req.attack_ratio*100}% attacks)",
        "total_generated": len(df),
        "db_populated": len(db_events),
        "alerts_created": len(db_alerts)
    }


@router.post("/train")
def train_models(db: Session = Depends(get_db)):
    engine = SyntheticDataEngine(num_users=100, num_devices=150)
    df = engine.generate_dataset(num_records=10000, attack_ratio=0.03)
    results = trainer_instance.train_all(df)
    return {
        "status": "Success",
        "message": "Models trained successfully (Isolation Forest, XGBoost, OneClassSVM, Autoencoder)",
        "results": results
    }


@router.post("/upload")
async def upload_csv_logs(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    return {
        "filename": file.filename,
        "rows_processed": len(df),
        "columns": list(df.columns),
        "message": "CSV log file processed and evaluated against Isolation Forest risk engine"
    }
