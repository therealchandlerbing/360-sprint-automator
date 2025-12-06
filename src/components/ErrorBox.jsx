// ============================================
// Error Box Component
// Displays error messages
// ============================================

import React from 'react';
import { styles } from '../styles/appStyles.js';

/**
 * Error message display
 */
export const ErrorBox = ({ error }) => {
  if (!error) return null;

  return (
    <div style={styles.errorBox}>
      <span>⚠️</span>
      <span>{error}</span>
    </div>
  );
};
