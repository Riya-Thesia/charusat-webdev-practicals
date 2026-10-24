# Practical 11: Containerization with Docker and Docker Compose

**Course Code:** ITUE301 - Advanced Web Development Frameworks  
**Course Outcomes (CO) / Program Outcomes (PO):** CO5 / PO3, PO5  
**Student Name:** Riya Thesia  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  

---

## 🎯 Objective
To containerize the full-stack Task Management application (React Frontend, Node.js/Express Backend, and MongoDB Database) using Docker and orchestrate all three services simultaneously using Docker Compose with inter-container networking, persistent volumes, and optimized multi-stage builds.

---

## 📚 Theory & Architectural Concepts

### Coursera Alignment
*Reference: Week 11 IBM: Introduction to Containers with Docker, Kubernetes & OpenShift*
- **Containerization:** Packaging an application with all its libraries, dependencies, and system tools into an immutable container image that runs uniformly across development, staging, and production environments.
- **Docker Compose:** A declarative YAML-driven tool for defining and running multi-container Docker applications.
- **Inter-Container Networking:** Docker creates an automatic private bridge network (`app-network`) with embedded DNS, allowing services to address each other by their service names (e.g., `mongodb:27017` or `backend:5000`) instead of hardcoded IP addresses or `localhost`.

---

## 🏗️ Multi-Container Architecture Diagram

```
Host Operating System / Browser (Windows / Linux / macOS)
│
├── Port 5173 ──► http://localhost:5173 (React Frontend Client)
├── Port 5000 ──► http://localhost:5000 (Express REST API Backend)
└── Port 27017 ─► localhost:27017 (MongoDB Compass / Host Access)
│
┌───────────────────────── docker-compose.yml ─────────────────────────┐
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │               Docker Bridge Network (`app-network`)          │   │
│   │                                                              │   │
│   │   ┌──────────────────┐               ┌──────────────────┐    │   │
│   │   │  frontend        │   API Calls   │  backend         │    │   │
│   │   │  (React + Vite)  ├──────────────►│  (Node.js/Exp)   │    │   │
│   │   │  Port: 5173      │               │  Port: 5000      │    │   │
│   │   └──────────────────┘               └────────┬─────────┘    │   │
│   │                                               │              │   │
│   │                                        Mongoose Connection   │   │
│   │                                               │              │   │
│   │                                               ▼              │   │
│   │                                      ┌──────────────────┐    │   │
│   │                                      │  mongodb         │    │   │
│   │                                      │  (Official Mongo)│    │   │
│   │                                      │  Port: 27017     │    │   │
│   │                                      └────────┬─────────┘    │   │
│   └───────────────────────────────────────────────┼──────────────┘   │
│                                                   │                  │
│                                           Persistent Volume Mount    │
│                                                   ▼                  │
│                                         ┌──────────────────┐         │
│                                         │ Named Volume:    │         │
│                                         │ `mongo-data`     │         │
│                                         │ (/data/db)       │         │
│                                         └──────────────────┘         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Implementation Breakdown

### 1. Backend Containerization (`backend/Dockerfile`)
The backend service utilizes a lightweight Alpine Linux Node.js image, copies dependency manifests first to maximize Docker layer caching, installs dependencies inside the Linux environment, and exposes port 5000:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000
CMD ["node", "server.js"]
```

### 2. Frontend Multi-Stage Build (`frontend/Dockerfile`)
To minimize image size and eliminate development build tooling from the runtime image, a **multi-stage build** is implemented:
- **Stage 1 (`build`):** Installs packages and runs `npm run build` to compile JSX, CSS, and assets into static distribution bundles in `/app/dist`.
- **Stage 2 (`runner`):** Copies only the compiled `/dist` folder, configuration, and minimal runtime dependencies to serve the application via `vite preview --host 0.0.0.0 --port 5173`.

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/vite.config.js ./
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### 3. Build Context Optimization with `.dockerignore`
Both `frontend/.dockerignore` and `backend/.dockerignore` prevent host machine files from contaminating the container image context:
```
node_modules
npm-debug.log
dist
.env
.git
.gitignore
```

### 4. Service Orchestration (`docker-compose.yml`)
The root `docker-compose.yml` configures all three services, port bindings, environment variables, startup order, persistent volumes, and a shared custom network:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: charusat-task-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: charusat-task-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=mongodb://mongodb:27017/taskdb
      - JWT_SECRET=charusat_itue301_production_jwt_secret_key_2026
    depends_on:
      - mongodb
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: charusat-task-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mongo-data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### 5. Backend Dynamic Service Discovery (`backend/config/db.js`)
Configured `db.js` to automatically connect to `mongodb://mongodb:27017/taskdb` via environment variable or default fallback:
```javascript
const mongoUri = process.env.MONGO_URI || 'mongodb://mongodb:27017/taskdb';
const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
```

