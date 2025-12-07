// ============================================
// Error Boundary Component
// Catches JavaScript errors and prevents app crashes
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors.js';

/**
 * Error Boundary component that catches JavaScript errors anywhere in the
 * child component tree and displays a fallback UI with data recovery options.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleCopyData = async () => {
    const { inputContent, stepOutputs, projectName } = this.props;

    const dataToSave = {
      timestamp: new Date().toISOString(),
      projectName: projectName || 'Untitled',
      inputContent: inputContent || '',
      stepOutputs: stepOutputs || {},
      error: this.state.error?.message || 'Unknown error',
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(dataToSave, null, 2));
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 3000);
    } catch (err) {
      // Fallback: create download
      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vianeo_recovery_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.setState({ copied: true });
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>⚠️</span>
            </div>

            <h1 style={styles.title}>Something went wrong</h1>

            <p style={styles.description}>
              The application encountered an unexpected error. Your work may be recoverable.
            </p>

            <div style={styles.errorBox}>
              <code style={styles.errorCode}>
                {this.state.error?.message || 'Unknown error occurred'}
              </code>
            </div>

            <div style={styles.actions}>
              <button
                onClick={this.handleCopyData}
                style={styles.primaryButton}
              >
                {this.state.copied ? '✓ Data Saved!' : '💾 Save My Work'}
              </button>

              <button
                onClick={this.handleReset}
                style={styles.secondaryButton}
              >
                Try to Recover
              </button>

              <button
                onClick={this.handleReload}
                style={styles.secondaryButton}
              >
                Reload Page
              </button>
            </div>

            <p style={styles.hint}>
              If this error persists, please save your work and try reloading the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details style={styles.details}>
                <summary style={styles.summary}>Technical Details</summary>
                <pre style={styles.stackTrace}>
                  {this.state.error?.stack}
                  {'\n\nComponent Stack:\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FAFC',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
    padding: '48px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: '24px',
  },
  icon: {
    fontSize: '64px',
  },
  title: {
    margin: '0 0 16px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#1A202C',
  },
  description: {
    margin: '0 0 24px',
    fontSize: '16px',
    color: '#4A5568',
    lineHeight: 1.6,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  errorCode: {
    fontSize: '13px',
    color: '#DC2626',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  primaryButton: {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: COLORS.primaryAccent,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  secondaryButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A5568',
    backgroundColor: '#EDF2F7',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  hint: {
    margin: 0,
    fontSize: '13px',
    color: '#718096',
  },
  details: {
    marginTop: '24px',
    textAlign: 'left',
  },
  summary: {
    cursor: 'pointer',
    fontSize: '14px',
    color: '#4A5568',
    marginBottom: '12px',
  },
  stackTrace: {
    fontSize: '11px',
    backgroundColor: '#1E293B',
    color: '#94A3B8',
    padding: '16px',
    borderRadius: '8px',
    overflow: 'auto',
    maxHeight: '200px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
};

export default ErrorBoundary;
