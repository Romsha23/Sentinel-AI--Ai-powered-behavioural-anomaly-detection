import base64
import json
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from backend.app.core.config import settings

# Attempt python-jose or pyjwt or fallback to standard library hmac-sha256
try:
    from jose import jwt
    def create_access_token(subject: Union[str, Any], role: str = "Security Analyst", expires_delta: Optional[timedelta] = None) -> str:
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
        return jwt.encode({"exp": expire, "sub": str(subject), "role": role}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
except ImportError:
    try:
        import jwt
        def create_access_token(subject: Union[str, Any], role: str = "Security Analyst", expires_delta: Optional[timedelta] = None) -> str:
            expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
            return jwt.encode({"exp": expire, "sub": str(subject), "role": role}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    except ImportError:
        # Zero-dependency HMAC-SHA256 JWT Fallback
        def create_access_token(subject: Union[str, Any], role: str = "Security Analyst", expires_delta: Optional[timedelta] = None) -> str:
            header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
            exp = int((datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))).timestamp())
            payload = base64.urlsafe_b64encode(json.dumps({"sub": str(subject), "role": role, "exp": exp}).encode()).decode().rstrip("=")
            sig = base64.urlsafe_b64encode(hmac.new(settings.SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()).decode().rstrip("=")
            return f"{header}.{payload}.{sig}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password or plain_password == hashed_password

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()
