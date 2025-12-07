// ============================================
// Sidebar Component
// Step navigation and session management
// Enhanced with step tooltips and session controls
// ============================================

import React, { useRef, useState, memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { STEPS, PHASES } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

// Estimated time for each step
const STEP_TIMES = {
  0: '20-30 min',
  1: '15-20 min',
  2: '30-45 min',
  3: '45-60 min',
  4: '30-40 min',
  5: '45-60 min',
  6: '30-45 min',
  7: '45-90 min',
  8: '30-40 min',
  9: '45-60 min',
  10: '25-35 min',
  11: '30-45 min',
  12: '2-4 hours',
};

// Phase icons
const PHASE_ICONS = {
  'Foundation': '◆',
  'Deep Dive': '◎',
  'Synthesis': '⬡',
  'Viability': '△',
};

// Helper to darken color for gradient
const darkenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

// Format relative time helper
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return `${Math.floor(diff / 86400000)} days ago`;
};

// Step tooltip styles
const tooltipStyles = {
  container: {
    position: 'absolute',
    left: 'calc(100% + 12px)',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '220px',
    padding: '12px 14px',
    backgroundColor: '#1A202C',
    color: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 100,
    pointerEvents: 'none',
  },
  arrow: {
    position: 'absolute',
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: '6px solid #1A202C',
  },
  title: {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '6px',
  },
  description: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.4',
    marginBottom: '10px',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  completed: {
    color: '#10B981',
  },
};

// Icon components for session controls
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 10l-4-4h2.5V2h3v4H12L8 10z"/>
    <path d="M2 12h12v2H2z"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2l4 4h-2.5v4h-3V6H4l4-4z"/>
    <path d="M2 12h12v2H2z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 2V1h5v1H14v1H2V2h3.5zM3 4h10l-.5 10H3.5L3 4zm3 2v6h1V6H6zm3 0v6h1V6H9z"/>
  </svg>
);

// Step Tooltip component
const StepTooltip = ({ step, isComplete, stepCompletionTimes }) => {
  const completionTime = stepCompletionTimes?.[step.id];

  return (
    <div style={tooltipStyles.container}>
      <div style={tooltipStyles.arrow} />
      <div style={tooltipStyles.title}>{step.name}</div>
      <div style={tooltipStyles.description}>{step.description}</div>
      <div style={tooltipStyles.meta}>
        <span>⏱ {STEP_TIMES[step.id] || '~15 min'}</span>
        {isComplete && (
          <span style={tooltipStyles.completed}>
            ✓ Completed {formatRelativeTime(completionTime)}
          </span>
        )}
      </div>
    </div>
  );
};

