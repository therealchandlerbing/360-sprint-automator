// ============================================
// Process Button Component
// Main action button to process current step
// Enhanced with gradient, hover, and pressed states
// ============================================

import React, { useState, memo } from 'react';

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
 * Compute execute button style based on state
 */
const getExecuteButtonStyle = (isHovered, isPressed, isDisabled) => {
  const base = {
    width: '100%',
    padding: '16px 32px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  };

  if (isDisabled) {
    return {
      ...base,
      background: '#E2E8F0',
      color: '#A0AEC0',
      boxShadow: 'none',
      transform: 'none',
    };
  }

  if (isPressed) {
    return {
      ...base,
      background: 'linear-gradient(to bottom, #334155, #1E293B)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(0)',
    };
  }

  if (isHovered) {
    return {
      ...base,
      background: 'linear-gradient(to bottom, #64748B, #475569)',
      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
      transform: 'translateY(-1px)',
    };
  }

  return {
    ...base,
    background: 'linear-gradient(to bottom, #475569, #334155)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(0)',
  };
};

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
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isMinimalStep = !STEPS_WITH_CUSTOM_UI.includes(currentStep);
  const helperText = STEP_HELPER_TEXT[currentStep];

  // Minimal step layout - centered with helper text
  if (isMinimalStep) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        textAlign: 'center',
        padding: '48px 32px',
      }}>
        <button
          className="process-button"
          onClick={onClick}
          disabled={isDisabled}
          aria-busy={isProcessing}
          aria-label={isProcessing ? `Processing Step ${currentStep}` : `Execute Step ${currentStep}: ${stepName}`}
          style={{
            ...getExecuteButtonStyle(isHovered, isPressed, isDisabled),
            maxWidth: '400px',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
          onMouseDown={() => !isDisabled && setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
        >
          {isProcessing ? (
            <>
              <div className="spinner" aria-hidden="true" />
              Processing Step {currentStep}...
            </>
          ) : (
            `Execute Step ${currentStep}: ${stepName}`
          )}
        </button>
        {helperText && (
          <p style={{
            fontSize: '14px',
            color: '#718096',
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
      className="process-button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isProcessing}
      aria-label={isProcessing ? `Processing Step ${currentStep}` : `Execute Step ${currentStep}: ${stepName}`}
      style={getExecuteButtonStyle(isHovered, isPressed, isDisabled)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => !isDisabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {isProcessing ? (
        <>
          <div className="spinner" aria-hidden="true" />
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
