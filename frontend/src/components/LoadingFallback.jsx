import React from 'react';

// Practical 8: Fallback UI Component for React.lazy() and Suspense
const LoadingFallback = ({ text = "Loading route chunk..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1.2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        position: 'relative',
        width: '64px',
        height: '64px'
      }}>
        <div style={{
          boxSizing: 'border-box',
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid rgba(99, 102, 241, 0.15)',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{
          boxSizing: 'border-box',
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '48px',
          height: '48px',
          border: '4px solid transparent',
          borderBottom: '4px solid #a855f7',
          borderRadius: '50%',
          animation: 'spin-reverse 1.2s linear infinite'
        }} />
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

      <div style={{
        fontSize: '1.05rem',
        fontWeight: '600',
        color: '#4b5563',
        letterSpacing: '0.02em'
      }}>
        {text}
      </div>
      <div style={{
        fontSize: '0.85rem',
        color: '#9ca3af'
      }}>
        ⚡ Practical 8: Dynamic Code Splitting Chunk Loading...
      </div>
    </div>
  );
};

export default LoadingFallback;
