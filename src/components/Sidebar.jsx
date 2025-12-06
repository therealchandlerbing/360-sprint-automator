// ============================================
// Sidebar Component
// Step navigation and session management
// ============================================

import React, { useRef } from 'react';
import { COLORS } from '../constants/colors.js';
import { STEPS, PHASES } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

/**
 * Sidebar with step navigation and session controls
 */
export const Sidebar = ({
  currentStep,
  stepOutputs,
  completedSteps,
  inputContent,
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

  return (
    <aside
      id="navigation-sidebar"
      role="navigation"
      aria-label="Sprint steps navigation"
      className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}
      style={styles.sidebar}
    >
      <div className="sidebar-card" style={styles.sidebarCard}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Steps</h2>
        </div>
        <div style={styles.stepsContainer}>
          {PHASES.map(phase => (
            <div key={phase} style={styles.phaseGroup}>
              <div style={{ ...styles.phaseLabel, backgroundColor: COLORS.phases[phase].bg }}>
                {phase}
              </div>
              {STEPS.filter(s => s.phase === phase).map(step => {
                const isActive = currentStep === step.id;
                const isComplete = stepOutputs[step.id] !== undefined;
                return (
                  <button
                    key={step.id}
                    onClick={() => onStepSelect(step.id)}
                    style={{
                      ...styles.stepButton,
                      ...(isActive ? { backgroundColor: COLORS.phases[phase].light } : {}),
                      ...(isComplete && !isActive ? styles.stepButtonComplete : {}),
                    }}
                  >
                    <span style={{
                      ...styles.stepNumber,
                      backgroundColor: isComplete ? COLORS.success : isActive ? COLORS.phases[phase].bg : COLORS.border,
                      color: isComplete || isActive ? COLORS.white : COLORS.textSecondary,
                    }}>
                      {isComplete ? '✓' : step.id}
                    </span>
                    <span style={styles.stepName}>{step.name}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Download Buttons */}
        {completedSteps > 0 && (
          <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.border}` }}>
            <button onClick={onDownloadAllAsZip} style={styles.downloadAllButton}>
              ↓ ZIP Bundle
            </button>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button onClick={onDownloadAllOutputs} style={{ ...styles.downloadAllButton, flex: 1, backgroundColor: COLORS.primaryLight }}>
                ↓ MD
              </button>
              <button onClick={onDownloadAllOutputsAsHtml} style={{ ...styles.downloadAllButton, flex: 1, backgroundColor: COLORS.primaryAccent }}>
                ↓ HTML
              </button>
            </div>
          </div>
        )}

        {/* Session Management */}
        <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Session
          </div>
          <input
            type="file"
            ref={sessionInputRef}
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onExportSession}
              disabled={completedSteps === 0}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: completedSteps > 0 ? COLORS.background : COLORS.borderLight,
                color: completedSteps > 0 ? COLORS.textPrimary : COLORS.textMuted,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                cursor: completedSteps > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Export
            </button>
            <button
              onClick={handleImportClick}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: COLORS.background,
                color: COLORS.textPrimary,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Import
            </button>
          </div>
          <button
            onClick={onClearSession}
            disabled={completedSteps === 0 && !inputContent.trim()}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: (completedSteps > 0 || inputContent.trim()) ? '#FEF2F2' : COLORS.borderLight,
              color: (completedSteps > 0 || inputContent.trim()) ? COLORS.error : COLORS.textMuted,
              border: `1px solid ${(completedSteps > 0 || inputContent.trim()) ? '#FECACA' : COLORS.border}`,
              borderRadius: '8px',
              cursor: (completedSteps > 0 || inputContent.trim()) ? 'pointer' : 'not-allowed',
            }}
          >
            Clear Session
          </button>
          {/* Auto-save indicator */}
          <div style={{
            marginTop: '12px',
            fontSize: '11px',
            color: COLORS.textMuted,
            textAlign: 'center',
          }}>
            Auto-saving enabled
          </div>
        </div>
      </div>
    </aside>
  );
};
