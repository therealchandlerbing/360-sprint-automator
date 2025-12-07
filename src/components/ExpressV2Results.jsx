// ============================================
// Express V2 Results Component
// Display results with PDF download options
// ============================================

import React, { memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { DIMENSIONS } from '../constants/expressPromptV2.js';

const styles = {
  container: {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  header: {
    padding: '24px',
    borderBottom: `1px solid ${COLORS.border}`,
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
    color: COLORS.white,
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '14px',
    opacity: 0.9,
  },
  body: {
    padding: '24px',
  },
  scoreCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  scoreLeft: {
    flex: 1,
  },
  scoreNumber: {
    fontSize: '48px',
    fontWeight: '800',
    color: COLORS.primaryAccent,
    marginBottom: '8px',
  },
  scoreLabel: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  gateBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    marginTop: '8px',
  },
  dimensionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  dimensionCard: {
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
  },
  dimensionName: {
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: '8px',
  },
  dimensionScore: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  dimensionThreshold: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginTop: '24px',
  },
  button: {
    padding: '14px 20px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  primaryButton: {
    backgroundColor: COLORS.primaryAccent,
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
    border: `1px solid ${COLORS.border}`,
  },
  summarySection: {
    padding: '20px',
    background: COLORS.background,
    borderRadius: '10px',
    marginBottom: '20px',
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: '12px',
  },
  summaryText: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    lineHeight: 1.6,
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  insightCard: {
    padding: '16px',
    borderRadius: '10px',
  },
  insightCardStrengths: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
  },
  insightCardRisks: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
  },
  insightCardActions: {
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
  },
  insightTitle: {
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  insightList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  insightItem: {
    fontSize: '12px',
    padding: '6px 0',
    paddingLeft: '16px',
    position: 'relative',
    lineHeight: 1.5,
  },
};

/**
 * Express V2 Results Component
 */
const ExpressV2ResultsComponent = ({
  assessmentData,
  onDownloadReport,
  onPrintReport,
  onStartNew,
}) => {
  if (!assessmentData) return null;

  const { companyName, scores, overallScore, gate, executiveSummary, topStrengths, criticalRisks, immediateActions } = assessmentData;

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Assessment Complete</h2>
        <p style={styles.subtitle}>
          {companyName} • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style={styles.body}>
        {/* Overall Score */}
        <div style={styles.scoreCard}>
          <div style={styles.scoreLeft}>
            <div style={styles.scoreNumber}>{overallScore.toFixed(0)}</div>
            <div style={styles.scoreLabel}>Overall Score (out of 100)</div>
            <div style={{ ...styles.gateBadge, backgroundColor: gate.bg, color: gate.color }}>
              {gate.label}
            </div>
          </div>
          <div>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={COLORS.primaryAccent}
                strokeWidth="10"
                strokeDasharray={`${(overallScore / 100) * 314} 314`}
                strokeDashoffset="78.5"
                transform="rotate(-90 60 60)"
              />
              <text
                x="60"
                y="60"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24"
                fontWeight="700"
                fill={COLORS.textPrimary}
              >
                {overallScore.toFixed(0)}%
              </text>
            </svg>
          </div>
        </div>

        {/* Executive Summary */}
        {executiveSummary && (
          <div style={styles.summarySection}>
            <h3 style={styles.summaryTitle}>Executive Summary</h3>
            <p style={styles.summaryText}>{executiveSummary}</p>
          </div>
        )}

        {/* Dimension Scores */}
        <div style={styles.dimensionsGrid}>
          {DIMENSIONS.map(dim => {
            const score = scores[dim.id] || 0;
            const meetsThreshold = score >= dim.threshold;
            return (
              <div
                key={dim.id}
                style={{
                  ...styles.dimensionCard,
                  borderLeft: `4px solid ${dim.color}`,
                }}
              >
                <div style={styles.dimensionName}>{dim.name}</div>
                <div style={{ ...styles.dimensionScore, color: dim.color }}>
                  {score.toFixed(1)}
                </div>
                <div
                  style={{
                    ...styles.dimensionThreshold,
                    backgroundColor: meetsThreshold ? COLORS.successLight : COLORS.errorLightAlt,
                    color: meetsThreshold ? COLORS.success : COLORS.error,
                  }}
                >
                  {meetsThreshold ? '✓ Passing' : `Need ${dim.threshold}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Insights */}
        <div style={styles.insightsGrid}>
          {topStrengths && topStrengths.length > 0 && (
            <div style={{ ...styles.insightCard, ...styles.insightCardStrengths }}>
              <h4 style={{ ...styles.insightTitle, color: COLORS.success }}>
                <span>✓</span> Top Strengths
              </h4>
              <ul style={styles.insightList}>
                {topStrengths.map((item, i) => (
                  <li key={i} style={{ ...styles.insightItem, color: '#065F46' }}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {criticalRisks && criticalRisks.length > 0 && (
            <div style={{ ...styles.insightCard, ...styles.insightCardRisks }}>
              <h4 style={{ ...styles.insightTitle, color: COLORS.error }}>
                <span>⚠</span> Critical Risks
              </h4>
              <ul style={styles.insightList}>
                {criticalRisks.map((item, i) => (
                  <li key={i} style={{ ...styles.insightItem, color: '#991B1B' }}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {immediateActions && immediateActions.length > 0 && (
            <div style={{ ...styles.insightCard, ...styles.insightCardActions }}>
              <h4 style={{ ...styles.insightTitle, color: '#2563EB' }}>
                <span>→</span> Immediate Actions
              </h4>
              <ul style={styles.insightList}>
                {immediateActions.map((item, i) => (
                  <li key={i} style={{ ...styles.insightItem, color: '#1E40AF' }}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={onDownloadReport}
          >
            📥 Download PDF Report
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={onPrintReport}
          >
            🖨️ Print Report
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={onStartNew}
          >
            🔄 New Assessment
          </button>
        </div>
      </div>
    </section>
  );
};

export const ExpressV2Results = memo(ExpressV2ResultsComponent);
