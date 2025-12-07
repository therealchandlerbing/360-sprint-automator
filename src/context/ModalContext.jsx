// ============================================
// Modal Context
// Centralized modal management with portal rendering
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { COLORS } from '../constants/colors.js';

// Context
const ModalContext = createContext(null);

/**
 * Generic Modal Component
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    small: { maxWidth: '400px' },
    medium: { maxWidth: '560px' },
    large: { maxWidth: '800px' },
    fullscreen: { maxWidth: '95vw', maxHeight: '95vh' },
  };

  return createPortal(
    <div
      style={styles.overlay}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{ ...styles.modal, ...sizeStyles[size] }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div style={styles.header}>
            {title && (
              <h2 id="modal-title" style={styles.title}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={styles.closeButton}
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div style={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

/**
 * Confirm Dialog Component
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default', // 'default' | 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <p style={styles.message}>{message}</p>
      <div style={styles.buttonGroup}>
        <button onClick={onClose} style={styles.cancelButton}>
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          style={{
            ...styles.confirmButton,
            ...(variant === 'danger' ? styles.dangerButton : {}),
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

/**
 * Modal Provider Component
 */
export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  /**
   * Open a custom modal
   */
  const openModal = useCallback((id, component) => {
    setModals((prev) => [...prev.filter((m) => m.id !== id), { id, component }]);
  }, []);

  /**
   * Close a specific modal
   */
  const closeModal = useCallback((id) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  /**
   * Close all modals
   */
  const closeAllModals = useCallback(() => {
    setModals([]);
    setConfirmState(null);
  }, []);

  /**
   * Show a confirmation dialog (replaces window.confirm)
   * Returns a promise that resolves to true/false
   */
  const confirm = useCallback(
    ({ title, message, confirmText, cancelText, variant } = {}) => {
      return new Promise((resolve) => {
        setConfirmState({
          title,
          message,
          confirmText,
          cancelText,
          variant,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
    },
    []
  );

  /**
   * Show an alert dialog (replaces window.alert)
   * Returns a promise that resolves when closed
   */
  const alert = useCallback(({ title = 'Notice', message } = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        title,
        message,
        confirmText: 'OK',
        cancelText: null,
        onConfirm: () => resolve(),
        onCancel: () => resolve(),
      });
    });
  }, []);

  const handleConfirmClose = () => {
    confirmState?.onCancel?.();
    setConfirmState(null);
  };

  const handleConfirmConfirm = () => {
    confirmState?.onConfirm?.();
    setConfirmState(null);
  };

  const value = {
    openModal,
    closeModal,
    closeAllModals,
    confirm,
    alert,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}

      {/* Render custom modals */}
      {modals.map((modal) => (
        <React.Fragment key={modal.id}>{modal.component}</React.Fragment>
      ))}

      {/* Render confirm dialog */}
      {confirmState && (
        <ConfirmDialog
          isOpen={true}
          onClose={handleConfirmClose}
          onConfirm={handleConfirmConfirm}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
        />
      )}
    </ModalContext.Provider>
  );
};

/**
 * Hook to access modal context
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Export Modal component for custom usage
export { Modal };

// Styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s ease-out',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #E2E8F0',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#1A202C',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#718096',
    cursor: 'pointer',
    padding: '0',
    lineHeight: 1,
    marginLeft: '16px',
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
  },
  message: {
    margin: '0 0 24px',
    fontSize: '15px',
    color: '#4A5568',
    lineHeight: 1.6,
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A5568',
    backgroundColor: '#EDF2F7',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  confirmButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: COLORS.primaryAccent,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
};

// Add keyframe animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default ModalContext;
