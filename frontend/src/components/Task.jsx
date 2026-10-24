import React, { useEffect } from 'react';

function Task({ task, onClose }) {
  useEffect(() => {
    if (task) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [task, onClose]);

  if (!task) return null;

  return (
    <div className={`task-notification toast-notification task-${task.type || 'info'} animate-slide-in`}>
      <span className="task-icon toast-icon">
        {task.type === 'success' && '✅'}
        {task.type === 'error' && '❌'}
        {task.type === 'info' && 'ℹ️'}
      </span>
      <span className="task-message toast-message">{task.message}</span>
      {onClose && (
        <button className="task-close toast-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}

export default Task;
