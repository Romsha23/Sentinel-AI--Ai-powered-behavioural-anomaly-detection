"""
Synthetic Access Log Data Generator for Sentinel AI
Capable of generating 100,000+ realistic enterprise authentication and access events
with injected cyber attack vectors for Honeywell behavioral anomaly benchmarking.
"""

import math
import random
import hashlib
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

try:
    from faker import Faker
    fake = Faker()
    Faker.seed(42)
    def get_fake_name(): return fake.name()
    def get_fake_sha(): return fake.sha256()[:16]
except ImportError:
    FIRST_NAMES = ["Alex", "Sarah", "Michael", "David", "Emma", "James", "Elena", "Marcus", "Priya", "Chen"]
    LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Taylor", "Patel", "Wang"]
    def get_fake_name(): return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    def get_fake_sha(): return hashlib.sha256(str(random.random()).encode()).hexdigest()[:16]

random.seed(42)
np.random.seed(42)

# Department peer profiles for cold start baselines
DEPARTMENTS = ["DevOps", "Finance", "Sales", "IT Admin", "Engineering", "HR"]

RESOURCES = [
    "AWS-Production-Cluster", "Finance-ERP-DB", "Domain-Controller-01",
    "Customer-Portal-API", "GitLab-Enterprise", "Salesforce-Vault",
    "Internal-Wiki", "HR-Payroll-System", "Kube-Master-EU", "Grafana-Monitoring"
]

HIGH_VALUE_RESOURCES = ["Finance-ERP-DB", "Domain-Controller-01", "AWS-Production-Cluster"]

AUTH_METHODS = ["Password", "MFA_TOTP", "OAuth_SSO", "Kerberos", "SSH_Key", "API_Token"]

LOCATIONS = [
    {"country": "USA", "city": "New York", "lat": 40.7128, "lon": -74.0060, "ip_prefix": "198.51"},
    {"country": "USA", "city": "San Francisco", "lat": 37.7749, "lon": -122.4194, "ip_prefix": "192.0"},
    {"country": "UK", "city": "London", "lat": 51.5074, "lon": -0.1278, "ip_prefix": "81.2"},
    {"country": "Germany", "city": "Frankfurt", "lat": 50.1109, "lon": 8.6821, "ip_prefix": "85.11"},
    {"country": "India", "city": "Bengaluru", "lat": 12.9716, "lon": 77.5946, "ip_prefix": "103.21"},
    {"country": "Singapore", "city": "Singapore", "lat": 1.3521, "lon": 103.8198, "ip_prefix": "118.200"},
    {"country": "Japan", "city": "Tokyo", "lat": 35.6762, "lon": 139.6503, "ip_prefix": "126.10"},
    {"country": "Russia", "city": "Moscow", "lat": 55.7558, "lon": 37.6173, "ip_prefix": "95.173"},
    {"country": "Brazil", "city": "São Paulo", "lat": -23.5505, "lon": -46.6333, "ip_prefix": "177.12"},
]

ATTACK_TYPES = [
    "Normal",
    "Brute Force",
    "Credential Stuffing",
    "Impossible Travel",
    "Lateral Movement",
    "Device Spoofing",
    "Low-and-Slow Exfiltration",
    "Insider Drift"
]


