// ============================================
// Output Display Component
// Shows step output with copy/download options
// ============================================

import React, { memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

/**
 * Output display with export options
 * Memoized to prevent unnecessary re-renders
 */
const OutputDisplayComponent = ({
  output,
  currentStep,
  copyFeedback,
  onCopy,
  onDownloadMd,
  onDownloadHtml,
}) => {
  if (!output) return null;

  return (
    <section style={{ ...styles.card, marginTop: '24px' }} aria-label="Step output">
      <div className="output-header" style={styles.outputHeader}>
        <h3 style={styles.cardTitle}>Output</h3>
        <div className="output-buttons" style={{ display: 'flex', gap: '8px' }} role="group" aria-label="Export options">
          <button
            onClick={onCopy}
            aria-label={copyFeedback === currentStep ? 'Copied to clipboard' : 'Copy output to clipboard'}
            style={{
              ...styles.downloadButton,
              backgroundColor: copyFeedback === currentStep ? COLORS.success : COLORS.primaryLight,
            }}
          >
            {copyFeedback === currentStep ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button
            onClick={onDownloadMd}
            style={styles.downloadButton}
            aria-label="Download output as Markdown file"
          >
            ↓ MD
          </button>
          <button
            onClick={onDownloadHtml}
            style={{ ...styles.downloadButton, backgroundColor: COLORS.primaryAccent }}
            aria-label="Download output as HTML file"
          >
            ↓ HTML
          </button>
        </div>
      </div>
      <div style={styles.outputContent}>
        <pre style={styles.outputText} aria-label="Generated output content">{output}</pre>
      </div>
    </section>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const OutputDisplay = memo(OutputDisplayComponent);
