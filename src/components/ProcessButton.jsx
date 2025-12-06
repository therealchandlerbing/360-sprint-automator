// ============================================
// Process Button Component
// Main action button to process current step
// ============================================

import React from 'react';
import { styles } from '../styles/appStyles.js';

/**
 * Process step execution button
 */
export const ProcessButton = ({
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
      style={{
        ...styles.processButton,
        ...(isDisabled ? styles.processButtonDisabled : {}),
      }}
    >
      {isProcessing ? (
        <>
          <div style={styles.spinner} />
          Processing Step {currentStep}...
        </>
      ) : (
        `Execute Step ${currentStep}: ${stepName}`
      )}
    </button>
  );
};
