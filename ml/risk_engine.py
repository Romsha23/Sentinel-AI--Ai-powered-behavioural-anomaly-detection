"""
Transparent 5-Factor Risk Score Engine & Explainable Mitigation Advisor
Implements Honeywell Risk Score Formula:
Risk Score = 40% Isolation Forest + 30% XGBoost Confidence + 15% Geo Anomaly + 10% Device Novelty + 5% Time Anomaly
"""

from typing import Dict, Any, List, Tuple


class RiskEngine:
    @staticmethod
    def calculate_risk_score(
        iso_forest_score: float,      # Normalized 0.0 to 1.0 (higher = more anomalous)
        xgb_confidence: float,        # 0.0 to 1.0 confidence of attack classifier
        geo_velocity_kmh: float,     # Travel speed in km/h
        device_novelty: float,        # 0.0 (known) or 1.0 (new/unknown)
        time_anomaly: float,          # 0.0 (normal hours) or 1.0 (off hours)
        failed_attempts: int          # Number of failed login attempts
    ) -> Dict[str, Any]:
        """
        Calculates transparent 0-100 risk score and returns component factor breakdown.
        """
        # 1. Geo Velocity Score (0.0 to 1.0 scale, max threshold 1000 km/h)
        geo_score = min(1.0, geo_velocity_kmh / 800.0) if geo_velocity_kmh > 100 else 0.0
        
        # Additional boost for rapid failed attempts
        failed_attempt_boost = min(0.3, failed_attempts * 0.03)
        
        # 2. Formula Calculation (0.0 to 1.0)
        raw_score = (
            0.40 * iso_forest_score +
            0.30 * xgb_confidence +
            0.15 * geo_score +
            0.10 * device_novelty +
            0.05 * time_anomaly +
            failed_attempt_boost
        )
        
        final_risk_score = min(100.0, max(0.0, raw_score * 100.0))
        final_risk_score = round(final_risk_score, 1)
        
        # 3. Determine Priority Level
        if final_risk_score >= 80.0:
            priority = "Critical"
            color = "red"
        elif final_risk_score >= 60.0:
            priority = "High"
            color = "orange"
        elif final_risk_score >= 40.0:
            priority = "Medium"
            color = "yellow"
        else:
            priority = "Low"
            color = "green"
            
        # 4. Generate Actionable Reason Codes & Recommendations
        reasons, recommendations = RiskEngine.generate_explainability(
            geo_velocity_kmh, device_novelty, time_anomaly, failed_attempts, final_risk_score
        )
        
        return {
            "risk_score": final_risk_score,
            "priority": priority,
            "color": color,
            "breakdown": {
                "isolation_forest_factor": round(0.40 * iso_forest_score * 100, 1),
                "xgboost_factor": round(0.30 * xgb_confidence * 100, 1),
                "geo_anomaly_factor": round(0.15 * geo_score * 100, 1),
                "device_novelty_factor": round(0.10 * device_novelty * 100, 1),
                "time_anomaly_factor": round(0.05 * time_anomaly * 100, 1)
            },
            "reasons": reasons,
            "recommendations": recommendations
        }

    @staticmethod
    def generate_explainability(
        geo_vel: float, dev_nov: float, time_anom: float, failed_attempts: int, risk_score: float
    ) -> Tuple[List[str], List[str]]:
        reasons = []
        recommendations = []
        
        if geo_vel > 800.0:
            reasons.append(f"Geo velocity exceeded threshold: {int(geo_vel):,} km/h (Impossible Travel)")
            recommendations.append("Immediately revoke active sessions and enforce step-up MFA")
            
        if dev_nov > 0.5:
            reasons.append("Unrecognized device fingerprint & User-Agent detected")
            recommendations.append("Prompt user for hardware token verification")
            
        if failed_attempts >= 5:
            reasons.append(f"{failed_attempts} consecutive failed authentication attempts recorded")
            recommendations.append("Temporarily lock user account for 15 minutes")
            
        if time_anom > 0.5:
            reasons.append("Access request originated during unusual off-peak hours")
            
        if risk_score >= 80.0:
            reasons.append("Anomaly score triggered Critical multi-factor threshold")
            recommendations.append("Escalate incident to Tier-2 SOC Response Team")
            
        if not reasons:
            reasons.append("Activity aligns with normal behavioral baseline profile")
            recommendations.append("No automated action required")
            
        return reasons, recommendations
