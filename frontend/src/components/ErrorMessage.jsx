import React from 'react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h4 className="error-title">Failed to load data</h4>
        <p className="error-description">{message || 'An error occurred while communicating with the backend API.'}</p>
        
        {}
        {onRetry && (
          <button className="btn btn-danger btn-sm" onClick={onRetry} style={{ marginTop: '0.75rem' }}>
            🔄 Retry Request
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
