// ============================================
// Process Button Component
// Main action button to process current step
// Enhanced with gradient, hover, and pressed states
// ============================================

import React, { memo } from 'react';
import { COLORS } from '../constants/colors.js';

// Helper text for each step
const STEP_HELPER_TEXT = {
  1: 'Generates program-specific application documentation from your Executive Brief.',
  2: 'Runs 40-question diagnostic across Team, Technology, Management, and Commercial dimensions.',
  3: 'Scores your venture across the 5 VIANEO dimensions with weighted thresholds.',
  4: 'Validates problem legitimacy and documents means inventory.',
  5: 'Analyzes WHO needs WHAT, WHY they need it, and HOW they will use it.',
  6: 'Builds evidence-based personas from requester analysis.',
  7: 'Creates interactive needs qualification matrix with priority zones.',
  8: 'Maps ecosystem players, influencers, and potential blockers.',
  9: 'Visualizes value network and relationship flows.',
  10: 'Synthesizes all findings into executive decision brief.',
  11: 'Aligns features to validated needs for MVP scoping.',
  12: 'Renders final viability assessment and gate recommendation.',
};

// Steps that have custom input UI (not minimal)
const STEPS_WITH_CUSTOM_UI = [0];

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
  const isMinimalStep = !STEPS_WITH_CUSTOM_UI.includes(currentStep);
  const helperText = STEP_HELPER_TEXT[currentStep];

  // Minimal step layout - centered with helper text
  if (isMinimalStep) {
    return (
      <div className="minimal-step-layout" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        textAlign: 'center',
        padding: '48px 32px',
      }}>
        <button
          className={`process-button ${isProcessing ? 'loading' : ''}`}
          onClick={onClick}
          disabled={isDisabled}
          aria-busy={isProcessing}
          aria-label={isProcessing ? `Processing Step ${currentStep}` : `Execute Step ${currentStep}: ${stepName}`}
          style={{ maxWidth: '400px' }}
        >
          {isProcessing ? (
            <>
              <div className="spinner" aria-hidden="true" />
              <span>Executing Step {currentStep}...</span>
            </>
          ) : (
            `Execute Step ${currentStep}: ${stepName}`
          )}
        </button>
        {helperText && (
          <p style={{
            fontSize: '14px',
            color: COLORS.textMuted,
            marginTop: '20px',
            maxWidth: '400px',
            lineHeight: '1.5',
          }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // Standard layout for Step 0
  return (
    <button
      className={`process-button ${isProcessing ? 'loading' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isProcessing}
      aria-label={isProcessing ? `Processing Step ${currentStep}` : `Execute Step ${currentStep}: ${stepName}`}
    >
      {isProcessing ? (
        <>
          <div className="spinner" aria-hidden="true" />
          <span>Executing Step {currentStep}...</span>
        </>
      ) : (
        `Execute Step ${currentStep}: ${stepName}`
      )}
    </button>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const ProcessButton = memo(ProcessButtonComponent);