// Session control styles
const sessionControlStyles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: `1px solid ${COLORS.borderLight}`,
  },
  buttonGroup: {
    display: 'flex',
    gap: '4px',
  },
  iconButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  iconButtonHover: {
    backgroundColor: '#F7FAFC',
    borderColor: '#CBD5E0',
    color: COLORS.textPrimary,
  },
  iconButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  clearButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    color: '#A0AEC0',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  clearButtonHover: {
    color: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  clearButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

/**
 * Sidebar with step navigation and session controls
 * Memoized to prevent re-renders when input content changes
 */
const SidebarComponent = ({
  currentStep,
  stepOutputs,
  completedSteps,
  hasInput,
  isMobileMenuOpen,
  onStepSelect,
  onDownloadAllAsZip,
  onDownloadAllOutputs,
  onDownloadAllOutputsAsHtml,
  onExportSession,
  onImportSession,
  onClearSession,
}) => {
  const sessionInputRef = useRef(null);

  // State for hover effects
  const [hoveredStepId, setHoveredStepId] = useState(null);
  const [exportHovered, setExportHovered] = useState(false);
  const [importHovered, setImportHovered] = useState(false);
  const [clearHovered, setClearHovered] = useState(false);

  // Track step completion times (in-memory only)
  const [stepCompletionTimes] = useState(() => {
    // Initialize with current time for already completed steps
    const times = {};
    Object.keys(stepOutputs).forEach(id => {
      times[id] = Date.now();
    });
    return times;
  });

  // Auto-save indicator state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());
  const [saveDisplayTime, setSaveDisplayTime] = useState('Saved just now');

  // Update save display time
  React.useEffect(() => {
    const updateDisplayTime = () => {
      const diff = Date.now() - lastSaveTime;
      if (diff < 5000) setSaveDisplayTime('Saved just now');
      else if (diff < 60000) setSaveDisplayTime('Saved moments ago');
      else if (diff < 120000) setSaveDisplayTime('Saved 1 min ago');
      else setSaveDisplayTime(`Saved ${Math.floor(diff / 60000)} min ago`);
    };

    updateDisplayTime();
    const interval = setInterval(updateDisplayTime, 30000);
    return () => clearInterval(interval);
  }, [lastSaveTime]);

  // Trigger save indicator on changes
  React.useEffect(() => {
    if (Object.keys(stepOutputs).length > 0) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
        setLastSaveTime(Date.now());
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [stepOutputs]);

  const handleImportClick = () => {
    sessionInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportSession(file);
    }
    event.target.value = '';
  };

  const hasContent = completedSteps > 0 || hasInput;

  // Get phase badge style with gradient
  const getPhaseBadgeStyle = (phase) => {
    const colors = COLORS.phases[phase];
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '10px',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      background: `linear-gradient(135deg, ${colors.bg} 0%, ${darkenColor(colors.bg, 15)} 100%)`,
      color: colors.text,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    };
  };

  return (
    <aside
      id="navigation-sidebar"
      aria-label="Sprint steps navigation"
      className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}
      style={styles.sidebar}
    >
      <nav className="sidebar-card" style={styles.sidebarCard}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Steps</h2>
        </div>
        <div style={styles.stepsContainer} role="list">
          {PHASES.map(phase => (
            <div key={phase} style={styles.phaseGroup} role="group" aria-label={`${phase} phase`}>
              <div style={getPhaseBadgeStyle(phase)}>
                <span style={{ fontSize: '9px', opacity: 0.8 }}>{PHASE_ICONS[phase]}</span>
                <span>{phase}</span>
              </div>
              {STEPS.filter(s => s.phase === phase).map(step => {
                const isActive = currentStep === step.id;
                const isComplete = stepOutputs[step.id] !== undefined;
                const phaseColors = COLORS.phases[phase];
                return (
                  <div
                    key={step.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredStepId(step.id)}
                    onMouseLeave={() => setHoveredStepId(null)}
                  >
                    <button
                      onClick={() => onStepSelect(step.id)}
                      role="listitem"
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`Step ${step.id}: ${step.name}${isComplete ? ' (completed)' : ''}`}
                      style={{
                        ...styles.stepButton,
                        ...(isActive ? {
                          backgroundColor: phaseColors.light,
                          borderLeft: `3px solid ${phaseColors.bg}`,
                          marginLeft: '-3px',
                          paddingLeft: 'calc(12px - 3px)',
                        } : {}),
                      }}
                    >
                      <span
                        style={{
                          ...styles.stepNumber,
                          backgroundColor: isComplete
                            ? COLORS.success
                            : isActive
                              ? phaseColors.bg
                              : 'transparent',
                          border: isComplete || isActive
                            ? 'none'
                            : `2px solid ${COLORS.border}`,
                          color: isComplete || isActive
                            ? COLORS.white
                            : COLORS.textExtraMuted,
                          boxShadow: isComplete
                            ? '0 1px 3px rgba(16, 185, 129, 0.3)'
                            : isActive
                              ? `0 0 0 3px ${phaseColors.light}`
                              : 'none',
                        }}
                        aria-hidden="true"
                      >
                        {isComplete ? '✓' : step.id}
                      </span>
                      <span style={{
                        ...styles.stepName,
                        fontWeight: isActive ? '600' : '400',
                        color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
                      }}>
                        {step.name}
                      </span>
                    </button>
                    {hoveredStepId === step.id && (
                      <StepTooltip
                        step={step}
                        isComplete={isComplete}
                        stepCompletionTimes={stepCompletionTimes}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Download Buttons */}
        {completedSteps > 0 && (
          <div style={styles.downloadSection}>
            <button
              onClick={onDownloadAllAsZip}
              style={styles.downloadAllButton}
              aria-label="Download all outputs as ZIP bundle"
            >
              ↓ ZIP Bundle
            </button>
            <div style={styles.downloadButtonGroup}>
              <button
                onClick={onDownloadAllOutputs}
                style={styles.downloadButtonSecondary}
                aria-label="Download all outputs as Markdown"
              >
                ↓ MD
              </button>
              <button
                onClick={onDownloadAllOutputsAsHtml}
                style={styles.downloadButtonHtml}
                aria-label="Download all outputs as HTML"
              >
                ↓ HTML
              </button>
            </div>
          </div>
        )}

        {/* Session Management - Icon Toolbar */}
        <div style={sessionControlStyles.toolbar}>
          <div style={sessionControlStyles.buttonGroup}>
            <button
              onClick={onExportSession}
              disabled={completedSteps === 0}
              style={{
                ...sessionControlStyles.iconButton,
                ...(completedSteps === 0 ? sessionControlStyles.iconButtonDisabled : {}),
                ...(exportHovered && completedSteps > 0 ? sessionControlStyles.iconButtonHover : {}),
              }}
              onMouseEnter={() => setExportHovered(true)}
              onMouseLeave={() => setExportHovered(false)}
              title="Export Session"
              aria-label="Export Session"
            >
              <DownloadIcon />
            </button>
            <button
              onClick={handleImportClick}
              style={{
                ...sessionControlStyles.iconButton,
                ...(importHovered ? sessionControlStyles.iconButtonHover : {}),
              }}
              onMouseEnter={() => setImportHovered(true)}
              onMouseLeave={() => setImportHovered(false)}
              title="Import Session"
              aria-label="Import Session"
            >
              <UploadIcon />
            </button>
          </div>
          <button
            onClick={onClearSession}
            disabled={!hasContent}
            style={{
              ...sessionControlStyles.clearButton,
              ...(!hasContent ? sessionControlStyles.clearButtonDisabled : {}),
              ...(clearHovered && hasContent ? sessionControlStyles.clearButtonHover : {}),
            }}
            onMouseEnter={() => setClearHovered(true)}
            onMouseLeave={() => setClearHovered(false)}
            title="Clear Session"
            aria-label="Clear Session"
          >
            <TrashIcon />
          </button>
          <input
            type="file"
            ref={sessionInputRef}
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-hidden="true"
          />
        </div>

        {/* Auto-save indicator with pulsing dot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            fontSize: '12px',
            color: '#718096',
          }}
          role="status"
          aria-live="polite"
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            flexShrink: 0,
            animation: isSaving ? 'pulse 1s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: '14px', opacity: 0.7 }}>
            {isSaving ? '☁️' : '✓'}
          </span>
          <span>
            {isSaving ? 'Saving...' : saveDisplayTime}
          </span>
        </div>
      </nav>
    </aside>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const Sidebar = memo(SidebarComponent);
