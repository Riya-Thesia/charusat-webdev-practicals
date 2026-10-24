import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

function NotFound() {
  return (
    <div className="page-container not-found-page">
      <div className="not-found-card animate-pop">
        <AlertCircle size={64} className="not-found-icon" />
        <h1 className="not-found-code">404</h1>
        <h2>Page Not Found</h2>
        <p className="not-found-desc">
          The route you navigated to does not exist in the React Router configuration.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Return to Home Page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
