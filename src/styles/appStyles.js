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
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(to right, #14B8A6, #0D9488)',
    borderRadius: '3px',
    transition: 'width 0.5s ease-out',
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
    borderRadius: '12px',
    border: '1px solid #EDF2F7',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
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
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: '600',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  stepName: {
    fontSize: '14px',
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  downloadAllButton: {
    padding: '12px',
    width: '100%',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
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
    fontSize: '12px',
    fontWeight: '400',
    color: '#A0AEC0',
    marginLeft: '12px',
  },
  stepTitle: {
    margin: '0 0 8px',
    fontSize: '32px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    color: '#1A202C',
  },
  stepDescription: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.5',
    color: '#4A5568',
    marginBottom: '32px',
  },

  // Cards
  card: {
    backgroundColor: COLORS.white,
    borderRadius: '12px',
    border: '1px solid #EDF2F7',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
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
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    color: '#1A202C',
    outline: 'none',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    color: '#1A202C',
    outline: 'none',
    resize: 'vertical',
    minHeight: '160px',
    lineHeight: 1.6,
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
  },
  uploadZone: {
    border: `2px dashed ${COLORS.border}`,
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: '#FAFAFA',
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
    border: `1px solid ${COLORS.border}`,
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
    padding: '16px 32px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
    background: 'linear-gradient(to bottom, #475569, #334155)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  processButtonDisabled: {
    background: '#E2E8F0',
    color: '#A0AEC0',
    cursor: 'not-allowed',
    boxShadow: 'none',
    transform: 'none',
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
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  navButtonSecondary: {
    backgroundColor: COLORS.white,
    color: '#4A5568',
    border: `1px solid ${COLORS.border}`,
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

  // Mobile menu button
  mobileMenuButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  mobileMenuIcon: {
    color: COLORS.white,
    fontSize: '20px',
  },

  // Session management buttons
  sessionSection: {
    padding: '20px 16px',
    borderTop: `1px solid ${COLORS.border}`,
    marginTop: '8px',
  },
  sessionSectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  sessionButtonGroup: {
    display: 'flex',
    gap: '10px',
  },
  sessionButton: {
    flex: 1,
    padding: '12px 10px',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: COLORS.background,
    color: COLORS.textPrimary,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
  },
  sessionButtonDisabled: {
    backgroundColor: COLORS.borderLight,
    color: COLORS.textMuted,
    cursor: 'not-allowed',
  },
  clearSessionButton: {
    width: '100%',
    marginTop: '12px',
    padding: '12px 10px',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#FEF2F2',
    color: COLORS.error,
    border: '1px solid #FECACA',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  clearSessionButtonDisabled: {
    width: '100%',
    marginTop: '12px',
    padding: '12px 10px',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: COLORS.borderLight,
    color: COLORS.textMuted,
    border: `1px solid ${COLORS.border}`,
    cursor: 'not-allowed',
  },
  autoSaveIndicator: {
    marginTop: '16px',
    padding: '8px',
    fontSize: '11px',
    color: COLORS.textMuted,
    textAlign: 'center',
    backgroundColor: COLORS.background,
    borderRadius: '6px',
  },

  // Methodology Modal Trigger (in header)
  methodologyTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: COLORS.textOnDarkMuted,
    transition: 'all 0.15s ease',
    marginRight: '20px',
  },
  methodologyTriggerIcon: {
    fontSize: '16px',
    opacity: 0.8,
  },

  // Methodology Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  modalContainer: {
    width: '100%',
    maxWidth: '680px',
    maxHeight: '80vh',
    backgroundColor: COLORS.white,
    borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px',
    borderBottom: `1px solid ${COLORS.border}`,
    flexShrink: 0,
  },
  modalTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: '-0.02em',
  },
  modalCloseButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '20px',
    color: COLORS.textMuted,
    transition: 'all 0.15s ease',
  },
  modalContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '28px',
  },
  modalSection: {
    marginBottom: '32px',
  },
  modalSectionHeader: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: COLORS.textMuted,
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: `2px solid ${COLORS.border}`,
  },
  modalHeroText: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: COLORS.textSecondary,
    marginBottom: '16px',
  },
  modalHeroEmphasis: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  dimensionCard: {
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '12px',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  },
  dimensionCardEmphasis: {
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '12px',
    borderLeftWidth: '6px',
    borderLeftStyle: 'solid',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  dimensionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  dimensionName: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dimensionBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.white,
  },
  dimensionThreshold: {
    fontSize: '13px',
    color: COLORS.textMuted,
    marginBottom: '8px',
  },
  dimensionQuestion: {
    fontSize: '14px',
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginBottom: '12px',
  },
  dimensionDetails: {
    fontSize: '13px',
    color: COLORS.textMuted,
    paddingLeft: '12px',
    borderLeft: `2px solid ${COLORS.border}`,
  },
  modalCallout: {
    backgroundColor: COLORS.background,
    padding: '16px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: 1.6,
    color: COLORS.textSecondary,
    borderLeft: `4px solid ${COLORS.primaryAccent}`,
    marginTop: '16px',
  },
  modalCalloutEmphasis: {
    backgroundColor: '#FEF3CD',
    padding: '16px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: 1.6,
    color: COLORS.textPrimary,
    borderLeft: `4px solid ${COLORS.warning}`,
    fontWeight: '500',
  },
  processPhase: {
    marginBottom: '16px',
  },
  processPhaseName: {
    fontSize: '15px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: '8px',
  },
  processPhaseList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px',
    color: COLORS.textSecondary,
    lineHeight: 1.7,
  },
  evidenceMarker: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    marginRight: '8px',
  },
  evidenceList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  evidenceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '10px',
    fontSize: '14px',
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  scoreRequirements: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  scoreItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '8px',
    fontSize: '14px',
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  scoreNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: '12px',
    fontWeight: '600',
    marginRight: '12px',
    flexShrink: 0,
  },
  outputList: {
    listStyle: 'disc',
    paddingLeft: '20px',
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: COLORS.textSecondary,
    lineHeight: 1.7,
  },
  decisionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  decisionCard: {
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  decisionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
  },
  decisionDesc: {
    fontSize: '12px',
    lineHeight: 1.5,
  },
  maturityStages: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
    padding: '16px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  maturityStage: {
    padding: '4px 10px',
    borderRadius: '4px',
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.border}`,
  },
  maturityArrow: {
    color: COLORS.textMuted,
  },
  modalFooter: {
    padding: '20px 28px',
    borderTop: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.background,
    fontSize: '13px',
    color: COLORS.textMuted,
    textAlign: 'center',
    flexShrink: 0,
  },

  // Download section
  downloadSection: {
    padding: '20px 16px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  downloadButtonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  downloadButtonSecondary: {
    flex: 1,
    padding: '10px 8px',
    backgroundColor: COLORS.primaryLight,
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  downloadButtonHtml: {
    flex: 1,
    padding: '10px 8px',
    backgroundColor: COLORS.primaryAccent,
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};

// CSS styles for responsive design (to be injected as a style tag)
export const responsiveStyles = `
  @keyframes spin { to { transform: rotate(360deg); } }
  input:focus, textarea:focus { border-color: ${COLORS.primaryAccent} !important; }
  button:hover:not(:disabled) { transform: translateY(-1px); }

  /* Modal animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .methodology-modal-overlay {
    animation: fadeIn 0.2s ease-out;
  }
  .methodology-modal-container {
    animation: scaleIn 0.2s ease-out;
  }

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

  /* Methodology trigger - class-based styling */
  .methodology-trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background-color: rgba(255,255,255,0.1);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
    transition: all 0.15s ease;
    margin-right: 20px;
  }
  .methodology-trigger:hover {
    background-color: rgba(255,255,255,0.2);
    color: #FFFFFF;
  }
  .methodology-trigger-icon {
    font-size: 16px;
    opacity: 0.8;
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
    .methodology-trigger {
      padding: 6px 10px;
      font-size: 13px;
      margin-right: 0;
    }
    .methodology-trigger span:last-child {
      display: none;
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
    /* Modal responsive styles for small screens */
    .decision-grid {
      grid-template-columns: 1fr;
    }
    .maturity-stages {
      font-size: 11px;
      gap: 4px;
      padding: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
`;
