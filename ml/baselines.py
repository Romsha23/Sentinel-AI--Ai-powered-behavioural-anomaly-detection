"""
Entity Behavioral Baseline & Cold-Start Peer Group Profiler
Calculates historical normal behavior for entities and falls back to peer group department baselines
for cold-start handling (Honeywell requirement #2 & #4).
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np


# Default Department Peer Baselines for Cold Start
DEPARTMENT_PEER_BASELINES: Dict[str, Dict[str, Any]] = {
    "DevOps": {
        "normal_hours": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        "normal_countries": ["USA", "UK", "Germany"],
        "frequent_resources": ["AWS-Production-Cluster", "Kube-Master-EU", "GitLab-Enterprise", "Grafana-Monitoring"],
        "avg_session_duration": 4500,
        "allowed_auth_methods": ["SSH_Key", "MFA_TOTP", "OAuth_SSO"],
        "cold_start": True
    },
    "Finance": {
        "normal_hours": [9, 10, 11, 12, 13, 14, 15, 16, 17],
        "normal_countries": ["USA", "UK"],
        "frequent_resources": ["Finance-ERP-DB", "Salesforce-Vault", "HR-Payroll-System"],
        "avg_session_duration": 2400,
        "allowed_auth_methods": ["MFA_TOTP", "OAuth_SSO"],
        "cold_start": True
    },
    "Sales": {
        "normal_hours": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        "normal_countries": ["USA", "UK", "Singapore", "India"],
        "frequent_resources": ["Salesforce-Vault", "Customer-Portal-API", "Internal-Wiki"],
        "avg_session_duration": 1800,
        "allowed_auth_methods": ["OAuth_SSO", "Password"],
        "cold_start": True
    },
    "IT Admin": {
        "normal_hours": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        "normal_countries": ["USA", "UK", "Germany"],
        "frequent_resources": ["Domain-Controller-01", "AWS-Production-Cluster", "Grafana-Monitoring"],
        "avg_session_duration": 3600,
        "allowed_auth_methods": ["Kerberos", "MFA_TOTP", "SSH_Key"],
        "cold_start": True
    },
    "Default": {
        "normal_hours": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        "normal_countries": ["USA"],
        "frequent_resources": ["Internal-Wiki", "Customer-Portal-API"],
        "avg_session_duration": 1800,
        "allowed_auth_methods": ["OAuth_SSO", "Password"],
        "cold_start": True
    }
}


class BaselineManager:
    def __init__(self):
        self.entity_baselines: Dict[str, Dict[str, Any]] = {}
        
    def build_baselines_from_df(self, df: pd.DataFrame) -> None:
        """
        Builds individual behavioral baseline profiles from past log events.
        """
        # Filter for normal logs to establish clean baselines
        clean_df = df[df["label"] == "Normal"] if "label" in df.columns else df
        
        grouped = clean_df.groupby("entity_id")
        for entity_id, group in grouped:
            if len(group) < 10:
                # Cold start: inherit department baseline
                dept = group["department"].iloc[0] if "department" in group.columns else "Default"
                peer_base = DEPARTMENT_PEER_BASELINES.get(dept, DEPARTMENT_PEER_BASELINES["Default"]).copy()
                peer_base["session_count"] = len(group)
                peer_base["department"] = dept
                peer_base["known_devices"] = list(group["device_fingerprint"].unique())
                self.entity_baselines[entity_id] = peer_base
            else:
                # Individual custom baseline profile
                timestamps = pd.to_datetime(group["timestamp"])
                hours = timestamps.dt.hour.tolist()
                countries = group["country"].value_counts().head(3).index.tolist()
                resources = group["resource_accessed"].value_counts().head(5).index.tolist()
                devices = group["device_fingerprint"].unique().tolist()
                dept = group["department"].iloc[0] if "department" in group.columns else "Default"
                
                self.entity_baselines[entity_id] = {
                    "entity_id": entity_id,
                    "department": dept,
                    "normal_hours": list(set(hours)),
                    "normal_countries": countries,
                    "frequent_resources": resources,
                    "known_devices": devices,
                    "avg_session_duration": float(group["session_duration"].mean()),
                    "session_count": len(group),
                    "cold_start": False
                }

    def get_baseline(self, entity_id: str, department: str = "Default") -> Dict[str, Any]:
        """
        Returns baseline for entity. If entity is new (Cold Start), inherits department peer baseline.
        """
        if entity_id in self.entity_baselines:
            base = self.entity_baselines[entity_id]
            if base["session_count"] >= 10:
                return base
            
        # Fallback to Cold Start peer group baseline
        peer_base = DEPARTMENT_PEER_BASELINES.get(department, DEPARTMENT_PEER_BASELINES["Default"]).copy()
        peer_base["entity_id"] = entity_id
        peer_base["department"] = department
        peer_base["session_count"] = 0
        peer_base["known_devices"] = []
        peer_base["cold_start"] = True
        return peer_base
