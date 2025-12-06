// ============================================
// Express Completion Component
// Download buttons and completion UI
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
    padding: '24px',
    background: `linear-gradient(135deg, #10B981 0%, #059669 100%)`,
    color: COLORS.white,
    textAlign: 'center',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '32px',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '24px',
    fontWeight: '600',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    opacity: 0.9,
  },
  body: {
    padding: '24px',
  },
  downloadCard: {
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.15s ease',
  },
  downloadCardPrimary: {
    borderColor: COLORS.primaryAccent,
    backgroundColor: '#F0FDFA',
  },
  downloadIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    flexShrink: 0,
  },
  downloadIconPrimary: {
    backgroundColor: COLORS.primaryAccent,
    color: COLORS.white,
  },
  downloadIconSecondary: {
    backgroundColor: COLORS.background,
    color: COLORS.textSecondary,
  },
  downloadInfo: {
    flex: 1,
  },
  downloadTitle: {
    margin: '0 0 4px',
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  downloadDescription: {
    margin: 0,
    fontSize: '13px',
    color: COLORS.textSecondary,
    lineHeight: 1.4,
  },
  downloadMeta: {
    marginTop: '8px',
    fontSize: '12px',
    color: COLORS.textMuted,
  },
  downloadButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  downloadButtonPrimary: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
  },
  downloadButtonSecondary: {
    backgroundColor: COLORS.white,
    color: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
  },
  downloadButtonDisabled: {
    backgroundColor: COLORS.border,
    color: COLORS.textMuted,
    cursor: 'not-allowed',
    border: 'none',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '16px',
    color: COLORS.textMuted,
    fontSize: '13px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: COLORS.border,
  },
  dashboardSection: {
    backgroundColor: COLORS.background,
    borderRadius: '12px',
    padding: '20px',
  },
  dashboardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  dashboardIcon: {
    fontSize: '24px',
  },
  dashboardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dashboardDescription: {
    margin: '0 0 16px',
    fontSize: '13px',
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  dashboardFeatures: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  dashboardFeature: {
    padding: '6px 12px',
    backgroundColor: COLORS.white,
    borderRadius: '6px',
    fontSize: '12px',
    color: COLORS.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  estimatedTime: {
    fontSize: '12px',
    color: COLORS.textMuted,
    marginBottom: '12px',
  },
  summaryCard: {
    backgroundColor: COLORS.background,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  summaryTitle: {
    margin: '0 0 16px',
    fontSize: '15px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  summaryLabel: {
    fontSize: '12px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  recommendationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '600',
  },
  newAssessmentButton: {
    width: '100%',
    marginTop: '24px',
    padding: '14px 24px',
    backgroundColor: COLORS.white,
    color: COLORS.textSecondary,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  errorIcon: {
    fontSize: '24px',
    color: COLORS.error,
    flexShrink: 0,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    margin: '0 0 4px',
    fontSize: '15px',
    fontWeight: '600',
    color: COLORS.error,
  },
  errorMessage: {
    margin: 0,
    fontSize: '13px',
    color: '#991B1B',
    lineHeight: 1.5,
  },
  retryButton: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: COLORS.white,
    color: COLORS.error,
    border: `1px solid ${COLORS.error}`,
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

// Get recommendation badge color
function getRecommendationColor(recommendation) {
  switch (recommendation) {
    case 'GO': return { bg: '#D1FAE5', text: '#065F46' };
    case 'CONDITIONAL_GO': return { bg: '#FEF3C7', text: '#92400E' };
    case 'HOLD': return { bg: '#FED7AA', text: '#9A3412' };
    case 'NO_GO': return { bg: '#FEE2E2', text: '#991B1B' };
    default: return { bg: COLORS.border, text: COLORS.textSecondary };
  }
}

// Format recommendation label
function formatRecommendation(recommendation) {
  switch (recommendation) {
    case 'GO': return 'GO';
    case 'CONDITIONAL_GO': return 'CONDITIONAL GO';
    case 'HOLD': return 'HOLD';
    case 'NO_GO': return 'NO GO';
    default: return recommendation;
  }
}

// Format file size
function formatFileSize(bytes) {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Express Completion component showing download options after assessment
 */
const ExpressCompletionComponent = ({
  projectName,
  assessmentData,
  reportBlob,
  reportURL,
  dashboardStatus,
  dashboardURL,
  completionTime,
  error,
  onDownloadReport,
  onGenerateDashboard,
  onDownloadDashboard,
  onStartNewAssessment,
  onRetry,
}) => {
  const recommendation = assessmentData?.executiveSummary?.recommendation;
  const investmentReadinessScore = assessmentData?.executiveSummary?.investmentReadinessScore;
  const overallScore = assessmentData?.marketMaturity?.weightedOverall;
  const recColor = getRecommendationColor(recommendation);

  // Handle error state
  if (error) {
    return (
      <section style={styles.container}>
        <div style={styles.body}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>&#9888;</div>
            <div style={styles.errorContent}>
              <h3 style={styles.errorTitle}>Assessment Failed</h3>
              <p style={styles.errorMessage}>{error}</p>
              <button style={styles.retryButton} onClick={onRetry}>
                Retry Assessment
              </button>
            </div>
          </div>
          <button style={styles.newAssessmentButton} onClick={onStartNewAssessment}>
            Start New Assessment
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.container}>
      <header style={styles.header}>
        <div style={styles.successIcon}>&#10003;</div>
        <h2 style={styles.title}>Assessment Complete</h2>
        <p style={styles.subtitle}>
          Project: {projectName || 'Unnamed Project'} | Completed: {completionTime || new Date().toLocaleString()}
        </p>
      </header>

      <div style={styles.body}>
        {/* Summary Card */}
        {assessmentData && (
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Assessment Summary</h3>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <div
                  style={{
                    ...styles.recommendationBadge,
                    backgroundColor: recColor.bg,
                    color: recColor.text,
                  }}
                >
                  {formatRecommendation(recommendation)}
                </div>
                <div style={{ ...styles.summaryLabel, marginTop: '8px' }}>Recommendation</div>
              </div>
              <div style={styles.summaryItem}>
                <div style={styles.summaryValue}>{investmentReadinessScore || '--'}</div>
                <div style={styles.summaryLabel}>Investment Readiness</div>
              </div>
              <div style={styles.summaryItem}>
                <div style={styles.summaryValue}>{overallScore?.toFixed(1) || '--'}</div>
                <div style={styles.summaryLabel}>VIANEO Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Download - DOCX Report */}
        <div style={{ ...styles.downloadCard, ...styles.downloadCardPrimary }}>
          <div style={{ ...styles.downloadIcon, ...styles.downloadIconPrimary }}>
            &#128462;
          </div>
          <div style={styles.downloadInfo}>
            <h4 style={styles.downloadTitle}>360 Business Validation Report</h4>
            <p style={styles.downloadDescription}>
              Professional 20-25 page DOCX report with executive summary, all VIANEO dimensions, risk assessment, and recommendations.
            </p>
            <div style={styles.downloadMeta}>
              {reportBlob && `${formatFileSize(reportBlob.size)} | `}
              DOCX format | Word 2016+, Google Docs compatible
            </div>
          </div>
          <button
            style={{
              ...styles.downloadButton,
              ...styles.downloadButtonPrimary,
              ...(reportURL ? {} : styles.downloadButtonDisabled),
            }}
            onClick={onDownloadReport}
            disabled={!reportURL}
          >
            <span>&#8681;</span>
            Download Report
          </button>
        </div>

        {/* Dashboard Section */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span>Optional</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.dashboardSection}>
          <div style={styles.dashboardHeader}>
            <span style={styles.dashboardIcon}>&#128200;</span>
            <h4 style={styles.dashboardTitle}>Interactive Executive Dashboard</h4>
          </div>
          <p style={styles.dashboardDescription}>
            Generate an interactive HTML dashboard with dynamic charts, filterable data views, and exportable visualizations. Perfect for presentations and stakeholder meetings.
          </p>
          <div style={styles.dashboardFeatures}>
            <span style={styles.dashboardFeature}>
              <span>&#10003;</span> Interactive charts
            </span>
            <span style={styles.dashboardFeature}>
              <span>&#10003;</span> Offline compatible
            </span>
            <span style={styles.dashboardFeature}>
              <span>&#10003;</span> Filterable views
            </span>
            <span style={styles.dashboardFeature}>
              <span>&#10003;</span> Responsive design
            </span>
          </div>
          <div style={styles.estimatedTime}>
            &#9201; Estimated generation time: 2-3 minutes
          </div>

          {dashboardStatus === 'not-started' && (
            <button
              style={{ ...styles.downloadButton, ...styles.downloadButtonSecondary }}
              onClick={onGenerateDashboard}
            >
              Generate Dashboard
            </button>
          )}

          {dashboardStatus === 'processing' && (
            <button
              style={{ ...styles.downloadButton, ...styles.downloadButtonDisabled }}
              disabled
            >
              <span className="spinner" style={{ width: '16px', height: '16px' }}>&#8635;</span>
              Generating...
            </button>
          )}

          {dashboardStatus === 'complete' && dashboardURL && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{ ...styles.downloadButton, ...styles.downloadButtonPrimary }}
                onClick={() => window.open(dashboardURL, '_blank')}
              >
                Open Dashboard
              </button>
              <button
                style={{ ...styles.downloadButton, ...styles.downloadButtonSecondary }}
                onClick={onDownloadDashboard}
              >
                <span>&#8681;</span>
                Download HTML
              </button>
            </div>
          )}

          {dashboardStatus === 'error' && (
            <div style={{ color: COLORS.error, fontSize: '13px', marginTop: '8px' }}>
              Dashboard generation failed. The DOCX report is still available above.
            </div>
          )}
        </div>

        <button style={styles.newAssessmentButton} onClick={onStartNewAssessment}>
          Start New Assessment
        </button>
      </div>
    </section>
  );
};

export const ExpressCompletion = memo(ExpressCompletionComponent);
