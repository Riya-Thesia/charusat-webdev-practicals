# Practical 8: Performance Optimization & Lazy Loading in React
**Course:** ITUE301 - Advanced Web Development Frameworks  
**Student Name:** Riya Thesia  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  

---

## 🎯 Objective
To improve frontend performance, reduce initial JavaScript bundle download sizes, and implement code splitting using `React.lazy()` and `Suspense` fallbacks in a multi-route React application.

---

## 🏗️ Architecture & Code Splitting Diagram

```
BEFORE OPTIMIZATION (Single Monolithic Bundle):
index.html ──► main.bundle.js (299.7 kB) ──► Loads [Home][Projects][Contact][TasksPage][LoginPage] upfront

AFTER OPTIMIZATION (Dynamic Code-Split Chunks):
index.html ──► index.js (Entry: 261.25 kB) ──► Loads ONLY core routing framework
                ├── Home.chunk.js (4.80 kB)         ──► Loaded when '/' is visited
                ├── Projects.chunk.js (5.54 kB)     ──► Loaded when '/projects' is visited
                │    └── AnalyticsChart.chunk.js (3.34 kB) ──► Lazy loaded on button click
                ├── Contact.chunk.js (3.72 kB)      ──► Loaded when '/contact' is visited
                ├── TasksPage.chunk.js (10.91 kB)   ──► Loaded when '/tasks' is visited
                └── LoginPage.chunk.js (4.14 kB)    ──► Loaded when '/login' is visited
```

---

## 🛠️ Implementation Summary

### 1. Route-Based Code Splitting in `App.jsx`
Converted static page imports to dynamic `React.lazy()` dynamic imports and wrapped `<Routes>` with `<Suspense fallback={<LoadingFallback />}>`.

```jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingFallback from './components/LoadingFallback';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <div className="app-main-layout">
      <NavBar />
      <Suspense fallback={<LoadingFallback text="Loading requested route chunk..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}
```

### 2. Heavy Third-Party Component Lazy Loading (Supplementary Problem)
Inside `Projects.jsx`, the heavy analytics visualization component `AnalyticsChart.jsx` is lazy loaded on-demand only when requested by the user:

```jsx
const AnalyticsChart = lazy(() => import('../components/AnalyticsChart'));

{showAnalytics && (
  <Suspense fallback={<LoadingFallback text="Lazy loading AnalyticsChart.chunk.js..." />}>
    <AnalyticsChart />
  </Suspense>
)}
```

---

## 📊 Before & After Vite Build Output Comparison

| Chunk / Asset File | Type | Size | Gzip Size | Load Timing |
| :--- | :--- | :--- | :--- | :--- |
| `index-DRvhd5mF.js` | Core Entry Bundle | 261.25 kB | 83.59 kB | Initial Load |
| `TasksPage-BEzjnqIy.js` | Route Chunk | 10.91 kB | 3.78 kB | Lazy (On `/tasks` Visit) |
| `Projects-DlaUdfAu.js` | Route Chunk | 5.54 kB | 2.34 kB | Lazy (On `/projects` Visit) |
| `Home-DasREU9E.js` | Route Chunk | 4.80 kB | 1.80 kB | Lazy (On `/` Visit) |
| `LoginPage-Hpwfbe8U.js` | Route Chunk | 4.14 kB | 1.51 kB | Lazy (On `/login` Visit) |
| `Contact-Ca-iJV0R.js` | Route Chunk | 3.72 kB | 1.14 kB | Lazy (On `/contact` Visit) |
| `AnalyticsChart-BPqRgTaa.js` | Component Chunk | 3.34 kB | 1.24 kB | Lazy (On Demand Click) |
| `NotFound-7FkPoADB.js` | Route Chunk | 0.93 kB | 0.50 kB | Lazy (On 404 Route) |

---

## 🧠 Key Analysis & Viva Questions

1. **What is the difference between the initial bundle and a lazy-loaded chunk in terms of download timing?**
   - The **initial bundle** contains only the core runtime (React, React-Router DOM, layout shell) downloaded on first page visit.
   - A **lazy-loaded chunk** is downloaded asynchronously over HTTP only when the user navigates to the associated route or triggers the component.

2. **Why does lazy loading improve perceived performance even though total code downloaded stays similar?**
   - Browsers parse and execute JavaScript synchronously on the main thread. Reducing initial JS bundle size allows the browser to reach Time-to-Interactive (TTI) and First Contentful Paint (FCP) significantly faster. Code for unused pages is postponed until actually needed.

3. **When is lazy loading NOT worth the added complexity?**
   - For very small applications (e.g. under ~50KB total JS), code splitting adds additional HTTP network request roundtrips and minor state overhead without noticeable speed benefits.

---

## ✅ Evaluation Rubric Checklist
- [x] Implemented `React.lazy()` & `Suspense` for 5+ routes
- [x] Meaningful styled loading fallback UI
- [x] Lazy loaded heavy component (`AnalyticsChart.jsx`)
- [x] Verified Vite build output generated separate `.js` chunks
