# My-Portfolio

A fullstack portfolio application engineered with **Java Spring Boot 3** and **React (Vite)**, powered by **Neon Serverless PostgreSQL**.

---

## 🏗️ Architecture & Scalable Folder Structure

```
My Portfolio/
├── backend/                       # Spring Boot 3.4.3 (Java 21) REST API
│   ├── mvnw / mvnw.cmd            # Maven Wrapper
│   ├── pom.xml                    # Spring Boot dependencies (JPA, Postgres, Web)
│   └── src/
│       ├── main/
│       │   ├── java/com/portfolio/
│       │   │   ├── BackendApplication.java     # Main Entry Point
│       │   │   ├── config/                     # Web & CORS Configuration
│       │   │   │   └── WebConfig.java
│       │   │   ├── controller/                 # REST Controllers
│       │   │   │   ├── HealthController.java   # GET /api/health (Test route)
│       │   │   │   └── ProjectController.java  # GET/POST /api/projects
│       │   │   ├── model/                      # JPA Entities & DTOs
│       │   │   │   ├── ApiResponse.java
│       │   │   │   └── Project.java
│       │   │   ├── repository/                 # Spring Data JPA Repositories
│       │   │   │   └── ProjectRepository.java
│       │   │   └── service/                    # Business Logic & Seed Data
│       │   │       └── ProjectService.java
│       │   └── resources/
│       │       ├── application.properties      # Main Config (Dev fallback & Neon)
│       │       └── application-neon.properties # Production Neon PostgreSQL Config
│       └── test/
├── frontend/                      # React 19 + Vite Application
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js             # Vite config with backend proxy (:8081)
│   └── src/
│       ├── App.jsx                # Main Portfolio UI
│       ├── index.css              # Custom Dark-Mode Design System
│       ├── components/            # Modular React Components
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── BackendStatusCard.jsx # Live Test Route UI for /api/health
│       │   ├── ProjectsSection.jsx   # Live JPA Data & POST Project Form
│       │   ├── NeonGuideCard.jsx     # Neon DB setup steps
│       │   ├── Footer.jsx
│       │   └── Icons.jsx
│       └── services/
│           └── api.js             # API client calls
├── neon.ts                        # Neon configuration definition
├── package.json                   # Root package metadata
└── .gitignore                     # Monorepo gitignore rules
```

---

## ⚡ Quick Start

### 1. Backend (Spring Boot 3)
```bash
cd backend
./mvnw.cmd spring-boot:run
```
- Server runs on: `http://localhost:8081`
- Test health route: `http://localhost:8081/api/health`
- Test projects route: `http://localhost:8081/api/projects`
- In-memory H2 DB console: `http://localhost:8081/h2-console`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- UI available at: `http://localhost:5173`

---

## 🐘 Neon Database Setup

The project is linked to Neon Project `green-lab-52718513` on branch `production`.

To authenticate and deploy Neon configuration:
```bash
# 1. Login to Neon via your browser
neon login

# 2. Link the repository to your Neon project
neon link --project-id green-lab-52718513 --branch production -y

# 3. Deploy Neon configuration
neon deploy
```
To run Spring Boot directly against your Neon database:
```bash
cd backend
$env:NEON_DATABASE_URL="your-neon-postgres-connection-string"
$env:SPRING_PROFILES_ACTIVE="neon"
./mvnw.cmd spring-boot:run
```
