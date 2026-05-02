# OPTICS Clustering Dashboard 🚀

A modern, full-stack application for performing and visualizing **OPTICS** clustering. This project features a Python Flask backend and a React (Vite) frontend, both optimized for deployment on Vercel.

## 📁 Project Structure

- **`frontend/`**: React + Vite + Plotly.js dashboard.
- **`backend/`**: Python Flask API using Scikit-Learn.

---

## ⚡ Quick Start

### **1. Backend (Python)**
```bash
cd backend
pip install -r requirements.txt
python api/index.py
```
*API running at: `http://localhost:5000`*

### **2. Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```
*Dashboard running at: `http://localhost:5173`*

---

## 🌐 Deployment (Vercel)

The project is pre-configured for independent deployment on Vercel.

### **Deploy Backend**
1. `cd backend`
2. `vercel`
3. Set `FRONTEND_URL` in Vercel environment variables to your frontend URL.

### **Deploy Frontend**
1. `cd frontend`
2. `vercel`
3. Set `VITE_API_URL` in Vercel environment variables to your backend URL.

---

## ✨ Features

- **Interactive Clustering**: Adjust `min_samples` and see real-time updates.
- **React-Powered UI**: Fast, component-based dashboard.
- **High-Performance Visualization**: Powered by Plotly.js.
- **Anomaly Detection**: Highlights outliers automatically.
- **Data Export**: Download processed results as a CSV.
- **Vercel Ready**: Optimized configurations for serverless deployment.