---

## 🔍 Key Analysis & Viva Questions

### Q1: Why does the backend container need to reference the MongoDB container by its service name (`mongodb`) rather than `localhost`?
**Answer:**  
In Docker, each container has its own isolated network stack and private loopback interface (`127.0.0.1` / `localhost`). If the backend container attempts to connect to `localhost:27017`, it is querying its own local network interface where no MongoDB daemon is running.  
When containers join a user-defined Docker bridge network (e.g., `app-network`), Docker runs an **internal DNS server**. It automatically registers container aliases matching their Compose service names (`mongodb`, `backend`, `frontend`). Therefore, `mongodb://mongodb:27017/taskdb` is resolved by Docker DNS directly to the internal IP assigned to the MongoDB container.

### Q2: What is the difference between `EXPOSE` in a Dockerfile and the `ports` mapping in `docker-compose.yml`?
**Answer:**  
- **`EXPOSE <port>` (Dockerfile):** Acts as image documentation and metadata indicating which port the process inside the container is designed to listen on. It does **not** publish or bind the port to the host machine.
- **`ports: ["host:container"]` (docker-compose.yml):** Explicitly maps a port from the host machine to a port inside the container via host NAT/iptables rules. For instance, `"5173:5173"` routes incoming traffic on host port 5173 into port 5173 of the container, allowing host web browsers to reach the containerized service.

### Q3: Why is it bad practice to copy `node_modules` into a Docker image instead of running `npm install` inside the container?
**Answer:**  
1. **OS / Architecture Incompatibility:** Native C/C++ compiled binaries (such as `bcrypt`, `node-gyp`, or platform-specific Rollup/Rolldown bindings) compiled on the host OS (e.g., Windows x64 MSVC) will crash inside a Linux container (e.g., Linux Alpine x64).
2. **Build Context Bloat & Slowness:** `node_modules` can consist of tens of thousands of small files totaling 200MB–800MB. Copying this into the Docker build context severely slows down the build process.
3. **Reproducibility:** Running `npm install` (or `npm ci`) inside the container against `package-lock.json` guarantees clean, consistent dependency trees built natively for the target container environment.

---

## ⚡ Execution & Verification Commands

### 1. Build and Start the Entire Stack
```bash
docker-compose up --build -d
```

### 2. Verify Running Containers
```bash
docker ps
```
**Expected Output:**
```
CONTAINER ID   IMAGE                         COMMAND                  STATUS         PORTS                    NAMES
a1b2c3d4e5f6   charusat-frontend:latest      "npm run preview -- …"   Up 2 minutes   0.0.0.0:5173->5173/tcp   charusat-task-frontend
b2c3d4e5f6a1   charusat-backend:latest       "node server.js"         Up 2 minutes   0.0.0.0:5000->5000/tcp   charusat-task-backend
c3d4e5f6a1b2   mongo:6.0                     "docker-entrypoint.s…"   Up 2 minutes   0.0.0.0:27017->27017/tcp charusat-task-mongodb
```

### 3. Verify End-to-End API Health Inside Stack
```bash
curl http://localhost:5000/
```
**Expected Response:**
```json
{
  "status": "API Active",
  "course": "ITUE301 Advanced Web Development Frameworks",
  "student": "Riya Thesia (CHARUSAT)",
  "practicals": "Practicals 4, 5, 6, 7, 8, 9, 10, 11 Full-Stack Task Manager"
}
```

### 4. Verify MongoDB Data Persistence Across Restarts
```bash
# Stop containers
docker-compose down

# Restart stack without rebuilding
docker-compose up -d

# Verify data still intact from named volume `mongo-data`
curl http://localhost:5000/api/tasks
```

---

## ⚠️ Troubleshooting Guide

| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| **Backend cannot connect to MongoDB** | Connection string uses `localhost` instead of Compose service name `mongodb` | Set `MONGO_URI: mongodb://mongodb:27017/taskdb` in `docker-compose.yml`. |
| **Port already in use error (`Bind for 0.0.0.0:5000 failed`)** | A previous local Express process or container is already occupying port 5000 | Stop host processes or run `docker ps` and `docker stop <id>`. |
| **Extremely slow Docker image build** | `node_modules` on the host machine being transferred into build context | Verify `.dockerignore` exists with `node_modules` listed. |
| **Frontend blank / cannot reach API** | Frontend container running without binding to `0.0.0.0` | Add `--host 0.0.0.0` flag to Vite preview server command. |

---

## 💡 Student Reflection
Containerizing this full-stack project reinforced how production applications isolate operational concerns. Configuring `docker-compose.yml` highlighted the significance of internal Docker DNS service resolution over hardcoded hostnames, while named volumes demonstrated how stateless containers can manage stateful data without risking data loss across lifecycles.
