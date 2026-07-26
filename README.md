# Sentinel AI — Behavioural Anomaly Detection Platform for Cybersecurity

Sentinel AI is an enterprise-grade, full-stack cybersecurity platform designed to satisfy the **Honeywell Problem Statement**. It models normal access behavior for users and devices, detects near-real-time intrusions via WebSockets, classifies multi-stage cyber attacks, and calculates explainable 0–100 risk scores with actionable incident response workflows.

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │          Next.js 15 SOC UI             │
                               │  (Dashboard, Alerts, Timeline, Replay) │
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

## Requirements & Evaluation Matrix

| Requirement | Implementation Status | Sentinel AI Feature Component |
| :--- | :---: | :--- |
| **Synthetic Log Generator** | ✅ Complete | Vectorized NumPy/Faker engine generating 100,000+ logs with 7 attack scenarios |
| **Near Real-Time Streaming** | ✅ Complete | WebSocket `/ws/stream` pushing events every 1.5s with live dashboard pings |
| **Normal Behavior Modeling** | ✅ Complete | Entity baseline profiles tracking normal hours, countries, devices, and resources |
| **Cold Start Handling** | ✅ Complete | Peer group department fallbacks (DevOps, Finance, Sales, Admin) for new entities ($<10$ logs) |
| **Attack Classification** | ✅ Complete | XGBoost multi-class classifier mapping anomalies to Brute Force, Impossible Travel, etc. |
| **Explainable AI Scoring** | ✅ Complete | Transparent 5-Factor Risk Formula + SHAP feature importance + AI Mitigation Actions |
| **Analyst SOC Queue** | ✅ Complete | Priority queues, analyst assignment, notes, status changes, False Positive marking |
| **Replay Attack Simulator** | ✅ Complete | Interactive "▶ Replay Attack" button playing multi-stage compromise scenarios step-by-step |
| **Multi-Model Benchmark** | ✅ Complete | Head-to-head research comparison (Isolation Forest, XGBoost, One-Class SVM, Autoencoder) |
| **PDF Threat Reports** | ✅ Complete | Server-side PDF exporter with executive metrics, top anomalies, and action items |

---

## 🧮 Transparent 5-Factor Risk Score Formula

$$RiskScore = 0.40 \cdot S_{\text{IsoForest}} + 0.30 \cdot P_{\text{XGBoost}} + 0.15 \cdot S_{\text{GeoVelocity}} + 0.10 \cdot S_{\text{DeviceNovelty}} + 0.05 \cdot S_{\text{TimeAnomaly}}$$

- **Isolation Forest Score ($S_{\text{IsoForest}}$)**: Unsupervised anomaly score normalized from decision function.
- **XGBoost Confidence ($P_{\text{XGBoost}}$)**: Multi-class probability confidence of identified attack pattern.
- **Geo-Velocity Anomaly ($S_{\text{GeoVelocity}}$)**: Calculated using Haversine formula distance over time ($\text{km/h}$). Speeds $>800\text{ km/h}$ trigger Impossible Travel alerts.
- **Device Novelty ($S_{\text{DeviceNovelty}}$)**: Indicates unverified hardware fingerprints or User-Agent strings.
- **Time Anomaly ($S_{\text{TimeAnomaly}}$)**: Off-peak login deviation against entity historical working hours.

---

## 🧠 ML Model Selection Rationale

> **Why Isolation Forest + XGBoost instead of pure LSTM / Recurrent Neural Networks?**
> 1. **Data Imbalance & Lack of Labels**: Cybersecurity access logs typically contain $<3\%$ anomaly rates. Isolation Forest excels at unsupervised anomaly detection without requiring massive labeled attack data.
> 2. **Sub-Millisecond Inference**: Isolation Forest and XGBoost execute predictions in $<2\text{ms}$, making them ideal for sub-second real-time streaming pipelines.
> 3. **Explainability**: XGBoost feature importances and tree decision boundaries map directly to human-interpretable SHAP values and SOC reason codes.

---

## ⚡ Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### Windows: start the complete platform

After installing the backend and frontend dependencies once, run this from the
project root:

```bat
start.cmd
```

This starts FastAPI on `http://localhost:8000`, waits for it to become healthy,
and then starts Next.js on `http://localhost:3000`. Stopping the frontend also
stops the backend process started by the script.

### 1. Backend & ML Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python seed.py       # Seeds 100,000 synthetic records and trains models
uvicorn app.main:app --reload --port 8000
```
FastAPI server will run at `http://localhost:8000` with interactive API docs at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser to access the Sentinel AI SOC Dashboard.

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
├── frontend/                # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/             # Main App layout & pages
│   │   ├── components/      # Dashboard, Alerts, Entity Timeline, Replay, Analytics
│   │   └── lib/             # Axios API client & WebSocket utilities
├── docker/                  # Docker & Docker Compose configurations
└── README.md                # System documentation & sitemap
```
