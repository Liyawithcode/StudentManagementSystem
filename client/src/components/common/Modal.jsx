import React from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import './common.css';

export const Modal = ({ isOpen, onClose, title, children, size = 'md', className = '' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${sizeClasses[size] || 'modal-md'} ${className} animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header flex justify-between items-center">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
