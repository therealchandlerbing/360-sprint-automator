// ============================================
// Application Styles (Inline for reliability)
// ============================================

import { COLORS } from '../constants/colors.js';

export const styles = {
  // Layout
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Header (Stripe-inspired)
  header: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
    padding: '20px 32px',
    borderBottom: `4px solid ${COLORS.primaryAccent}`,
  },
  headerInner: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    width: '48px',
    height: '48px',
    background: COLORS.primaryAccent,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: COLORS.white,
    boxShadow: '0 4px 12px rgba(0, 163, 181, 0.3)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: '-0.02em',
  },
  headerSubtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: COLORS.textOnDarkMuted,
  },
  progressSection: {
    textAlign: 'right',
  },
  progressLabel: {
    fontSize: '14px',
    color: COLORS.textOnDarkMuted,
    marginBottom: '8px',
  },
  progressValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.white,
  },
  progressBar: {
    width: '200px',
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: '4px',
    transition: 'width 0.4s ease',
  },

  // Main Layout
  mainLayout: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px 32px',
    display: 'flex',
    gap: '32px',
  },

  // Sidebar
  sidebar: {
    width: '280px',
    flexShrink: 0,
  },
  sidebarCard: {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    position: 'sticky',
    top: '24px',
  },
  sidebarHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  stepsContainer: {
    padding: '12px',
    maxHeight: 'calc(100vh - 280px)',
    overflowY: 'auto',
  },
  phaseGroup: {
    marginBottom: '16px',
  },
  phaseLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: COLORS.white,
    padding: '6px 12px',
    borderRadius: '6px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  stepButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    marginBottom: '4px',
  },
  stepButtonActive: {
    backgroundColor: COLORS.phases['Foundation'].light,
  },
  stepButtonComplete: {
    backgroundColor: COLORS.successLight,
  },
  stepNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  },
  stepName: {
    fontSize: '14px',
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  downloadAllButton: {
    margin: '16px',
    padding: '14px',
    width: 'calc(100% - 32px)',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  // Main Content
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  stepHeader: {
    marginBottom: '24px',
  },
  stepMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  phaseBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.white,
    padding: '6px 14px',
    borderRadius: '6px',
  },
  stepIndicator: {
    fontSize: '14px',
    color: COLORS.textMuted,
  },
  stepTitle: {
    margin: '0 0 8px',
    fontSize: '28px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: '-0.02em',
  },
  stepDescription: {
    margin: 0,
    fontSize: '16px',
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },

  // Cards
  card: {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '20px 24px',
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.background,
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cardBody: {
    padding: '24px',
  },

  // Form Elements
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    fontSize: '14px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '10px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '200px',
    lineHeight: 1.6,
    boxSizing: 'border-box',
  },
  uploadZone: {
    border: `2px dashed ${COLORS.border}`,
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: COLORS.background,
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  uploadText: {
    fontSize: '16px',
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  uploadHint: {
    fontSize: '14px',
    color: COLORS.textMuted,
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    marginBottom: '8px',
  },
  fileName: {
    flex: 1,
    fontSize: '14px',
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: '13px',
    color: COLORS.textMuted,
  },
  removeButton: {
    width: '24px',
    height: '24px',
    backgroundColor: '#FEE2E2',
    color: COLORS.error,
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },

  // Branch Selector
  branchGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '16px',
  },
  branchButton: {
    padding: '24px',
    backgroundColor: COLORS.background,
    border: `2px solid ${COLORS.border}`,
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s ease',
  },
  branchIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  branchName: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  branchDesc: {
    fontSize: '13px',
    color: COLORS.textMuted,
  },

  // Buttons
  processButton: {
    width: '100%',
    padding: '18px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(10, 37, 64, 0.2)',
  },
  processButtonDisabled: {
    backgroundColor: COLORS.border,
    color: COLORS.textMuted,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: COLORS.white,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  // Output
  outputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: COLORS.background,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  downloadButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  outputContent: {
    padding: '24px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  outputText: {
    margin: 0,
    fontSize: '13px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    lineHeight: 1.7,
    color: COLORS.textPrimary,
    whiteSpace: 'pre-wrap',
  },

  // Processing Log
  logContainer: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#1E293B',
    borderRadius: '10px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    fontSize: '13px',
  },
  logEntry: {
    color: '#94A3B8',
    marginBottom: '4px',
  },
  logTime: {
    color: '#64748B',
  },

  // Error
  errorBox: {
    padding: '16px 20px',
    backgroundColor: '#FEF2F2',
    border: `1px solid #FECACA`,
    borderRadius: '10px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: COLORS.error,
    fontSize: '15px',
  },

  // Navigation
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  navButton: {
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  navButtonSecondary: {
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
    border: `2px solid ${COLORS.border}`,
  },
  navButtonPrimary: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

// CSS styles for responsive design (to be injected as a style tag)
export const responsiveStyles = `
  @keyframes spin { to { transform: rotate(360deg); } }
  input:focus, textarea:focus { border-color: ${COLORS.primaryAccent} !important; }
  button:hover:not(:disabled) { transform: translateY(-1px); }

  /* Base styles for responsive elements (hidden on desktop) */
  .mobile-menu-btn { display: none; }
  .mobile-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .mobile-menu-btn {
      display: flex;
    }
    .mobile-overlay {
      display: block;
    }
    .header-inner {
      padding: 12px 16px !important;
    }
    .header-title {
      font-size: 16px !important;
    }
    .header-subtitle {
      display: none !important;
    }
    .progress-section {
      display: none !important;
    }
    .main-layout {
      flex-direction: column !important;
      padding: 16px !important;
      gap: 16px !important;
    }
    .sidebar {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 85% !important;
      max-width: 320px !important;
      height: 100vh !important;
      z-index: 1000 !important;
      transform: translateX(-100%) !important;
      transition: transform 0.3s ease !important;
    }
    .sidebar.open {
      transform: translateX(0) !important;
    }
    .sidebar-card {
      height: 100% !important;
      border-radius: 0 !important;
      position: relative !important;
      top: 0 !important;
    }
    .step-title {
      font-size: 22px !important;
    }
    .card-body {
      padding: 16px !important;
    }
    .card-header {
      padding: 14px 16px !important;
    }
    .upload-zone {
      padding: 24px 16px !important;
    }
    .branch-grid {
      grid-template-columns: 1fr !important;
    }
    .nav-buttons {
      flex-direction: column !important;
      gap: 12px !important;
    }
    .nav-buttons button {
      width: 100% !important;
    }
    .output-header {
      flex-direction: column !important;
      gap: 12px !important;
      align-items: stretch !important;
    }
    .output-buttons {
      display: flex !important;
      gap: 8px !important;
    }
    .output-buttons button {
      flex: 1 !important;
    }
  }

  @media (max-width: 480px) {
    .logo {
      width: 36px !important;
      height: 36px !important;
      font-size: 18px !important;
    }
    .header-title {
      font-size: 14px !important;
    }
    .step-title {
      font-size: 18px !important;
    }
    .process-button {
      padding: 14px 16px !important;
      font-size: 14px !important;
    }
  }
`;
