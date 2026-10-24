# Practical 12: CI/CD Pipeline with GitHub Actions

**Course Code:** ITUE301 - Advanced Web Development Frameworks  
**Course Outcomes (CO) / Program Outcomes (PO):** CO5 / PO3, PO5  
**Student Name:** Riya Thesia  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  

---

## 🎯 Objective
To automate testing and build verification of the full-stack Task Management application by configuring an automated Continuous Integration (CI) pipeline using **GitHub Actions**, integrating automated **Jest & Supertest** suites, observing pipeline failure on deliberate regression, and verifying automated green checks upon resolution.

---

## 📚 Theory & CI/CD Pipeline Concepts

### Coursera Alignment
*Reference: Week 12 GitHub Actions Masterclass (Packt) - Module 1 (Workflow Basics, Triggers, Jobs, Steps) & Module 2 (CI/CD Pipeline Setup, Automated Testing on Push)*

- **Continuous Integration (CI):** A DevOps development practice where developers merge their code changes into a central repository frequently, after which automated builds and tests are executed. CI aims to find and address bugs quicker, improve software quality, and reduce the time it takes to validate new code updates.
- **Continuous Deployment (CD):** The automated process of releasing every passing build directly to staging or production without manual human intervention.
- **Workflow:** A configurable automated process made up of one or more jobs defined in a YAML file under `.github/workflows/`.
- **Triggers (`on:`):** Specific repository events that execute the workflow (e.g., `push` to `main`, `pull_request`).
- **Runner:** A GitHub-hosted virtual machine (such as `ubuntu-latest`) that executes the jobs and individual steps.

---

## 🏗️ CI/CD Pipeline Flow Diagram

```
Developer Workspace (Local Machine)
        │
        ▼ git commit -m "feat: enhance task endpoints"
        │
        ▼ git push origin main
        │
┌───────┴────────────────────────────────────────────────────────────────┐
│                        GitHub Remote Repository                        │
│                                                                        │
│  GitHub Actions Event Trigger: [on: push (branch: main)]               │
│                               │                                        │
│                               ▼                                        │
│  Runner: ubuntu-latest (GitHub Virtual Machine)                        │
│  Job: build-and-test                                                   │
│                                                                        │
│    Step 1: actions/checkout@v4                                         │
│            └─ Clone repository code into runner workspace              │
│                                                                        │
│    Step 2: actions/setup-node@v4 (node-version: 18)                    │
│            └─ Configure Node.js runtime and cache npm dependencies     │
│                                                                        │
│    Step 3: npm install (backend)                                       │
│            └─ Install Express, Mongoose, Jest, Supertest               │
│                                                                        │
│    Step 4: npm test (backend)                                          │
│            ├── Run Jest integration test suite                         │
│            ├── GET / (Health Check 200 OK)                             │
│            ├── GET /api/tasks (Cache Headers & Array validation)       │
│            ├── GET /api/tasks/cache/stats (Cache metrics)              │
│            ├── POST /api/tasks (Task creation 201 Created)             │
│            └── POST /api/tasks (Empty title 400 Bad Request)           │
│                                                                        │
│    Step 5: npm install & npm run build (frontend)                      │
│            └─ Verify Vite dynamic code-splitting and asset bundles     │
│                                                                        │
│  Status Evaluation:                                                    │
│    ├── All Steps Passed ──► ✅ Green Checkmark (Build Passing)          │
│    └── Any Step Failed  ──► ❌ Red X (Email & Dashboard Alert Sent)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Step-by-Step Implementation Breakdown

### 1. Test Suite Installation (`backend/package.json`)
Installed `jest` and `supertest` as development dependencies in the backend project:
```bash
cd backend
npm install --save-dev jest supertest
```

Configured the `test` script in `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "test": "jest --detectOpenHandles --forceExit"
  }
}
```

### 2. Automated Integration Test Suite (`backend/tests/api.test.js`)
Developed tests verifying API health, data structure, caching headers, validation, and error handling:
```javascript
const request = require('supertest');
const app = require('../server');

describe('ITUE301 Full-Stack Task Manager REST API Test Suite', () => {

  it('GET / should return 200 OK and valid API metadata payload', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('API Active');
  });

  it('GET /api/tasks should return 200 OK and an array of task items', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.headers).toHaveProperty('x-cache');
  });

  it('POST /api/tasks should create a new task and return 201 Created', async () => {
    const newTask = {
      title: 'CI/CD Pipeline Validation Task',
      description: 'Verify automated Jest testing suite on GitHub Actions push',
      priority: 'high'
    };
    const res = await request(app).post('/api/tasks').send(newTask);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(newTask.title);
  });

  it('POST /api/tasks should return 400 Bad Request when title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });
});
```

### 3. GitHub Actions Workflow Configuration (`.github/workflows/ci.yml`)
Configured continuous integration workflow triggered on pushes to the `main` branch:
```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    name: Backend Test & Frontend Build Pipeline
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Runtime (v18.x)
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json

      - name: Install Backend Dependencies
        working-directory: ./backend
        run: npm install

      - name: Run Backend Automated Integration Tests
        working-directory: ./backend
        env:
          NODE_ENV: test
          PORT: 5000
        run: npm test

      - name: Install Frontend Dependencies
        working-directory: ./frontend
        run: npm install

      - name: Verify Frontend Production Build & Code Splitting
        working-directory: ./frontend
        run: npm run build
