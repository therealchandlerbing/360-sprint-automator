// ============================================
// Step Header Component
// Displays current step title and description
// ============================================

import React, { memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

/**
 * Header for current step with phase badge and description
 * Memoized to prevent unnecessary re-renders
 */
const StepHeaderComponent = ({ step, phase }) => {
  const phaseColor = COLORS.phases[phase];

  return (
    <header style={styles.stepHeader} aria-label={`Step ${step.id}: ${step.name}`}>
      <div style={styles.stepMeta}>
        <span
          style={{ ...styles.phaseBadge, backgroundColor: phaseColor.bg }}
          aria-label={`Phase: ${phase}`}
        >
          {phase}
        </span>
        <span style={styles.stepIndicator}>Step {step.id} of 12</span>
      </div>
      <h2 className="step-title" style={styles.stepTitle}>{step.name}</h2>
      <p style={styles.stepDescription}>{step.description}</p>
    </header>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const StepHeader = memo(StepHeaderComponent);
