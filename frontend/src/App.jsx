import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoadingFallback from './components/LoadingFallback';

// Practical 8: Route-Based Code Splitting using React.lazy()
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

      {/* Practical 8 Requirement: Wrap Routes block with Suspense and Fallback UI */}
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

export default App;
