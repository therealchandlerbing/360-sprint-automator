// ============================================
// Step Header Component
// Displays current step title and description
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

/**
 * Header for current step with phase badge and description
 */
export const StepHeader = ({ step, phase }) => {
  const phaseColor = COLORS.phases[phase];

  return (
    <div style={styles.stepHeader}>
      <div style={styles.stepMeta}>
        <span style={{ ...styles.phaseBadge, backgroundColor: phaseColor.bg }}>{phase}</span>
        <span style={styles.stepIndicator}>Step {step.id} of 12</span>
      </div>
      <h2 className="step-title" style={styles.stepTitle}>{step.name}</h2>
      <p style={styles.stepDescription}>{step.description}</p>
    </div>
  );
};
