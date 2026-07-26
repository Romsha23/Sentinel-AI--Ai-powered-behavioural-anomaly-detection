from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.db.models import UserAccount
from backend.app.core.security import create_access_token, verify_password, get_password_hash

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "Security Analyst"


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(UserAccount).filter(UserAccount.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    user = UserAccount(
        username=req.username,
        email=req.email,
        hashed_password=get_password_hash(req.password),
        role=req.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = create_access_token(subject=user.username, role=user.role)
    return {"access_token": token, "token_type": "bearer", "user": {"username": user.username, "role": user.role}}


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserAccount).filter(UserAccount.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        # Demo convenience fallback: default analyst login
        if req.username in ["analyst", "admin"] and req.password in ["password", "admin123"]:
            role = "Admin" if req.username == "admin" else "Security Analyst"
            token = create_access_token(subject=req.username, role=role)
            return {"access_token": token, "token_type": "bearer", "user": {"username": req.username, "role": role}}
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    token = create_access_token(subject=user.username, role=user.role)
    return {"access_token": token, "token_type": "bearer", "user": {"username": user.username, "role": user.role}}
