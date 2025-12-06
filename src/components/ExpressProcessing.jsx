// ============================================
// Express Processing Component
// Progress tracking UI during Express mode
// ============================================

import React, { memo, useEffect, useState } from 'react';
import { COLORS } from '../constants/colors.js';

const styles = {
  container: {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
    color: COLORS.white,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: COLORS.white,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  meta: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  },
  body: {
    padding: '24px',
  },
  stageInfo: {
    marginBottom: '20px',
  },
  stageLabel: {
    fontSize: '14px',
    color: COLORS.textMuted,
    marginBottom: '4px',
  },
  stageName: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  stageDescription: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  progressContainer: {
    marginBottom: '24px',
  },
  progressBarOuter: {
    height: '12px',
    backgroundColor: COLORS.border,
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.5s ease-out, background-color 0.3s ease',
  },
  progressMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    fontSize: '13px',
    color: COLORS.textMuted,
  },
  checklistContainer: {
    backgroundColor: COLORS.background,
    borderRadius: '12px',
    padding: '20px',
  },
  checklistTitle: {
    margin: '0 0 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  checklistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px',
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: COLORS.white,
    borderRadius: '8px',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  checklistItemComplete: {
    backgroundColor: '#D1FAE5',
  },
  checklistItemActive: {
    backgroundColor: '#FEF3C7',
    boxShadow: '0 0 0 2px rgba(245, 158, 11, 0.3)',
  },
  checklistItemPending: {
    opacity: 0.6,
  },
  checkIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  },
  checkIconComplete: {
    backgroundColor: '#10B981',
    color: COLORS.white,
  },
  checkIconActive: {
    backgroundColor: '#F59E0B',
    color: COLORS.white,
  },
  checkIconPending: {
    backgroundColor: COLORS.border,
    color: COLORS.textMuted,
  },
  checklistLabel: {
    flex: 1,
    color: COLORS.textPrimary,
  },
  cancelButton: {
    width: '100%',
    marginTop: '24px',
    padding: '14px 24px',
    backgroundColor: COLORS.white,
    color: COLORS.error,
    border: `1px solid ${COLORS.error}`,
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  timeEstimate: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 16px',
    backgroundColor: '#FEF3C7',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#92400E',
  },
};

// Define stages with their progress ranges and descriptions
const STAGES = [
  {
    id: 'foundation',
    name: 'Foundation Analysis',
    description: 'Analyzing executive brief, diagnostic assessment, and market maturity...',
    startPercent: 0,
    endPercent: 35,
    color: COLORS.phases['Foundation'].bg,
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive Validation',
    description: 'Conducting legitimacy analysis, needs assessment, personas, and ecosystem mapping...',
    startPercent: 35,
    endPercent: 65,
    color: COLORS.phases['Deep Dive'].bg,
  },
  {
    id: 'synthesis',
    name: 'Synthesis & Integration',
    description: 'Synthesizing findings, creating diagnostic comment, and features-needs matrix...',
    startPercent: 65,
    endPercent: 85,
    color: COLORS.phases['Synthesis'].bg,
  },
  {
    id: 'viability',
    name: 'Viability Assessment',
    description: 'Calculating final scores, gate decision, and generating recommendations...',
    startPercent: 85,
    endPercent: 95,
    color: COLORS.phases['Viability'].bg,
  },
  {
    id: 'formatting',
    name: 'Report Generation',
    description: 'Generating professional DOCX report with charts and formatting...',
    startPercent: 95,
    endPercent: 100,
    color: COLORS.primaryAccent,
  },
];

// Framework components checklist
const FRAMEWORK_COMPONENTS = [
  { id: 'exec-brief', label: 'Executive Brief (Step 0)', stageId: 'foundation' },
  { id: 'diagnostic', label: '40Q Diagnostic (Step 2)', stageId: 'foundation' },
  { id: 'maturity', label: 'Market Maturity (Step 3)', stageId: 'foundation' },
  { id: 'legitimacy', label: 'Legitimacy Analysis (Step 4)', stageId: 'deep-dive' },
  { id: 'needs', label: 'Needs & Personas (Steps 5-6)', stageId: 'deep-dive' },
  { id: 'ecosystem', label: 'Ecosystem Mapping (Steps 8-9)', stageId: 'deep-dive' },
  { id: 'synthesis', label: 'Diagnostic Synthesis (Step 10)', stageId: 'synthesis' },
  { id: 'features', label: 'Features-Needs Matrix (Step 11)', stageId: 'synthesis' },
  { id: 'viability', label: 'Viability Assessment (Step 12)', stageId: 'viability' },
  { id: 'report', label: 'Report Generation', stageId: 'formatting' },
];

