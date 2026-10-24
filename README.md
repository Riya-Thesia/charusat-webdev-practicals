# ITUE301 Advanced Web Development Frameworks - Practicals Hub

![CI Pipeline](https://github.com/riyathesia/charusat-webdev-practicals/actions/workflows/ci.yml/badge.svg)
![Docker](https://img.shields.io/badge/docker-compose%20ready-blue.svg)
![License](https://img.shields.io/badge/course-ITUE301%20CHARUSAT-orange.svg)

**Student Name:** Riya Thesia  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Course Code:** ITUE301  
**Project:** Full-Stack Task Management & Developer Portfolio Application  

---

## 🚀 Repository Structure Overview

```
charusat-webdev-practicals/
├── .github/
│   └── workflows/
│       └── ci.yml             # Practical 12: GitHub Actions CI Automated Pipeline
├── backend/
│   ├── .dockerignore          # Practical 11: Ignore node_modules & env from Docker build
│   ├── Dockerfile             # Practical 11: Node.js Express Backend Dockerfile
│   ├── config/
│   │   ├── db.js              # MongoDB Connection Manager (Compose service resolution)
│   │   └── cache.js           # Practical 9: In-Memory Caching (node-cache, 60s TTL)
│   ├── events/
│   │   ├── taskEvents.js      # Practical 10: Node.js Native EventEmitter Singleton
│   │   └── taskListeners.js   # Practical 10: Non-blocking Async Event Handlers
│   ├── middleware/            # Logging, Validation & Global Error Handlers
│   ├── models/Task.js         # Mongoose Task Schema
│   ├── routes/
│   │   ├── authRoutes.js      # JWT Authentication Routes
│   │   └── taskRoutes.js      # REST API Routes + Caching + Event Emission
│   ├── tests/
│   │   └── api.test.js        # Practical 12: Automated Integration Tests (Jest & Supertest)
│   └── server.js              # Express API Server Initialization
├── frontend/
│   ├── .dockerignore          # Practical 11: Ignore node_modules & dist from Docker build
│   ├── Dockerfile             # Practical 11: Multi-Stage Vite Frontend Dockerfile
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsChart.jsx # Practical 8: Heavy Component Lazy Loaded
│   │   │   └── LoadingFallback.jsx# Practical 8: React Suspense Fallback Spinner
│   │   ├── pages/
│   │   │   ├── Home.jsx, Projects.jsx, Contact.jsx, TasksPage.jsx, LoginPage.jsx
│   │   └── App.jsx            # Practical 8: React.lazy() & Suspense Route Code-Splitting
│   └── package.json
├── docker-compose.yml         # Practical 11: 3-Tier Multi-Container Orchestration (Mongo+API+UI)
├── PRACTICAL_8.md             # Practical 8 Performance Optimization Report & Build Metrics
├── PRACTICAL_9.md             # Practical 9 In-Memory Caching & Latency Comparison Report
├── PRACTICAL_10.md            # Practical 10 Asynchronous Event-Driven Architecture Report
├── PRACTICAL_11.md            # Practical 11 Containerization with Docker & Docker Compose
└── PRACTICAL_12.md            # Practical 12 CI/CD Pipeline with GitHub Actions & Jest
```

---

## 📋 Practicals Summary Table

| Practical | Topic & Focus Area | Implementation Details | Report File |
| :--- | :--- | :--- | :--- |
| **Practical 1-3** | Fundamentals & Components | HTML/CSS layout, React components, state, props & router | `frontend/src/` |
| **Practical 4-5** | Express REST API & MongoDB | Node.js Express server, MongoDB integration, CRUD endpoints | `backend/server.js` |
| **Practical 6-7** | Full-Stack Integration & Auth | Axios/Fetch integration, JWT authentication, CORS handling | `backend/routes/authRoutes.js` |
| **Practical 8** | **Performance & Lazy Loading** | `React.lazy()`, `Suspense`, Vite dynamic code splitting chunks | [`PRACTICAL_8.md`](./PRACTICAL_8.md) |
| **Practical 9** | **In-Memory Caching** | Server-side `node-cache` (60s TTL), cache invalidation, latency metrics | [`PRACTICAL_9.md`](./PRACTICAL_9.md) |
| **Practical 10**| **Asynchronous Event-Driven** | Native Node.js `EventEmitter`, non-blocking listeners, timestamp proof | [`PRACTICAL_10.md`](./PRACTICAL_10.md) |
| **Practical 11**| **Docker Containerization** | Multi-stage Dockerfiles, `docker-compose.yml`, MongoDB named volume, bridge network | [`PRACTICAL_11.md`](./PRACTICAL_11.md) |
| **Practical 12**| **CI/CD with GitHub Actions** | `.github/workflows/ci.yml`, automated Jest/Supertest suite, regression analysis | [`PRACTICAL_12.md`](./PRACTICAL_12.md) |

---

## ⚡ Quick Start Instructions

### 1. Run Complete Stack via Docker Compose (Practical 11)
Launch the entire 3-tier containerized stack (Frontend, Backend, and MongoDB) with a single command:
```bash
docker-compose up --build
```
- **Frontend App:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **MongoDB Server:** `localhost:27017`

---

### 2. Run Automated CI Tests Locally (Practical 12)
Execute the automated Jest integration test suite covering root health, caching, task creation, validation, and error states:
```bash
cd backend
npm test
```

---

### 3. Local Development Mode (Without Docker)

#### Backend Server:
```bash
cd backend
npm install
npm run dev
# Express Server will listen on http://localhost:5000
```

#### Frontend Development Server:
```bash
cd frontend
npm install
npm run dev
# Vite Dev Server will listen on http://localhost:5173
```
