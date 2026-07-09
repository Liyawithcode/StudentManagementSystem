import React from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ padding: '1rem 0' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>{message}</p>
        <div className="flex justify-between" style={{ gap: '1rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