/**
 * Get current stage based on percentage
 */
function getCurrentStage(percentage) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (percentage >= STAGES[i].startPercent) {
      return STAGES[i];
    }
  }
  return STAGES[0];
}

/**
 * Get component status based on current stage
 */
function getComponentStatus(componentId, currentStageId) {
  const currentStageIndex = STAGES.findIndex(s => s.id === currentStageId);
  const componentStageIndex = STAGES.findIndex(s => s.id === FRAMEWORK_COMPONENTS.find(c => c.id === componentId)?.stageId);

  if (componentStageIndex < currentStageIndex) return 'complete';
  if (componentStageIndex === currentStageIndex) return 'active';
  return 'pending';
}

/**
 * Format time remaining
 */
function formatTimeRemaining(percentage) {
  // Estimate based on 15-20 minute total time
  const avgTime = 17.5; // minutes
  const remaining = avgTime * (1 - percentage / 100);
  if (remaining < 1) return 'Less than 1 minute';
  if (remaining < 2) return 'About 1 minute';
  return `~${Math.ceil(remaining)} minutes`;
}

/**
 * Express Processing component showing progress during assessment
 */
const ExpressProcessingComponent = ({
  projectName,
  progress,
  startTime,
  onCancel,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const currentStage = getCurrentStage(progress.percentage);
  const elapsedMinutes = Math.floor(elapsedTime / 60);
  const elapsedSeconds = elapsedTime % 60;

  return (
    <section style={styles.container} aria-live="polite" aria-busy="true">
      {/* Keyframes for spinner animation */}
      <style>
        {`@keyframes spin { to { transform: rotate(360deg); } }`}
      </style>

      <header style={styles.header}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>
            <div style={styles.spinner} aria-hidden="true" />
            Generating 360 Business Validation Report
          </h2>
        </div>
        <div style={styles.meta}>
          Project: {projectName || 'Unnamed Project'} |
          Started: {startTime ? new Date(startTime).toLocaleTimeString() : '--'} |
          Duration: {elapsedMinutes}:{elapsedSeconds.toString().padStart(2, '0')}
        </div>
      </header>

      <div style={styles.body}>
        <div style={styles.timeEstimate}>
          <span aria-hidden="true">&#9201;</span>
          <span>Estimated remaining: {formatTimeRemaining(progress.percentage)}</span>
        </div>

        <div style={styles.stageInfo}>
          <div style={styles.stageLabel}>Current Stage</div>
          <div style={styles.stageName}>{currentStage.name}</div>
          <div style={styles.stageDescription}>{progress.message || currentStage.description}</div>
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBarOuter}>
            <div
              style={{
                ...styles.progressBarInner,
                width: `${progress.percentage}%`,
                backgroundColor: currentStage.color,
              }}
              role="progressbar"
              aria-valuenow={progress.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Assessment progress: ${progress.percentage}%`}
            />
          </div>
          <div style={styles.progressMeta}>
            <span>{progress.percentage}% complete</span>
            <span>
              {currentStage.startPercent}% - {currentStage.endPercent}%: {currentStage.name}
            </span>
          </div>
        </div>

        <div style={styles.checklistContainer}>
          <h3 style={styles.checklistTitle}>Framework Components</h3>
          <div style={styles.checklistGrid}>
            {FRAMEWORK_COMPONENTS.map((component) => {
              const status = getComponentStatus(component.id, currentStage.id);
              return (
                <div
                  key={component.id}
                  style={{
                    ...styles.checklistItem,
                    ...(status === 'complete' ? styles.checklistItemComplete : {}),
                    ...(status === 'active' ? styles.checklistItemActive : {}),
                    ...(status === 'pending' ? styles.checklistItemPending : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.checkIcon,
                      ...(status === 'complete' ? styles.checkIconComplete : {}),
                      ...(status === 'active' ? styles.checkIconActive : {}),
                      ...(status === 'pending' ? styles.checkIconPending : {}),
                    }}
                  >
                    {status === 'complete' && '✓'}
                    {status === 'active' && '...'}
                    {status === 'pending' && '○'}
                  </div>
                  <span style={styles.checklistLabel}>{component.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          style={styles.cancelButton}
          onClick={onCancel}
          aria-label="Cancel assessment"
        >
          Cancel Assessment
        </button>
      </div>
    </section>
  );
};

export const ExpressProcessing = memo(ExpressProcessingComponent);

// Export stages for external use
export { STAGES };
