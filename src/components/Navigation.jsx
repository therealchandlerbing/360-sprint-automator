// ============================================
// Navigation Component
// Previous/Next step navigation
// ============================================

import React, { memo } from 'react';
import { STEPS } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

/**
 * Step navigation buttons
 * Memoized to prevent unnecessary re-renders
 */
const NavigationComponent = ({
  currentStep,
  canProceed,
  onPrevious,
  onNext,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= STEPS.length - 1;

  return (
    <nav className="nav-buttons" style={styles.navigation} aria-label="Step navigation">
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        aria-label={isFirstStep ? 'No previous step' : `Go to Step ${currentStep - 1}`}
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
        aria-label={
          isLastStep
            ? 'No next step'
            : !canProceed
              ? 'Complete current step to proceed'
              : `Go to Step ${currentStep + 1}`
        }
        style={{
          ...styles.navButton,
          ...styles.navButtonPrimary,
          ...(!canProceed || isLastStep ? styles.navButtonDisabled : {}),
        }}
      >
        Next Step →
      </button>
    </nav>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const Navigation = memo(NavigationComponent);
