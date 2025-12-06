// ============================================
// Processing Log Component
// Displays real-time processing logs
// ============================================

import React, { memo } from 'react';
import { styles } from '../styles/appStyles.js';

/**
 * Processing log display
 * Memoized to prevent unnecessary re-renders
 */
const ProcessingLogComponent = ({ logs }) => {
  if (logs.length === 0) return null;

  return (
    <div
      style={styles.logContainer}
      role="log"
      aria-live="polite"
      aria-label="Processing log"
    >
      {logs.map((log, idx) => (
        <div key={`${log.time}-${idx}`} style={styles.logEntry}>
          <span style={styles.logTime}>[{log.time}]</span> {log.message}
        </div>
      ))}
    </div>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const ProcessingLog = memo(ProcessingLogComponent);
