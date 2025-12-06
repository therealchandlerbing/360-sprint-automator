// ============================================
// Process Button Component
// Main action button to process current step
// ============================================

import React, { memo } from 'react';
import { styles } from '../styles/appStyles.js';

/**
 * Process step execution button
 * Memoized to prevent unnecessary re-renders
 */
const ProcessButtonComponent = ({
  currentStep,
  stepName,
  isProcessing,
  isDisabled,
  onClick,
}) => {
  return (
    <button
      className="process-button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isProcessing}
      aria-label={isProcessing ? `Processing Step ${currentStep}` : `Execute Step ${currentStep}: ${stepName}`}
      style={{
        ...styles.processButton,
        ...(isDisabled ? styles.processButtonDisabled : {}),
      }}
    >
      {isProcessing ? (
        <>
          <div style={styles.spinner} aria-hidden="true" />
          Processing Step {currentStep}...
        </>
      ) : (
        `Execute Step ${currentStep}: ${stepName}`
      )}
    </button>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const ProcessButton = memo(ProcessButtonComponent);
