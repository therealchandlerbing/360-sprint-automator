// ============================================
// Processing Log Component
// Displays real-time processing logs
// ============================================

import React from 'react';
import { styles } from '../styles/appStyles.js';

/**
 * Processing log display
 */
export const ProcessingLog = ({ logs }) => {
  if (logs.length === 0) return null;

  return (
    <div style={styles.logContainer}>
      {logs.map((log, idx) => (
        <div key={idx} style={styles.logEntry}>
          <span style={styles.logTime}>[{log.time}]</span> {log.message}
        </div>
      ))}
    </div>
  );
};
