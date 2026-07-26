import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


class UserAccount(Base):
    __tablename__ = "user_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Security Analyst")  # "Security Analyst" or "Admin"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class LogEventModel(Base):
    __tablename__ = "log_events"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(String, index=True, nullable=False)
    entity_type = Column(String, default="User")
    department = Column(String, default="Engineering")
    timestamp = Column(String, index=True, nullable=False)
    source_ip = Column(String, nullable=False)
    country = Column(String, nullable=False)
    city = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    resource_accessed = Column(String, nullable=False)
    auth_method = Column(String, nullable=False)
    auth_success = Column(Boolean, default=True)
    failed_attempts = Column(Integer, default=0)
    session_duration = Column(Integer, default=1800)
    command_sequence = Column(Text, nullable=True)
    device_fingerprint = Column(String, nullable=False)
    device_os = Column(String, nullable=True)
    label = Column(String, default="Normal")
    
    # Inferred Model Outputs
    risk_score = Column(Float, default=0.0)
    priority = Column(String, default="Low")  # Critical, High, Medium, Low
    predicted_attack = Column(String, default="Normal")
    is_anomaly = Column(Boolean, default=False)
    reasons = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)


class AlertModel(Base):
    __tablename__ = "alerts"
    
    id = Column(String, primary_key=True, index=True)  # e.g. ALT-9821
    log_event_id = Column(Integer, ForeignKey("log_events.id"), nullable=True)
    timestamp = Column(String, nullable=False)
    entity_id = Column(String, index=True, nullable=False)
    risk_score = Column(Float, nullable=False)
    attack_type = Column(String, nullable=False)
    priority = Column(String, nullable=False)  # Critical, High, Medium, Low
    status = Column(String, default="New")     # New, In Progress, Resolved, False Positive
    assigned_analyst = Column(String, default="Unassigned")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
