import sys
import os
import asyncio
import json
import random
from datetime import datetime

# Automatically resolve root directory into sys.path so python app/main.py works from any directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.db.database import Base, engine, SessionLocal
from backend.app.db.models import LogEventModel, AlertModel
from backend.app.api import auth, dashboard, alerts, entities, analytics, generate, replay, report
from ml.generator import SyntheticDataEngine, LOCATIONS, RESOURCES, AUTH_METHODS
from ml.risk_engine import RiskEngine

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise Cybersecurity Behavioural Anomaly Detection Platform API",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api/v1
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(entities.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(generate.router, prefix=settings.API_V1_STR)
app.include_router(replay.router, prefix=settings.API_V1_STR)
app.include_router(report.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "status": "Online",
        "platform": settings.PROJECT_NAME,
        "docs": "/docs",
        "api_version": "v1"
    }


# WebSocket Live Event Streaming Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass


manager = ConnectionManager()


@app.websocket("/ws/stream")
async def websocket_event_stream(websocket: WebSocket):
    """
    WebSocket endpoint pushing simulated incoming authentication log events every 1.5 seconds.
    Computes real-time anomaly scores, generates live alerts, and animates dashboard cards.
    """
    await manager.connect(websocket)
    try:
        user_ids = [f"USR-{1000+i}" for i in range(50)]
        dev_ids = [f"DEV-{100+i}" for i in range(75)]
        
        while True:
            await asyncio.sleep(1.5)
            
            is_attack = random.random() < 0.08
            user_id = random.choice(user_ids)
            loc = random.choice(LOCATIONS if not is_attack else LOCATIONS[6:])
            
            if is_attack:
                attack_type = random.choice([
                    "Brute Force", "Impossible Travel", "Credential Stuffing",
                    "Lateral Movement", "Device Spoofing", "Low-and-Slow Exfiltration"
                ])
                failed_attempts = random.randint(6, 18) if attack_type == "Brute Force" else random.randint(0, 2)
                geo_vel = random.randint(2500, 8500) if attack_type == "Impossible Travel" else random.randint(0, 100)
                dev_nov = 1.0 if attack_type in ["Device Spoofing", "Brute Force"] else 0.0
                time_anom = 1.0 if attack_type == "Low-and-Slow Exfiltration" else 0.0
                iso_score = random.uniform(0.82, 0.98)
                xgb_conf = random.uniform(0.85, 0.99)
            else:
                attack_type = "Normal"
                failed_attempts = 0
                geo_vel = 0.0
                dev_nov = 0.0
                time_anom = 0.0
                iso_score = random.uniform(0.05, 0.25)
                xgb_conf = random.uniform(0.01, 0.10)
                
            risk_res = RiskEngine.calculate_risk_score(
                iso_forest_score=iso_score,
                xgb_confidence=xgb_conf,
                geo_velocity_kmh=geo_vel,
                device_novelty=dev_nov,
                time_anomaly=time_anom,
                failed_attempts=failed_attempts
            )
            
            event_payload = {
                "id": random.randint(100000, 999999),
                "timestamp": datetime.now().isoformat(),
                "entity_id": user_id,
                "entity_type": "User",
                "department": random.choice(["Engineering", "DevOps", "Finance", "Sales", "IT Admin"]),
                "source_ip": f"{loc['ip_prefix']}.{random.randint(1,254)}.{random.randint(1,254)}",
                "country": loc["country"],
                "city": loc["city"],
                "latitude": loc["lat"],
                "longitude": loc["lon"],
                "resource_accessed": random.choice(RESOURCES),
                "auth_method": random.choice(AUTH_METHODS),
                "auth_success": not is_attack or random.choice([True, False]),
                "failed_attempts": failed_attempts,
                "session_duration": random.randint(60, 3600),
                "device_fingerprint": random.choice(dev_ids),
                "label": attack_type,
                "risk_score": risk_res["risk_score"],
                "priority": risk_res["priority"],
                "color": risk_res["color"],
                "reasons": risk_res["reasons"],
                "recommendations": risk_res["recommendations"],
                "breakdown": risk_res["breakdown"]
            }
            
            await manager.broadcast(json.dumps(event_payload))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
