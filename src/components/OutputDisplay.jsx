// ============================================
// Output Display Component
// Shows step output with copy/download options
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

/**
 * Output display with export options
 */
export const OutputDisplay = ({
  output,
  currentStep,
  copyFeedback,
  onCopy,
  onDownloadMd,
  onDownloadHtml,
}) => {
  if (!output) return null;

  return (
    <div style={{ ...styles.card, marginTop: '24px' }}>
      <div className="output-header" style={styles.outputHeader}>
        <h3 style={styles.cardTitle}>Output</h3>
        <div className="output-buttons" style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCopy}
            style={{
              ...styles.downloadButton,
              backgroundColor: copyFeedback === currentStep ? COLORS.success : COLORS.primaryLight,
            }}
          >
            {copyFeedback === currentStep ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button onClick={onDownloadMd} style={styles.downloadButton}>
            ↓ MD
          </button>
          <button onClick={onDownloadHtml} style={{ ...styles.downloadButton, backgroundColor: COLORS.primaryAccent }}>
            ↓ HTML
          </button>
        </div>
      </div>
      <div style={styles.outputContent}>
        <pre style={styles.outputText}>{output}</pre>
      </div>
    </div>
  );
};
