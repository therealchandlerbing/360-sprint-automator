// ============================================
// Toast Notification Context
// Provides app-wide toast notifications
// ============================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { COLORS } from '../constants/colors.js';

// Context
const ToastContext = createContext(null);

// Toast types with their styling
const TOAST_TYPES = {
  success: {
    icon: '✓',
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  error: {
    icon: '✕',
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  warning: {
    icon: '⚠',
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  info: {
    icon: 'ℹ',
    backgroundColor: COLORS.primaryAccent,
    borderColor: '#0891B2',
  },
};

// Individual Toast Component
const Toast = ({ id, type, message, onDismiss }) => {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;

  return (
    <div
      style={{
        ...styles.toast,
        backgroundColor: config.backgroundColor,
        borderLeft: `4px solid ${config.borderColor}`,
      }}
      role="alert"
      aria-live="polite"
    >
      <span style={styles.icon}>{config.icon}</span>
      <span style={styles.message}>{message}</span>
      <button
        onClick={() => onDismiss(id)}
        style={styles.dismissButton}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div style={styles.container} aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onDismiss={onDismiss}
        />
      ))}
    </div>,
    document.body
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = {
    success: (message, duration) => addToast('success', message, duration),
    error: (message, duration) => addToast('error', message, duration),
    warning: (message, duration) => addToast('warning', message, duration),
    info: (message, duration) => addToast('info', message, duration),
    dismiss: dismissToast,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Styles
const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '400px',
    width: '100%',
    pointerEvents: 'none',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '10px',
    color: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.3s ease-out',
    pointerEvents: 'auto',
  },
  icon: {
    fontSize: '16px',
    fontWeight: '700',
    flexShrink: 0,
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: 1.4,
  },
  dismissButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 4px',
    lineHeight: 1,
    flexShrink: 0,
  },
};

// Add keyframe animation to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default ToastContext;
