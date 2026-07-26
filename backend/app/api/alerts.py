import random
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.db.models import AlertModel
from backend.app.core.deps import get_current_user
from backend.app.db.models import UserAccount

router = APIRouter(prefix="/alerts", tags=["Alert Queue"])

DEMO_ALERTS = [
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
            "New unrecognized browser fingerprint",
        ],
        "recommendations": [
            "Temporarily lock account USR-1042",
            "Enforce step-up MFA",
            "Notify SOC Tier-2 On-Call",
        ],
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
            "Targeting High-Value Domain Controller",
        ],
        "recommendations": [
            "Block source IP 185.220.101.5 at firewall",
            "Lock account USR-1019",
        ],
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
            "Golden ticket command sequence observed",
        ],
        "recommendations": [
            "Audit Kerberos ticket granting logs",
            "Verify user authorization with manager",
        ],
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
            "Custom HTTP client User-Agent string",
        ],
        "recommendations": ["Update entity device baseline profile"],
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
            "High volume Finance-ERP-DB queries",
        ],
        "recommendations": ["Mark backup service account as authorized"],
    },
]


class AlertCreateRequest(BaseModel):
    entity_id: str
    risk_score: float = Field(ge=0, le=100)
    attack_type: str
    priority: str = "Medium"
    status: str = "New"
    assigned_analyst: str = "Unassigned"
    notes: str = ""


class AlertUpdateRequest(BaseModel):
    status: Optional[str] = None
    assigned_analyst: Optional[str] = None
    notes: Optional[str] = None
    priority: Optional[str] = None
    risk_score: Optional[float] = None
    attack_type: Optional[str] = None


def _serialize_alert(alert: AlertModel) -> dict:
    return {
        "id": alert.id,
        "timestamp": alert.timestamp,
        "entity_id": alert.entity_id,
        "risk_score": alert.risk_score,
        "attack_type": alert.attack_type,
        "priority": alert.priority,
        "status": alert.status,
        "assigned_analyst": alert.assigned_analyst,
        "notes": alert.notes,
        "reasons": ["Baseline deviation detected", f"Attack classifier: {alert.attack_type}"],
        "recommendations": ["Review session log timeline", "Enforce step-up MFA if unverified"],
    }


def _apply_demo_filters(
    alerts: list,
    priority: Optional[str],
    attack_type: Optional[str],
    status: Optional[str],
    entity_id: Optional[str],
    search: Optional[str],
    sort_by: str,
    sort_order: str,
) -> list:
    filtered = alerts
    if priority:
        filtered = [a for a in filtered if a["priority"] == priority]
    if attack_type:
        filtered = [a for a in filtered if a["attack_type"] == attack_type]
    if status:
        filtered = [a for a in filtered if a["status"] == status]
    if entity_id:
        filtered = [a for a in filtered if a["entity_id"] == entity_id]
    if search:
        q = search.lower()
        filtered = [
            a for a in filtered
            if q in a["id"].lower() or q in a["entity_id"].lower() or q in a["attack_type"].lower()
        ]

    reverse = sort_order == "desc"
    sort_key = sort_by if sort_by in ("risk_score", "timestamp", "priority", "status") else "risk_score"
    if sort_key == "risk_score":
        filtered.sort(key=lambda a: a["risk_score"], reverse=reverse)
    elif sort_key == "timestamp":
        filtered.sort(key=lambda a: a["timestamp"], reverse=reverse)
    else:
        filtered.sort(key=lambda a: a.get(sort_key, ""), reverse=reverse)
    return filtered


@router.get("/")
def get_alerts(
    priority: Optional[str] = Query(None),
    attack_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    entity_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("risk_score"),
    sort_order: str = Query("desc"),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    _: UserAccount = Depends(get_current_user),
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
            (AlertModel.id.ilike(f"%{search}%"))
            | (AlertModel.entity_id.ilike(f"%{search}%"))
            | (AlertModel.attack_type.ilike(f"%{search}%"))
        )

    sort_column = getattr(AlertModel, sort_by, AlertModel.risk_score)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    total = query.count()
    alerts = query.offset(offset).limit(limit).all()

    if total == 0:
        demo_filtered = _apply_demo_filters(
            DEMO_ALERTS.copy(), priority, attack_type, status, entity_id, search, sort_by, sort_order
        )
        return {
            "total": len(demo_filtered),
            "limit": limit,
            "offset": offset,
            "alerts": demo_filtered[offset : offset + limit],
        }

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "alerts": [_serialize_alert(a) for a in alerts],
    }


@router.get("/{alert_id}")
def get_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(get_current_user),
):
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if alert:
        return _serialize_alert(alert)

    demo = next((a for a in DEMO_ALERTS if a["id"] == alert_id), None)
    if demo:
        return demo
    raise HTTPException(status_code=404, detail="Alert not found")


@router.post("/")
def create_alert(
    req: AlertCreateRequest,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(get_current_user),
):
    alert_id = f"ALT-{random.randint(9000, 9999)}"
    alert = AlertModel(
        id=alert_id,
        timestamp=datetime.utcnow().isoformat(),
        entity_id=req.entity_id,
        risk_score=req.risk_score,
        attack_type=req.attack_type,
        priority=req.priority,
        status=req.status,
        assigned_analyst=req.assigned_analyst,
        notes=req.notes,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return _serialize_alert(alert)


@router.put("/{alert_id}")
def update_alert(
    alert_id: str,
    req: AlertUpdateRequest,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(get_current_user),
):
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if alert:
        if req.status is not None:
            alert.status = req.status
        if req.assigned_analyst is not None:
            alert.assigned_analyst = req.assigned_analyst
        if req.notes is not None:
            alert.notes = req.notes
        if req.priority is not None:
            alert.priority = req.priority
        if req.risk_score is not None:
            alert.risk_score = req.risk_score
        if req.attack_type is not None:
            alert.attack_type = req.attack_type
        db.commit()
        db.refresh(alert)
        return {"message": "Alert updated successfully", "alert": _serialize_alert(alert)}

    return {
        "message": f"Alert {alert_id} updated successfully (demo state)",
        "updated": req.model_dump(exclude_none=True),
    }


@router.delete("/{alert_id}")
def delete_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(get_current_user),
):
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if not alert:
        if any(a["id"] == alert_id for a in DEMO_ALERTS):
            return {"message": f"Alert {alert_id} removed (demo state)"}
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(alert)
    db.commit()
    return {"message": f"Alert {alert_id} deleted successfully"}
