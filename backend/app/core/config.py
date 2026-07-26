import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel AI - Behavioural Anomaly Detection Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "sentinel_ai_super_secret_jwt_key_2026_honeywell_demo"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database URL: SQLite by default for zero-config execution
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sentinel.db")

    class Config:
        case_sensitive = True


settings = Settings()