```

---

## 💥 Deliberate Failing Pipeline Demonstration & Resolution

### Step A: Introducing Deliberate Failure in Test
To demonstrate how CI intercepts bugs before they reach staging, an assertion in `backend/tests/api.test.js` was modified to expect an impossible HTTP status code:

```javascript
// DELIBERATE BUG INTRODUCED:
it('should return 404 Not Found for undefined routes', async () => {
  const res = await request(app).get('/api/nonexistent-route');
  expect(res.statusCode).toBe(200); // BUG: Actual response is 404, expected 200
});
```

### Step B: Observed CI Pipeline Failure (❌ Red X on GitHub Actions)
Upon pushing to `main`, GitHub Actions executed step `Run Backend Automated Integration Tests`. Jest exited with status code `1`, causing the job to fail immediately and halt subsequent build steps:

```
● ITUE301 Full-Stack Task Manager REST API Test Suite › GET /api/nonexistent-route › should return 404 Not Found for undefined routes

  expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 404

    58 |     it('should return 404 Not Found for undefined routes', async () => {
    59 |       const res = await request(app).get('/api/nonexistent-route');
  > 60 |       expect(res.statusCode).toBe(200);
         |                              ^
    61 |     });

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 passed, 6 total
Snapshots:   0 total
Time:        2.314 s
##[error]Process completed with exit code 1.
```
*(GitHub Actions marks the commit with a prominent ❌ Red Cross and notifies the team).*

### Step C: Correcting the Test Logic & Green Verification (✅ Passed)
Corrected the assertion to expect `404`:
```javascript
expect(res.statusCode).toBe(404);
```
Pushed the fix to `main`. GitHub Actions re-triggered automatically:

```
PASS tests/api.test.js
  ITUE301 Full-Stack Task Manager REST API Test Suite
    GET / (Server Root)
      √ should return 200 OK and valid API metadata payload (100 ms)
    GET /api/tasks
      √ should return 200 OK and an array of task items (13 ms)
    GET /api/tasks/cache/stats
      √ should return 200 OK and node-cache operational metrics (9 ms)
    POST /api/tasks
      √ should create a new task and return 201 Created (309 ms)
      √ should return 400 Bad Request when task title is missing or empty (13 ms)
    GET /api/nonexistent-route
      √ should return 404 Not Found for undefined routes (11 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        2.514 s
Ran all test suites.
```
*(Workflow marked with ✅ Green Checkmark, confirming all tests and frontend build succeeded).*

---

## 🔍 Key Analysis & Viva Questions

### Q1: What is the difference between Continuous Integration and Continuous Deployment, and which one does this practical actually demonstrate?
**Answer:**  
- **Continuous Integration (CI):** Focuses on automatically building, packaging, and testing code whenever a developer pushes commits to the repository. The objective is early bug detection and merge conflict reduction.
- **Continuous Deployment (CD):** Goes a step further by automatically pushing every build that passes the CI pipeline directly into the live production environment without manual human intervention.
- **This Practical:** Demonstrates **Continuous Integration (CI)**. It automatically triggers on `push`, spins up an isolated Ubuntu runner, installs dependencies, executes Jest API tests, and compiles the frontend bundle. It reports a pass/fail verification status, but does not deploy the containers to a cloud server.

### Q2: Why does running tests automatically on every push catch problems earlier than testing manually before a release?
**Answer:**  
1. **Immediate Feedback Loop:** Developers receive notifications within 1–2 minutes of pushing code while the mental context of what was just written is fresh.
2. **Pinpoint Error Isolation:** Because tests run per commit, the exact faulty commit and line of code causing the regression is immediately evident. In contrast, manual testing before a release checks dozens of combined commits, making root-cause debugging far more difficult and time-consuming.
3. **Eliminates Human Forgetfulness:** Manual testing frequently skips edge cases due to time constraints, while automated CI pipelines test the full suite consistently every single time.

### Q3: What would happen to the pipeline if the test file path were incorrect — would the workflow fail at the same step as a genuine test failure?
**Answer:**  
If the test file path or Jest configuration is incorrect:
- If Jest cannot locate any test files matching the pattern, Jest exits with an error code (e.g. `No tests found related to files...` or `exited with code 1`), failing at the `npm test` step with an execution configuration error rather than an assertion failure.
- If `npm test` script is not found in `package.json`, `npm` throws `npm ERR! Missing script: "test"` and terminates immediately.
- In both situations, the failure occurs at the **execution/setup layer** of step `Run Backend Automated Integration Tests`, whereas a genuine test failure reaches the test runner and fails during the **assertion phase** (`Expected: 200, Received: 404`).

---

## ⚠️ Troubleshooting Guide

| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| **Workflow does not appear under Actions tab** | File is not placed exactly in `.github/workflows/*.yml` | Verify exact relative path: `.github/workflows/ci.yml`. |
| **Workflow fails immediately with YAML syntax error** | Incorrect indentation or tab characters in YAML | Ensure consistent 2-space indentation throughout `.github/workflows/ci.yml`. |
| **`npm test` fails with 'no test specified'** | `test` script missing in `package.json` | Add `"test": "jest --detectOpenHandles --forceExit"` under `"scripts"`. |
| **Pipeline passes even with a broken test** | Test is purely trivial (e.g. `expect(true).toBe(true)`) | Write assertions against actual HTTP responses and payload properties. |

---

## 💡 Student Reflection
Implementing GitHub Actions demonstrated the immense value of shift-left testing. Observing the pipeline turn red on broken assertions and revert to a green checkmark upon resolution demystified automated DevOps pipelines. It guarantees that regressions are blocked before pull requests can be merged into production.
