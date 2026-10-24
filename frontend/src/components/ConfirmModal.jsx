import React from 'react';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card animate-pop">
        <h3 className="modal-title">🗑️ {title || 'Confirm Action'}</h3>
        <p className="modal-message">{message || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>
        
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
