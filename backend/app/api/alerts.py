from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.db.models import AlertModel, LogEventModel

router = APIRouter(prefix="/alerts", tags=["Alert Queue"])


class AlertUpdateRequest(BaseModel):
    status: Optional[str] = None
    assigned_analyst: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
def get_alerts(
    priority: Optional[str] = Query(None),
    attack_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    entity_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(AlertModel)
    
    if priority:
        query = query.filter(AlertModel.priority == priority)
    if attack_type:
        query = query.filter(AlertModel.attack_type == attack_type)
    if status:
        query = query.filter(AlertModel.status == status)
    if entity_id:
        query = query.filter(AlertModel.entity_id == entity_id)
    if search:
        query = query.filter(
            (AlertModel.id.ilike(f"%{search}%")) |
            (AlertModel.entity_id.ilike(f"%{search}%")) |
            (AlertModel.attack_type.ilike(f"%{search}%"))
        )
        
    total = query.count()
    alerts = query.order_by(AlertModel.risk_score.desc()).offset(offset).limit(limit).all()
    
    # If DB is empty, return rich presentation defaults
    if total == 0:
        demo_alerts = [
            {
                "id": "ALT-9081",
                "timestamp": "2026-07-26T10:14:00",
                "entity_id": "USR-1042",
                "risk_score": 96.5,
                "attack_type": "Impossible Travel",
                "priority": "Critical",
                "status": "New",
                "assigned_analyst": "Unassigned",
                "notes": "Geo velocity of 7,200 km/h detected between NYC and Moscow in 12 minutes.",
                "reasons": [
                    "Geo velocity threshold exceeded (7,200 km/h)",
                    "Country shift from USA to Russia in < 15 mins",
                    "New unrecognized browser fingerprint"
                ],
                "recommendations": [
                    "Temporarily lock account USR-1042",
                    "Enforce step-up MFA",
                    "Notify SOC Tier-2 On-Call"
                ]
            },
            {
                "id": "ALT-9082",
                "timestamp": "2026-07-26T10:12:30",
                "entity_id": "USR-1019",
                "risk_score": 88.2,
                "attack_type": "Brute Force",
                "priority": "Critical",
                "status": "In Progress",
                "assigned_analyst": "Analyst Sarah",
                "notes": "18 consecutive failed password attempts targeting Domain Controller.",
                "reasons": [
                    "18 failed logins in 45 seconds",
                    "Source IP 185.220.101.5 in known threat feed",
                    "Targeting High-Value Domain Controller"
                ],
                "recommendations": [
                    "Block source IP 185.220.101.5 at firewall",
                    "Lock account USR-1019"
                ]
            },
            {
                "id": "ALT-9083",
                "timestamp": "2026-07-26T10:08:15",
                "entity_id": "USR-1088",
                "risk_score": 74.0,
                "attack_type": "Lateral Movement",
                "priority": "High",
                "status": "New",
                "assigned_analyst": "Unassigned",
                "notes": "Sales department account attempting Kerberos admin ticket request.",
                "reasons": [
                    "Unusual resource access: Domain Controller",
                    "Resource rarity score 0.95 for Sales department",
                    "Golden ticket command sequence observed"
                ],
                "recommendations": [
                    "Audit Kerberos ticket granting logs",
                    "Verify user authorization with manager"
                ]
            },
            {
                "id": "ALT-9084",
                "timestamp": "2026-07-26T09:45:00",
                "entity_id": "DEV-142",
                "risk_score": 68.5,
                "attack_type": "Device Spoofing",
                "priority": "High",
                "status": "Resolved",
                "assigned_analyst": "Analyst Alex",
                "notes": "User confirmed new laptop setup after device fingerprint mismatch.",
                "reasons": [
                    "Device fingerprint not in entity baseline",
                    "Custom HTTP client User-Agent string"
                ],
                "recommendations": [
                    "Update entity device baseline profile"
                ]
            },
            {
                "id": "ALT-9085",
                "timestamp": "2026-07-26T09:12:00",
                "entity_id": "USR-1105",
                "risk_score": 52.0,
                "attack_type": "Low-and-Slow Exfiltration",
                "priority": "Medium",
                "status": "False Positive",
                "assigned_analyst": "Analyst Alex",
                "notes": "Scheduled nightly automated backup job verified.",
                "reasons": [
                    "Off-hours access at 3:15 AM",
                    "High volume Finance-ERP-DB queries"
                ],
                "recommendations": [
                    "Mark backup service account as authorized"
                ]
            }
        ]
        return {"total": len(demo_alerts), "alerts": demo_alerts}

    res = []
    for a in alerts:
        res.append({
            "id": a.id,
            "timestamp": a.timestamp,
            "entity_id": a.entity_id,
            "risk_score": a.risk_score,
            "attack_type": a.attack_type,
            "priority": a.priority,
            "status": a.status,
            "assigned_analyst": a.assigned_analyst,
            "notes": a.notes,
            "reasons": ["Baseline deviation detected", f"Attack classifier: {a.attack_type}"],
            "recommendations": ["Review session log timeline", "Enforce step-up MFA if unverified"]
        })
        
    return {"total": total, "alerts": res}


@router.put("/{alert_id}")
def update_alert(alert_id: str, req: AlertUpdateRequest, db: Session = Depends(get_db)):
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if alert:
        if req.status:
            alert.status = req.status
        if req.assigned_analyst:
            alert.assigned_analyst = req.assigned_analyst
        if req.notes:
            alert.notes = req.notes
        db.commit()
        db.refresh(alert)
        return {"message": "Alert updated successfully", "alert_id": alert_id}
        
    # Fallback response for demo mock IDs
    return {"message": f"Alert {alert_id} updated successfully (demo state)", "updated": req.dict(exclude_none=True)}
