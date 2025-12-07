// ============================================
// Sidebar Component
// Step navigation and session management
// ============================================

import React, { useRef, memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { STEPS, PHASES } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

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
              <div style={{ ...styles.phaseLabel, backgroundColor: COLORS.phases[phase].bg }}>
                {phase}
              </div>
              {STEPS.filter(s => s.phase === phase).map(step => {
                const isActive = currentStep === step.id;
                const isComplete = stepOutputs[step.id] !== undefined;
                const phaseColors = COLORS.phases[phase];
                return (
                  <button
                    key={step.id}
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

        {/* Session Management */}
        <div style={styles.sessionSection}>
          <div style={styles.sessionSectionLabel}>
            Session
          </div>
          <input
            type="file"
            ref={sessionInputRef}
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-hidden="true"
          />
          <div style={styles.sessionButtonGroup}>
            <button
              onClick={onExportSession}
              disabled={completedSteps === 0}
              aria-label="Export session to JSON file"
              style={{
                ...styles.sessionButton,
                ...(completedSteps === 0 ? styles.sessionButtonDisabled : {}),
              }}
            >
              Export
            </button>
            <button
              onClick={handleImportClick}
              aria-label="Import session from JSON file"
              style={styles.sessionButton}
            >
              Import
            </button>
          </div>
          <button
            onClick={onClearSession}
            disabled={!hasContent}
            aria-label="Clear all session data"
            style={hasContent ? styles.clearSessionButton : styles.clearSessionButtonDisabled}
          >
            Clear Session
          </button>
          {/* Auto-save indicator */}
          <div
            style={styles.autoSaveIndicator}
            role="status"
            aria-live="polite"
          >
            Auto-saving enabled
          </div>
        </div>
      </nav>
    </aside>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const Sidebar = memo(SidebarComponent);
