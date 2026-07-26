# 🛡️ Sentinel AI — Behavioural Anomaly Detection Platform for Cybersecurity

[![Live Deployment](https://img.shields.io/badge/🚀%20Live%20Demo-Vercel-000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://sentinel-ai-ai-powered-behavioural-anomaly-det.vercel.app/)
[![Backend API](https://img.shields.io/badge/⚡%20Backend%20API-Render-009688.svg?style=for-the-badge&logo=render&logoColor=white)](https://sentinel-ai-backend.onrender.com/)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Next.js 14](https://img.shields.io/badge/next.js-14+-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Sentinel AI** is an enterprise-grade, full-stack cybersecurity platform designed for **Autonomous Behavioral Threat Detection and Incident Response**. It models normal user and device behaviors, ingests sub-second access telemetry via WebSockets, classifies multi-stage cyber attacks, and calculates explainable 0–100 risk scores with actionable security operations workflows.

---

## 🌐 Live Deployment Links

- **🚀 Frontend SOC Dashboard (Vercel)**: [https://sentinel-ai-ai-powered-behavioural-anomaly-det.vercel.app/](sentinel-ai-ai-powered-behavioural.vercel.app
)
- **⚡ Backend API Docs & WebSockets (Render)**: [https://sentinel-ai-backend.onrender.com/docs]([https://sentinel-ai-backend.onrender.com/docs](https://sentinel-ai-ai-powered-behavioural.onrender.com))


---

## ✨ Key Features & Technical Highlights

- **🎨 SMARTNET Dark Purple & Light Theme System**: Sleek glassmorphic SOC dashboard with royal dark purple background (`#14052b`), glowing neon accents, and a 1-click Dark/Light mode theme switcher.
- **🔒 Behavior IQ Command Center**: Login interface featuring an interactive HTML5 constellation particle canvas, live floating SOC status badges, and one-click demo credentials sign-in.
- **⚡ Near Real-Time Stream Ingestion**: Low-latency WebSocket streaming (`/ws/stream`) pushing live telemetry and anomaly alerts every 1.5 seconds.
- **🧠 Multi-Model ML Engine**: Ensemble suite featuring **Isolation Forest** (unsupervised anomaly detection), **XGBoost** (multi-class attack pattern classifier), **One-Class SVM**, and **Autoencoder Neural Networks**.
- **🧮 Explainable 5-Factor Risk Formula**: Transparent risk score calculation combining isolation scores, model confidences, Haversine geo-velocity anomalies, device novelty, and time deviations.
- **▶️ Attack Replay Simulator**: Interactive step-by-step playback of multi-stage compromise scenarios for post-incident investigation.
- **📊 Analyst SOC Alert Queue**: Real-time alert management with priority filters, status tracking, analyst assignment, notes, and direct entity timeline inspection.
- **📄 Executive PDF Threat Reports**: Automated PDF generation summarizing high-risk incidents, top target resources, and recommended mitigation controls.

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │       Next.js 14 SOC Dashboard         │
                               │ (SMARTNET Purple Theme, Light/Dark)    │
                               └───────────────────┬────────────────────┘
                                                   │ HTTP REST / WebSockets
                               ┌───────────────────▼────────────────────┐
                               │          FastAPI App Server            │
                               │   (Routes, Auth JWT, Streaming Engine) │
                               └─────────┬───────────────────┬──────────┘
                                         │                   │
               ┌─────────────────────────▼──────┐     ┌──────▼─────────────────────────┐
               │    Behavioral Risk Engine      │     │       ML Model Suite           │
               │  - 5-Factor Score Formula      │     │  - Isolation Forest (Anomaly)  │
               │  - Entity Baseline Profiles    │     │  - XGBoost (Classification)    │
               │  - Cold Start Peer Fallback    │     │  - One-Class SVM & Autoencoder │
               │  - Explainability & SHAP       │     │  - Concept Drift Monitor       │
               └────────────────────────────────┘     └────────────────────────────────┘
                                         │
                               ┌─────────▼──────────────────────────────┐
                               │     SQLite Database (Default Zero-Config)│
                               └────────────────────────────────────────┘
```

---

## 🧮 Transparent 5-Factor Risk Score Formula

$$\text{RiskScore} = 0.40 \cdot S_{\text{IsoForest}} + 0.30 \cdot P_{\text{XGBoost}} + 0.15 \cdot S_{\text{GeoVelocity}} + 0.10 \cdot S_{\text{DeviceNovelty}} + 0.05 \cdot S_{\text{TimeAnomaly}}$$

| Factor Component | Weight | Description |
| :--- | :---: | :--- |
| **Isolation Forest ($S_{\text{IsoForest}}$)** | 40% | Unsupervised anomaly score normalized from tree path length decisions. |
| **XGBoost Confidence ($P_{\text{XGBoost}}$)** | 30% | Multi-class probability confidence of identified attack scenario. |
| **Geo-Velocity ($S_{\text{GeoVelocity}}$)** | 15% | Haversine distance over time ($\text{km/h}$). Speeds $>800\text{ km/h}$ trigger Impossible Travel alerts. |
| **Device Novelty ($S_{\text{DeviceNovelty}}$)** | 10% | Detection of unverified hardware fingerprints or User-Agent anomalies. |
| **Time Anomaly ($S_{\text{TimeAnomaly}}$)** | 5% | Off-peak login deviation against entity historical working hours. |

---

## 📊 Requirements & Feature Matrix

| Requirement | Implementation Status | Sentinel AI Feature Component |
| :--- | :---: | :--- |
| **Synthetic Log Generator** | ✅ Complete | Vectorized NumPy/Faker engine generating 100,000+ logs with 7 attack scenarios |
| **Near Real-Time Streaming** | ✅ Complete | WebSocket `/ws/stream` pushing events every 1.5s with live dashboard pings |
| **Normal Behavior Modeling** | ✅ Complete | Entity baseline profiles tracking normal hours, countries, devices, and resources |
| **Cold Start Handling** | ✅ Complete | Peer group department fallbacks (DevOps, Finance, Sales, Admin) for new entities ($<10$ logs) |
| **Attack Classification** | ✅ Complete | XGBoost multi-class classifier mapping anomalies to Brute Force, Impossible Travel, etc. |
| **Explainable AI Scoring** | ✅ Complete | Transparent 5-Factor Risk Formula + SHAP feature importance + AI Mitigation Actions |
| **Analyst SOC Queue** | ✅ Complete | Priority queues, analyst assignment, notes, status changes, False Positive marking |
| **Replay Attack Simulator** | ✅ Complete | Interactive "▶ Replay" button playing multi-stage compromise scenarios step-by-step |
| **Multi-Model Benchmark** | ✅ Complete | Head-to-head research comparison (Isolation Forest, XGBoost, One-Class SVM, Autoencoder) |
| **PDF Threat Reports** | ✅ Complete | Server-side PDF exporter with executive metrics, top anomalies, and action items |

---

## ⚡ Quickstart Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**

### Single Command Launch (Windows)

Run the automated startup script from the project root:

```powershell
.\start.ps1
```

This initializes the virtual environment, starts FastAPI on `http://127.0.0.1:8000`, and launches Next.js on `http://localhost:3000` (or `3001`).

---

### Step-by-Step Manual Setup

#### 1. Backend & ML Setup
```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install requirements & seed database with trained ML models
pip install -r requirements.txt
python seed.py

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
FastAPI server runs at `http://127.0.0.1:8000` with interactive API docs at `http://127.0.0.1:8000/docs`.

#### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```
Open **`http://localhost:3000`** in your browser to access the Sentinel AI SOC Command Center.

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/v1/dashboard/` | `GET` | Returns aggregated KPIs, alert timelines, attack breakdown, top resources, and geo-map coordinates. |
| `/api/v1/alerts/` | `GET` | Query SOC alert queue with search, priority, attack type, and status filtering. |
| `/api/v1/alerts/{id}` | `PUT` | Update alert status, assigned analyst, and notes. |
| `/api/v1/ws/stream` | `WS` | WebSocket endpoint broadcasting near-real-time access events and anomaly scores. |
| `/api/v1/auth/login` | `POST` | Authenticate security analyst and receive JWT access token. |
| `/api/v1/report/pdf` | `GET` | Export downloadable executive PDF threat report. |

---

## 📂 Project Structure

```
sentinel-ai/
├── backend/                  # FastAPI Web Application & API Server
│   ├── app/
│   │   ├── api/             # REST & WebSocket route handlers
│   │   ├── core/            # Config, JWT authentication, & security
│   │   ├── db/              # SQLAlchemy models & SQLite/PostgreSQL connectors
│   │   └── main.py          # Application entry point & WebSocket stream server
│   ├── seed.py              # Data generator & model initialization script
│   └── requirements.txt     # Python dependencies
├── ml/                      # Machine Learning Engine & Data Generator
│   ├── generator.py         # Synthetic access log generator (Faker, NumPy, pandas)
│   ├── baselines.py         # Entity baseline builder & cold start peer group fallbacks
│   ├── preprocessor.py      # Feature extractor & Haversine geo velocity calculator
│   ├── risk_engine.py       # 5-Factor transparent risk score formula
│   ├── trainer.py           # Isolation Forest, XGBoost, One-Class SVM, & Autoencoder
│   └── explainability.py    # SHAP feature contributions & mitigation recommendations
├── frontend/                # Next.js 14 App Router Frontend
│   ├── src/
│   │   ├── app/             # Main App layout, login, register, and pages
│   │   ├── components/      # Dashboard, Alerts, Entity Timeline, Replay, Analytics, Modals
│   │   ├── context/         # AuthContext & ThemeContext (Light/Dark Mode)
│   │   └── lib/             # Axios API client & WebSocket utilities
├── start.ps1                # Automated Windows startup script
└── README.md                # System documentation & architectural reference
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