class SyntheticDataEngine:
    def __init__(self, num_users: int = 250, num_devices: int = 350):
        self.num_users = num_users
        self.num_devices = num_devices
        self.users = self._generate_users()
        self.devices = self._generate_devices()
        
    def _generate_users(self):
        users = []
        for i in range(self.num_users):
            dept = random.choice(DEPARTMENTS)
            user_id = f"USR-{1000 + i}"
            home_loc = random.choice(LOCATIONS[:6]) # Normal work locations
            users.append({
                "user_id": user_id,
                "name": get_fake_name(),
                "email": f"user{i}@sentinel-ai.sec",
                "department": dept,
                "home_location": home_loc,
                "preferred_auth": random.choice(["MFA_TOTP", "OAuth_SSO", "Kerberos"]),
                "known_devices": [f"DEV-{random.randint(100, 100 + self.num_devices - 1)}" for _ in range(random.randint(1, 3))]
            })
        return users

    def _generate_devices(self):
        devices = []
        for i in range(self.num_devices):
            devices.append({
                "device_id": f"DEV-{100 + i}",
                "os": random.choice(["Windows 11", "macOS Sonoma", "Ubuntu 22.04", "iOS 17", "Android 14"]),
                "browser": random.choice(["Chrome 125", "Firefox 126", "Safari 17", "Edge 125"]),
                "fingerprint": f"fp_{get_fake_sha()}"
            })
        return devices

    def generate_dataset(self, num_records: int = 100000, attack_ratio: float = 0.02) -> pd.DataFrame:
        """
        Generates a structured log dataset with specified attack ratio.
        """
        records_per_attack = int(num_records * attack_ratio / (len(ATTACK_TYPES) - 1))
        normal_records_count = num_records - (records_per_attack * (len(ATTACK_TYPES) - 1))
        
        data = []
        base_time = datetime.now() - timedelta(days=30)
        
        # 1. Normal Events
        for i in range(normal_records_count):
            user = random.choice(self.users)
            dev_id = random.choice(user["known_devices"])
            device = next((d for d in self.devices if d["device_id"] == dev_id), self.devices[0])
            loc = user["home_location"]
            
            # Normal working hours (8 AM - 6 PM local)
            hour_offset = random.choices(range(24), weights=[1,1,1,1,1,2,5,10,15,15,12,10,12,14,15,12,8,4,2,1,1,1,1,1])[0]
            ts = base_time + timedelta(seconds=random.randint(0, 30*86400))
            ts = ts.replace(hour=hour_offset, minute=random.randint(0, 59), second=random.randint(0, 59))
            
            data.append({
                "entity_id": user["user_id"],
                "entity_type": "User",
                "department": user["department"],
                "timestamp": ts.isoformat(),
                "source_ip": f"{loc['ip_prefix']}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                "country": loc["country"],
                "city": loc["city"],
                "latitude": loc["lat"],
                "longitude": loc["lon"],
                "resource_accessed": random.choice(RESOURCES),
                "auth_method": user["preferred_auth"],
                "auth_success": True,
                "failed_attempts": random.choice([0, 0, 0, 0, 1]),
                "session_duration": random.randint(300, 7200),
                "command_sequence": "login > fetch_token > dashboard > query_resource > logout",
                "device_fingerprint": device["fingerprint"],
                "device_os": device["os"],
                "label": "Normal"
            })

        # 2. Inject Attack Scenarios
        for attack in ATTACK_TYPES:
            if attack == "Normal":
                continue
            
            for _ in range(records_per_attack):
                user = random.choice(self.users)
                dev_id = random.choice(user["known_devices"])
                device = next((d for d in self.devices if d["device_id"] == dev_id), self.devices[0])
                ts = base_time + timedelta(seconds=random.randint(0, 30*86400))
                
                if attack == "Brute Force":
                    loc = random.choice(LOCATIONS[6:])
                    data.append({
                        "entity_id": user["user_id"],
                        "entity_type": "User",
                        "department": user["department"],
                        "timestamp": ts.isoformat(),
                        "source_ip": f"{loc['ip_prefix']}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                        "country": loc["country"],
                        "city": loc["city"],
                        "latitude": loc["lat"],
                        "longitude": loc["lon"],
                        "resource_accessed": "Domain-Controller-01",
                        "auth_method": "Password",
                        "auth_success": False,
                        "failed_attempts": random.randint(8, 25),
                        "session_duration": 12,
                        "command_sequence": "login_failed > login_failed > login_failed > lockout",
                        "device_fingerprint": f"fp_{get_fake_sha()}",
                        "device_os": "Kali Linux 2024.1",
                        "label": "Brute Force"
                    })

                elif attack == "Impossible Travel":
                    loc1 = user["home_location"]
                    loc2 = random.choice([l for l in LOCATIONS if l["country"] != loc1["country"]])
                    
                    data.append({
                        "entity_id": user["user_id"],
                        "entity_type": "User",
                        "department": user["department"],
                        "timestamp": ts.isoformat(),
                        "source_ip": f"{loc2['ip_prefix']}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                        "country": loc2["country"],
                        "city": loc2["city"],
                        "latitude": loc2["lat"],
                        "longitude": loc2["lon"],
                        "resource_accessed": random.choice(RESOURCES),
                        "auth_method": "Password",
                        "auth_success": True,
                        "failed_attempts": 0,
                        "session_duration": 1800,
                        "command_sequence": "login > bypass_mfa > access_vault",
                        "device_fingerprint": f"fp_{get_fake_sha()}",
                        "device_os": "Unknown OS",
                        "label": "Impossible Travel"
                    })

                elif attack == "Credential Stuffing":
                    attacker_ip = "185.220.101.5"
                    loc = LOCATIONS[7]
                    data.append({
                        "entity_id": user["user_id"],
                        "entity_type": "User",
                        "department": user["department"],
                        "timestamp": ts.isoformat(),
                        "source_ip": attacker_ip,
                        "country": loc["country"],
                        "city": loc["city"],
                        "latitude": loc["lat"],
                        "longitude": loc["lon"],
                        "resource_accessed": "Customer-Portal-API",
                        "auth_method": "Password",
                        "auth_success": random.choice([False, False, True]),
                        "failed_attempts": random.randint(5, 15),
                        "session_duration": 45,
                        "command_sequence": "auth_burst_test > session_token_extract",
                        "device_fingerprint": "fp_headless_chrome",
                        "device_os": "Linux x86_64",
                        "label": "Credential Stuffing"
                    })

                elif attack == "Lateral Movement":
                    loc = user["home_location"]
                    data.append({
                        "entity_id": user["user_id"],
                        "entity_type": "User",
                        "department": "Sales",
                        "timestamp": ts.isoformat(),
                        "source_ip": f"{loc['ip_prefix']}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                        "country": loc["country"],
                        "city": loc["city"],
                        "latitude": loc["lat"],
                        "longitude": loc["lon"],
                        "resource_accessed": "Domain-Controller-01",
                        "auth_method": "Kerberos",
                        "auth_success": True,
                        "failed_attempts": 0,
                        "session_duration": 3600,
                        "command_sequence": "ps exec > enum_domain_admins > dump_sam > golden_ticket",
                        "device_fingerprint": device["fingerprint"],
                        "device_os": device["os"],
                        "label": "Lateral Movement"
                    })

                elif attack == "Device Spoofing":
                    loc = user["home_location"]
                    data.append({
                        "entity_id": user["user_id"],
                        "entity_type": "User",
                        "department": user["department"],
                        "timestamp": ts.isoformat(),
                        "source_ip": f"{loc['ip_prefix']}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                        "country": loc["country"],
                        "city": loc["city"],
                        "latitude": loc["lat"],
                        "longitude": loc["lon"],
                        "resource_accessed": random.choice(RESOURCES),
                        "auth_method": "Password",
                        "auth_success": True,
                        "failed_attempts": 2,
                        "session_duration": 900,
                        "command_sequence": "login > header_spoof > query_data",
                        "device_fingerprint": f"fp_spoofed_{random.randint(999, 99999)}",
                        "device_os": "Custom HTTP Client",
                        "label": "Device Spoofing"
                    })

                elif attack == "Low-and-Slow Exfiltration":
                    loc = user["home_location"]
                    ts_night = ts.replace(hour=random.choice([2, 3, 4]), minute=random.randint(0, 59))
                    data.append({
                        "entity_id": user["user_id"],
                        "entity_type": "User",
                        "department": user["department"],
                        "timestamp": ts_night.isoformat(),
                        "source_ip": f"{loc['ip_prefix']}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                        "country": loc["country"],
                        "city": loc["city"],
                        "latitude": loc["lat"],
                        "longitude": loc["lon"],
                        "resource_accessed": "Finance-ERP-DB",
                        "auth_method": "API_Token",
                        "auth_success": True,
                        "failed_attempts": 0,
                        "session_duration": random.randint(60, 180),
                        "command_sequence": "connect > select_all_customers > export_csv_chunk > disconnect",
                        "device_fingerprint": device["fingerprint"],
                        "device_os": device["os"],
                        "label": "Low-and-Slow Exfiltration"
                    })

                elif attack == "Insider Drift":
                    loc = user["home_location"]
                    data.append({
                        "entity_id": user["user_id"],
                        "entity_type": "User",
                        "department": user["department"],
                        "timestamp": ts.isoformat(),
                        "source_ip": f"{loc['ip_prefix']}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                        "country": loc["country"],
                        "city": loc["city"],
                        "latitude": loc["lat"],
                        "longitude": loc["lon"],
                        "resource_accessed": "AWS-Production-Cluster",
                        "auth_method": "SSH_Key",
                        "auth_success": True,
                        "failed_attempts": 1,
                        "session_duration": random.randint(14000, 28000),
                        "command_sequence": "ssh_connect > modify_crontab > download_external_script",
                        "device_fingerprint": device["fingerprint"],
                        "device_os": device["os"],
                        "label": "Insider Drift"
                    })

        df = pd.DataFrame(data)
        df = df.sample(frac=1.0, random_state=42).reset_index(drop=True)
        return df
