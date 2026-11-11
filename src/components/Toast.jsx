import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <FiCheckCircle className="toast-icon" />;
      case 'error': return <FiAlertCircle className="toast-icon" />;
      default: return <FiInfo className="toast-icon" />;
    }
  };

  return (
    <div className={`toast toast-${toast.type || 'info'}`}>
      {getIcon()}
      <span className="toast-message">{toast.message}</span>
      <button 
        onClick={() => onDismiss(toast.id)} 
        className="btn-icon toast-close" 
        style={{ width: '24px', height: '24px', border: 'none', background: 'transparent' }}
        aria-label="Dismiss notification"
      >
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
