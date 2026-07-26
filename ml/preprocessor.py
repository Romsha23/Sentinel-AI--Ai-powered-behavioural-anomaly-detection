"""
Feature Extraction & Preprocessor Pipeline for Sentinel AI
Calculates Geo-Velocity (Haversine formula), time anomaly deviations, device novelty, and feature matrices.
"""

import math
from datetime import datetime
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates great-circle distance between two points in kilometers.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def calculate_geo_velocity(current_lat: float, current_lon: float, current_ts: datetime,
                           prev_lat: float, prev_lon: float, prev_ts: datetime) -> float:
    """
    Calculates travel velocity in km/h between two events.
    """
    dist_km = haversine_distance(current_lat, current_lon, prev_lat, prev_lon)
    time_hours = abs((current_ts - prev_ts).total_seconds()) / 3600.0
    if time_hours < 0.001:  # Avoid division by zero
        return 0.0 if dist_km < 10 else 10000.0  # High velocity if instantaneous location shift
    return dist_km / time_hours


class LogFeatureExtractor:
    def __init__(self):
        self.last_entity_locations: Dict[str, Tuple[float, float, datetime]] = {}

    def extract_features(self, df: pd.DataFrame, baseline_manager=None) -> pd.DataFrame:
        """
        Transforms raw log DataFrame into numerical feature matrix for Isolation Forest and XGBoost.
        """
        features = pd.DataFrame()
        
        # Ensure timestamp is datetime
        timestamps = pd.to_datetime(df["timestamp"])
        
        # 1. Time-based features
        features["hour_of_day"] = timestamps.dt.hour
        features["day_of_week"] = timestamps.dt.dayofweek
        features["is_weekend"] = (features["day_of_week"] >= 5).astype(int)
        
        # 2. Authentication & Session features
        features["failed_attempts"] = df["failed_attempts"].astype(float)
        features["auth_success"] = df["auth_success"].astype(int)
        features["session_duration"] = df["session_duration"].astype(float)
        
        # 3. Geo Velocity & Country Shift
        geo_velocities = []
        is_country_shift = []
        
        for idx, row in df.iterrows():
            entity_id = row["entity_id"]
            lat, lon = float(row["latitude"]), float(row["longitude"])
            ts = pd.to_datetime(row["timestamp"])
            country = row["country"]
            
            if entity_id in self.last_entity_locations:
                prev_lat, prev_lon, prev_ts, prev_country = self.last_entity_locations[entity_id]
                vel = calculate_geo_velocity(lat, lon, ts, prev_lat, prev_lon, prev_ts)
                shift = 1 if country != prev_country else 0
            else:
                vel = 0.0
                shift = 0
                
            self.last_entity_locations[entity_id] = (lat, lon, ts, country)
            geo_velocities.append(vel)
            is_country_shift.append(shift)
            
        features["geo_velocity_kmh"] = geo_velocities
        features["country_shift"] = is_country_shift
        
        # 4. Baseline Deviations & Novelty Index
        device_novelties = []
        time_anomalies = []
        resource_rarities = []
        
        for idx, row in df.iterrows():
            entity_id = row["entity_id"]
            dept = row.get("department", "Default")
            hour = pd.to_datetime(row["timestamp"]).hour
            dev_fp = row.get("device_fingerprint", "")
            res = row.get("resource_accessed", "")
            
            if baseline_manager:
                base = baseline_manager.get_baseline(entity_id, dept)
                # Device novelty
                dev_novelty = 1.0 if (base.get("known_devices") and dev_fp not in base["known_devices"]) else 0.0
                # Time anomaly
                time_anom = 0.0 if hour in base.get("normal_hours", range(8, 19)) else 1.0
                # Resource rarity
                res_rarity = 0.0 if res in base.get("frequent_resources", []) else 0.8
            else:
                dev_novelty = 0.0
                time_anom = 1.0 if (hour < 6 or hour > 21) else 0.0
                res_rarity = 0.5
                
            device_novelties.append(dev_novelty)
            time_anomalies.append(time_anom)
            resource_rarities.append(res_rarity)
            
        features["device_novelty"] = device_novelties
        features["time_anomaly"] = time_anomalies
        features["resource_rarity"] = resource_rarities
        
        # Fill missing values
        features = features.fillna(0)
        return features
