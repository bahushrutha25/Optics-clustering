# OPTICS Clustering Dashboard 🚀

A modern, full-stack application for performing and visualizing **OPTICS** clustering. This project is split into a Python Flask backend and a Vite-powered frontend.

## 📁 Project Structure

- **`frontend/`**: Vanilla JavaScript + Vite dashboard.
- **`backend/`**: Python Flask API for machine learning processing.

---

## ⚡ Quick Start

### **1. Backend (Python)**
```bash
cd backend
pip install -r requirements.txt
python index.py
```
*Access API at: `http://localhost:5000`*

### **2. Frontend (Vite)**
```bash
cd frontend
npm install
npm run dev
```
*Access Dashboard at: `http://localhost:5173`*

---

## 🌐 Deployment (Vercel)

Both parts are independently deployable to Vercel.

### **Deploy Backend**
1. `cd backend`
2. `vercel`

### **Deploy Frontend**
1. `cd frontend`
2. `vercel`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in both folders and update the values:

- **Backend (`backend/.env`)**:
  - `FRONTEND_URL`: The URL of your deployed frontend (for CORS).
- **Frontend (`frontend/.env`)**:
  - `VITE_API_URL`: The URL of your deployed backend API.

---

## ✨ Features

- **Interactive Clustering**: Adjust `min_samples` and see real-time updates.
- **High-Performance Visualization**: Powered by Plotly.js.
- **Anomaly Detection**: Highlights outliers automatically.
- **Data Export**: Download results directly as a CSV.
- **Secure**: CORS and Environment Variable support.
