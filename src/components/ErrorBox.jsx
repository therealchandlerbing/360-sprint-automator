// ============================================
// Error Box Component
// Displays error messages
// ============================================

import React, { memo } from 'react';
import { styles } from '../styles/appStyles.js';

/**
 * Error message display
 * Memoized to prevent unnecessary re-renders
 */
const ErrorBoxComponent = ({ error }) => {
  if (!error) return null;

  return (
    <div
      style={styles.errorBox}
      role="alert"
      aria-live="assertive"
    >
      <span aria-hidden="true">⚠️</span>
      <span>{error}</span>
    </div>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const ErrorBox = memo(ErrorBoxComponent);
