"""
Database Seeding Script for Sentinel AI
Populates SQLite database with 100,000 synthetic log records, baseline profiles,
and trains Isolation Forest & XGBoost models.
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.db.database import Base, engine, SessionLocal
from backend.app.db.models import UserAccount, LogEventModel, AlertModel
from backend.app.core.security import get_password_hash
from ml.generator import SyntheticDataEngine
from ml.risk_engine import RiskEngine
from ml.trainer import trainer_instance


def seed_database():
    print("Initializing Sentinel AI Database Schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Create Default Users (Analyst & Admin)
    print("Creating default SOC user accounts...")
    if not db.query(UserAccount).filter(UserAccount.username == "analyst").first():
        analyst = UserAccount(
            username="analyst",
            email="analyst@sentinel-ai.sec",
            hashed_password=get_password_hash("password"),
            role="Security Analyst"
        )
        db.add(analyst)
        
    if not db.query(UserAccount).filter(UserAccount.username == "admin").first():
        admin = UserAccount(
            username="admin",
            email="admin@sentinel-ai.sec",
            hashed_password=get_password_hash("admin123"),
            role="Admin"
        )
        db.add(admin)
    db.commit()

    # 2. Generate Synthetic Dataset (100,000 records)
    print("Generating 100,000 synthetic access log records using Faker & NumPy...")
    engine_gen = SyntheticDataEngine(num_users=250, num_devices=350)
    df = engine_gen.generate_dataset(num_records=100000, attack_ratio=0.03)
    
    print("Training ML Suite (Isolation Forest, XGBoost, One-Class SVM, Autoencoder)...")
    trainer_instance.train_all(df)
    
    print("Populating database with log events & alert queue...")
    # Clear existing events
    db.query(LogEventModel).delete()
    db.query(AlertModel).delete()
    
    db_events = []
    db_alerts = []
    
    for idx, row in df.head(10000).iterrows():
        is_attack = row["label"] != "Normal"
        risk_res = RiskEngine.calculate_risk_score(
            iso_forest_score=0.92 if is_attack else 0.1,
            xgb_confidence=0.96 if is_attack else 0.05,
            geo_velocity_kmh=4200.0 if row["label"] == "Impossible Travel" else 0.0,
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
                status="New" if len(db_alerts) % 3 != 0 else "In Progress",
                assigned_analyst="Unassigned" if len(db_alerts) % 2 == 0 else "Analyst Sarah",
                notes=f"Automated detection trigger: {risk_res['reasons'][0]}"
            )
            db_alerts.append(alert)

    db.bulk_save_objects(db_events)
    db.bulk_save_objects(db_alerts)
    db.commit()
    db.close()
    print(f"Database seeding completed successfully! ({len(db_events)} log events, {len(db_alerts)} alerts inserted)")


if __name__ == "__main__":
    seed_database()
