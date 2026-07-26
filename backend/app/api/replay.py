from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/replay", tags=["Replay Attack Simulation"])


@router.get("/")
def get_attack_replay_steps() -> List[Dict[str, Any]]:
    """
    Returns step-by-step timeline of a multi-stage cyber attack for interactive replay simulation.
    """
    return [
        {
            "step": 1,
            "timestamp": "09:10:00 AM",
            "title": "Normal Morning Authentication",
            "entity_id": "USR-1042 (Sarah Jenkins)",
            "action": "OAuth_SSO login from registered MacBook (198.51.100.42, New York)",
            "resource": "Internal-Wiki",
            "risk_score": 8.5,
            "priority": "Low",
            "color": "#10B981",
            "reasons": ["Matches historical working hours", "Recognized device fingerprint"],
            "recommendations": ["Normal activity"]
        },
        {
            "step": 2,
            "timestamp": "09:12:15 AM",
            "title": "First Failed Password Attempt",
            "entity_id": "USR-1042 (Sarah Jenkins)",
            "action": "Password auth failure from suspicious IP (95.173.136.44, Moscow)",
            "resource": "Domain-Controller-01",
            "risk_score": 38.0,
            "priority": "Low",
            "color": "#F59E0B",
            "reasons": ["Single failed login from foreign IP"],
            "recommendations": ["Monitor for escalation"]
        },
        {
            "step": 3,
            "timestamp": "09:13:02 AM",
            "title": "Rapid Failed Attempts (Brute Force)",
            "entity_id": "USR-1042 (Sarah Jenkins)",
            "action": "6 failed password attempts in 45 seconds from Moscow IP",
            "resource": "Domain-Controller-01",
            "risk_score": 58.0,
            "priority": "Medium",
            "color": "#F97316",
            "reasons": ["Brute force threshold approaching (6 failed attempts)", "Foreign country shift"],
            "recommendations": ["Prepare account lockout rule"]
        },
        {
            "step": 4,
            "timestamp": "09:14:40 AM",
            "title": "Impossible Travel Shift",
            "entity_id": "USR-1042 (Sarah Jenkins)",
            "action": "Authentication shift from NYC to Moscow (Geo Velocity: 7,200 km/h)",
            "resource": "Domain-Controller-01",
            "risk_score": 79.5,
            "priority": "High",
            "color": "#EF4444",
            "reasons": ["Impossible travel speed (7,200 km/h)", "Unregistered Kali Linux OS user agent"],
            "recommendations": ["Enforce step-up MFA challenge"]
        },
        {
            "step": 5,
            "timestamp": "09:15:20 AM",
            "title": "Credential Compromise",
            "entity_id": "USR-1042 (Sarah Jenkins)",
            "action": "Password authentication SUCCESS from Moscow attacker IP",
            "resource": "Domain-Controller-01",
            "risk_score": 88.0,
            "priority": "Critical",
            "color": "#DC2626",
            "reasons": ["Brute force success after multiple failures", "New unverified device"],
            "recommendations": ["Immediately terminate active session tokens"]
        },
        {
            "step": 6,
            "timestamp": "09:16:45 AM",
            "title": "Lateral Movement & Ticket Request",
            "entity_id": "USR-1042 (Sarah Jenkins)",
            "action": "Golden Ticket Kerberos request executed targeting Domain Controller",
            "resource": "Domain-Controller-01",
            "risk_score": 96.5,
            "priority": "Critical",
            "color": "#9333EA",
            "reasons": ["High-value target privilege escalation", "Resource rarity score 0.98"],
            "recommendations": ["Lock account USR-1042", "Revoke Kerberos TGT tickets"]
        },
        {
            "step": 7,
            "timestamp": "09:18:00 AM",
            "title": "SOC Incident Escalation Triggered",
            "entity_id": "USR-1042 (Sarah Jenkins)",
            "action": "Automated Sentinel AI Incident Response: Account Locked & Paged SOC Analyst",
            "resource": "Domain-Controller-01",
            "risk_score": 98.0,
            "priority": "Critical",
            "color": "#EC4899",
            "reasons": ["5-Factor Risk Formula score exceeded 95 threshold"],
            "recommendations": ["Account locked automatically. Tier-2 SOC Analyst assigned."]
        }
    ]
