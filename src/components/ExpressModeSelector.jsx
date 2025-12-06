// ============================================
// Express Mode Selector Component
// Mode selection UI for Step 0 page
// ============================================

import React, { memo } from 'react';
import { COLORS } from '../constants/colors.js';

const styles = {
  container: {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.background,
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  body: {
    padding: '24px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  optionCard: {
    padding: '24px',
    borderRadius: '12px',
    border: `2px solid ${COLORS.border}`,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: COLORS.white,
  },
  optionCardSelected: {
    borderColor: COLORS.primaryAccent,
    backgroundColor: '#F0FDFA',
    boxShadow: '0 0 0 4px rgba(0, 163, 181, 0.1)',
  },
  optionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
  },
  radioCircle: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: `2px solid ${COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  radioCircleSelected: {
    borderColor: COLORS.primaryAccent,
    backgroundColor: COLORS.primaryAccent,
  },
  radioInner: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: COLORS.white,
  },
  optionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 1.3,
  },
  optionBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '4px',
  },
  optionDescription: {
    margin: '0 0 12px',
    fontSize: '14px',
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  featureList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: COLORS.textSecondary,
    marginBottom: '8px',
  },
  featureIcon: {
    fontSize: '14px',
    flexShrink: 0,
  },
  outputBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: COLORS.background,
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: '12px',
  },
  newBadge: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  standardBadge: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
  },
};

/**
 * Mode selector component for choosing between Step-by-Step and Express modes
 */
const ExpressModeSelectorComponent = ({
  selectedMode,
  onModeChange,
  disabled = false,
}) => {
  const handleSelect = (mode) => {
    if (!disabled) {
      onModeChange(mode);
    }
  };

  return (
    <section style={styles.container} aria-labelledby="mode-selector-title">
      <div style={styles.header}>
        <h3 id="mode-selector-title" style={styles.title}>Choose Assessment Approach</h3>
      </div>
      <div style={styles.body}>
        <div
          role="radiogroup"
          aria-labelledby="mode-selector-title"
          style={styles.optionsGrid}
        >
          {/* Step-by-Step Mode */}
          <div
            role="radio"
            aria-checked={selectedMode === 'step-by-step'}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={() => handleSelect('step-by-step')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect('step-by-step');
              }
            }}
            style={{
              ...styles.optionCard,
              ...(selectedMode === 'step-by-step' ? styles.optionCardSelected : {}),
              opacity: disabled ? 0.6 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <div style={styles.optionHeader}>
              <div
                style={{
                  ...styles.radioCircle,
                  ...(selectedMode === 'step-by-step' ? styles.radioCircleSelected : {}),
                }}
              >
                {selectedMode === 'step-by-step' && <div style={styles.radioInner} />}
              </div>
              <div>
                <h4 style={styles.optionTitle}>Step-by-Step Framework Analysis</h4>
                <span style={{ ...styles.optionBadge, ...styles.standardBadge }}>Standard</span>
              </div>
            </div>
            <p style={styles.optionDescription}>
              Execute each validation step individually with full control and review between steps.
            </p>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>&#10003;</span>
                Best for: Learning, collaboration, deep analysis
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>&#10003;</span>
                Output: 13 individual markdown files
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>&#10003;</span>
                Time: 45-60 minutes with review
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>&#10003;</span>
                Review and refine between steps
              </li>
            </ul>
            <div style={styles.outputBadge}>
              Working documents for iterative analysis
            </div>
          </div>

          {/* Express Mode */}
          <div
            role="radio"
            aria-checked={selectedMode === 'express'}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={() => handleSelect('express')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect('express');
              }
            }}
            style={{
              ...styles.optionCard,
              ...(selectedMode === 'express' ? styles.optionCardSelected : {}),
              opacity: disabled ? 0.6 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <div style={styles.optionHeader}>
              <div
                style={{
                  ...styles.radioCircle,
                  ...(selectedMode === 'express' ? styles.radioCircleSelected : {}),
                }}
              >
                {selectedMode === 'express' && <div style={styles.radioInner} />}
              </div>
              <div>
                <h4 style={styles.optionTitle}>Express Assessment Report</h4>
                <span style={{ ...styles.optionBadge, ...styles.newBadge }}>New</span>
              </div>
            </div>
            <p style={styles.optionDescription}>
              Comprehensive evaluation in single execution for board presentations and investment committees.
            </p>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>&#10003;</span>
                Best for: Executive presentation, board meetings
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>&#10003;</span>
                Output: Professional 20-25 page DOCX report
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>&#10003;</span>
                Time: 15-20 minutes
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>&#10003;</span>
                All 13 steps synthesized in one analysis
              </li>
            </ul>
            <div style={styles.outputBadge}>
              Report includes:
            </div>
            <ul style={{ ...styles.featureList, marginTop: '8px' }}>
              <li style={{ ...styles.featureItem, marginBottom: '4px' }}>
                <span style={styles.featureIcon}>&#10003;</span>
                Executive summary with recommendation
              </li>
              <li style={{ ...styles.featureItem, marginBottom: '4px' }}>
                <span style={styles.featureIcon}>&#10003;</span>
                Visual scorecards and matrices
              </li>
              <li style={{ ...styles.featureItem, marginBottom: '4px' }}>
                <span style={styles.featureIcon}>&#10003;</span>
                Risk assessment and roadmap
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ExpressModeSelector = memo(ExpressModeSelectorComponent);
