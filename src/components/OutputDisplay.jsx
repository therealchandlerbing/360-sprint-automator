// ============================================
// Output Display Component
// Shows step output with copy/download options
// Enhanced with expand/collapse and styled container
// ============================================

import React, { memo, useState, useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

// Threshold for collapsible output (in characters)
const LONG_OUTPUT_THRESHOLD = 1500;

// Output display styles
const outputStyles = {
  container: {
    backgroundColor: '#FAFAFA',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    overflow: 'hidden',
    marginTop: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#F7FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  title: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4A5568',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#4A5568',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  actionButtonSuccess: {
    backgroundColor: COLORS.success,
    color: '#FFFFFF',
    border: '1px solid ' + COLORS.success,
  },
  expandButton: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#4A5568',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  content: {
    padding: '16px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#1A202C',
    position: 'relative',
  },
  contentCollapsed: {
    maxHeight: '300px',
    overflow: 'hidden',
  },
  fade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: 'linear-gradient(transparent, #FAFAFA)',
    pointerEvents: 'none',
  },
  pre: {
    margin: 0,
    fontSize: '13px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    lineHeight: 1.7,
    color: '#1A202C',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  downloadGroup: {
    display: 'flex',
    gap: '4px',
  },
  downloadButton: {
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};

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
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expanded state when output or step changes
  useEffect(() => {
    setIsExpanded(false);
  }, [output, currentStep]);

  if (!output) return null;

  const isLong = output.length > LONG_OUTPUT_THRESHOLD;
  const isCopied = copyFeedback === currentStep;

  return (
    <section style={outputStyles.container} aria-label="Step output">
      <div className="output-header" style={outputStyles.header}>
        <h3 style={outputStyles.title}>Output</h3>
        <div className="output-buttons" style={outputStyles.actions} role="group" aria-label="Export options">
          <button
            onClick={onCopy}
            aria-label={isCopied ? 'Copied to clipboard' : 'Copy output to clipboard'}
            style={{
              ...outputStyles.actionButton,
              ...(isCopied ? outputStyles.actionButtonSuccess : {}),
            }}
          >
            {isCopied ? '✓ Copied' : 'Copy'}
          </button>
          {isLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={outputStyles.expandButton}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse output' : 'Expand output'}
            >
              {isExpanded ? '↑ Collapse' : '↓ Expand'}
            </button>
          )}
          <div style={outputStyles.downloadGroup}>
            <button
              onClick={onDownloadMd}
              style={outputStyles.downloadButton}
              aria-label="Download output as Markdown file"
            >
              ↓ MD
            </button>
            <button
              onClick={onDownloadHtml}
              style={{ ...outputStyles.downloadButton, backgroundColor: COLORS.primaryAccent }}
              aria-label="Download output as HTML file"
            >
              ↓ HTML
            </button>
          </div>
        </div>
      </div>
      <div style={{
        ...outputStyles.content,
        ...(isLong && !isExpanded ? outputStyles.contentCollapsed : {}),
      }}>
        <pre style={outputStyles.pre} aria-label="Generated output content">{output}</pre>
        {isLong && !isExpanded && <div style={outputStyles.fade} />}
      </div>
    </section>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const OutputDisplay = memo(OutputDisplayComponent);
