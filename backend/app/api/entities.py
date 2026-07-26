from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.db.models import LogEventModel
from ml.baselines import BaselineManager

router = APIRouter(prefix="/entities", tags=["Entity Baseline & Timeline"])

baseline_mgr = BaselineManager()


@router.get("/{entity_id}")
def get_entity_profile_and_timeline(entity_id: str, db: Session = Depends(get_db)):
    # 1. Fetch entity session history from DB
    events = (
        db.query(LogEventModel)
        .filter(LogEventModel.entity_id == entity_id)
        .order_by(LogEventModel.timestamp.desc())
        .limit(30)
        .all()
    )

    department = events[0].department if events else "Engineering"
    baseline = baseline_mgr.get_baseline(entity_id, department)

    session_history = []
    risk_trend = []
    
    if events:
        for ev in events:
            session_history.append({
                "id": ev.id,
                "timestamp": ev.timestamp,
                "source_ip": ev.source_ip,
                "country": ev.country,
                "city": ev.city,
                "resource_accessed": ev.resource_accessed,
                "auth_method": ev.auth_method,
                "auth_success": ev.auth_success,
                "failed_attempts": ev.failed_attempts,
                "session_duration": ev.session_duration,
                "command_sequence": ev.command_sequence,
                "device_fingerprint": ev.device_fingerprint,
                "risk_score": ev.risk_score,
                "label": ev.label,
                "priority": ev.priority
            })
            risk_trend.append({"timestamp": ev.timestamp, "risk_score": ev.risk_score})
    else:
        # Fallback rich mock timeline for demo testing
        session_history = [
            {
                "id": 101,
                "timestamp": "2026-07-26T10:14:00",
                "source_ip": "95.173.136.44",
                "country": "Russia",
                "city": "Moscow",
                "resource_accessed": "Domain-Controller-01",
                "auth_method": "Password",
                "auth_success": False,
                "failed_attempts": 18,
                "session_duration": 12,
                "command_sequence": "login_failed > login_failed > lockout",
                "device_fingerprint": "fp_kali_2024",
                "risk_score": 96.5,
                "label": "Impossible Travel",
                "priority": "Critical"
            },
            {
                "id": 102,
                "timestamp": "2026-07-26T10:02:00",
                "source_ip": "198.51.100.42",
                "country": "USA",
                "city": "New York",
                "resource_accessed": "GitLab-Enterprise",
                "auth_method": "OAuth_SSO",
                "auth_success": True,
                "failed_attempts": 0,
                "session_duration": 3600,
                "command_sequence": "login > fetch_code > git_push > logout",
                "device_fingerprint": "fp_macbook_pro_16",
                "risk_score": 12.0,
                "label": "Normal",
                "priority": "Low"
            },
            {
                "id": 103,
                "timestamp": "2026-07-25T17:30:00",
                "source_ip": "198.51.100.42",
                "country": "USA",
                "city": "New York",
                "resource_accessed": "Internal-Wiki",
                "auth_method": "OAuth_SSO",
                "auth_success": True,
                "failed_attempts": 0,
                "session_duration": 1800,
                "command_sequence": "login > search_docs > logout",
                "device_fingerprint": "fp_macbook_pro_16",
                "risk_score": 8.5,
                "label": "Normal",
                "priority": "Low"
            }
        ]
        risk_trend = [
            {"timestamp": "2026-07-25T17:30:00", "risk_score": 8.5},
            {"timestamp": "2026-07-26T10:02:00", "risk_score": 12.0},
            {"timestamp": "2026-07-26T10:14:00", "risk_score": 96.5}
        ]

    return {
        "entity_id": entity_id,
        "department": department,
        "baseline_profile": baseline,
        "risk_trend": risk_trend,
        "session_history": session_history
    }
