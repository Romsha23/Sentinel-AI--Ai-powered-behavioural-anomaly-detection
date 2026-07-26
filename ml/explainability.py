"""
Explainable AI Engine for Sentinel AI
Generates SHAP feature contribution breakdowns and human-readable SOC explanations.
"""

from typing import Dict, Any, List


class ExplainableAIEngine:
    @staticmethod
    def get_feature_contributions(log_data: Dict[str, Any], risk_breakdown: Dict[str, float]) -> List[Dict[str, Any]]:
        """
        Formats feature contributions similar to SHAP values for UI visualizers.
        """
        contributions = [
            {"feature": "Isolation Forest Anomaly", "value": risk_breakdown.get("isolation_forest_factor", 0.0), "impact": "High Positive"},
            {"feature": "XGBoost Attack Classifier", "value": risk_breakdown.get("xgboost_factor", 0.0), "impact": "High Positive"},
            {"feature": "Geo Velocity Shift", "value": risk_breakdown.get("geo_anomaly_factor", 0.0), "impact": "Medium Positive"},
            {"feature": "Unregistered Device Fingerprint", "value": risk_breakdown.get("device_novelty_factor", 0.0), "impact": "Medium Positive"},
            {"feature": "Off-Hours Login Time", "value": risk_breakdown.get("time_anomaly_factor", 0.0), "impact": "Low Positive"},
        ]
        return sorted(contributions, key=lambda x: x["value"], reverse=True)
