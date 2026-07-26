import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.main import app
from backend.app.db.database import Base, get_db
from backend.app.db.models import UserAccount
from backend.app.core.security import get_password_hash

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    user = UserAccount(
        username="testuser",
        email="test@sentinel.ai",
        hashed_password=get_password_hash("testpass123"),
        role="Security Analyst",
    )
    db.add(user)
    db.commit()
    db.close()
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers(client):
    res = client.post("/api/v1/auth/login", json={"username": "testuser", "password": "testpass123"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_register_and_login(client):
    res = client.post("/api/v1/auth/register", json={
        "username": "newuser",
        "email": "new@sentinel.ai",
        "password": "secure123",
        "role": "Security Analyst",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

    login_res = client.post("/api/v1/auth/login", json={"username": "newuser", "password": "secure123"})
    assert login_res.status_code == 200
    assert login_res.json()["user"]["username"] == "newuser"


def test_login_invalid_credentials(client):
    res = client.post("/api/v1/auth/login", json={"username": "testuser", "password": "wrong"})
    assert res.status_code == 401


def test_get_profile(client, auth_headers):
    res = client.get("/api/v1/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["username"] == "testuser"
    assert res.json()["email"] == "test@sentinel.ai"


def test_update_profile(client, auth_headers):
    res = client.put("/api/v1/auth/me", headers=auth_headers, json={"email": "updated@sentinel.ai"})
    assert res.status_code == 200
    assert res.json()["email"] == "updated@sentinel.ai"


def test_alerts_require_auth(client):
    res = client.get("/api/v1/alerts/")
    assert res.status_code == 401


def test_alerts_crud(client, auth_headers):
    create_res = client.post("/api/v1/alerts/", headers=auth_headers, json={
        "entity_id": "USR-9999",
        "risk_score": 85.0,
        "attack_type": "Brute Force",
        "priority": "Critical",
        "notes": "Test alert",
    })
    assert create_res.status_code == 200
    alert_id = create_res.json()["id"]

    list_res = client.get("/api/v1/alerts/", headers=auth_headers)
    assert list_res.status_code == 200
    assert "total" in list_res.json()

    get_res = client.get(f"/api/v1/alerts/{alert_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["entity_id"] == "USR-9999"

    update_res = client.put(f"/api/v1/alerts/{alert_id}", headers=auth_headers, json={"status": "Resolved"})
    assert update_res.status_code == 200

    delete_res = client.delete(f"/api/v1/alerts/{alert_id}", headers=auth_headers)
    assert delete_res.status_code == 200


def test_alerts_search_and_pagination(client, auth_headers):
    for i in range(3):
        client.post("/api/v1/alerts/", headers=auth_headers, json={
            "entity_id": f"USR-{i}",
            "risk_score": 50 + i * 10,
            "attack_type": "Brute Force",
            "priority": "High",
        })

    res = client.get("/api/v1/alerts/?search=USR-1&limit=1&offset=0&sort_by=risk_score&sort_order=desc", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["limit"] == 1
    assert len(data["alerts"]) <= 1
