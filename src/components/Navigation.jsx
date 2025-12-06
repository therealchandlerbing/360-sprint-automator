// ============================================
// Navigation Component
// Previous/Next step navigation
// ============================================

import React from 'react';
import { STEPS } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

/**
 * Step navigation buttons
 */
export const Navigation = ({
  currentStep,
  canProceed,
  onPrevious,
  onNext,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= STEPS.length - 1;

  return (
    <div className="nav-buttons" style={styles.navigation}>
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        style={{
          ...styles.navButton,
          ...styles.navButtonSecondary,
          ...(isFirstStep ? styles.navButtonDisabled : {}),
        }}
      >
        ← Previous Step
      </button>
      <button
        onClick={onNext}
        disabled={!canProceed || isLastStep}
        style={{
          ...styles.navButton,
          ...styles.navButtonPrimary,
          ...(!canProceed || isLastStep ? styles.navButtonDisabled : {}),
        }}
      >
        Next Step →
      </button>
    </div>
  );
};
