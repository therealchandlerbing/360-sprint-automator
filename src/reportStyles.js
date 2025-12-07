// ============================================
// Report Styles - Design System Constants
// 360 Business Validation Report Template
// Based on VIANEO Sprint Automator v3 design system
// ============================================

/**
 * Color palette derived from VIANEO Sprint Automator v3
 * All colors maintain WCAG AA accessibility compliance
 */
export const REPORT_COLORS = {
  // Primary brand (Stripe-inspired deep blue)
  primary: '0A2540',
  primaryLight: '1A365D',
  primaryAccent: '00A3B5',

  // Phase colors (for section headers)
  phases: {
    foundation: '0A2540',
    deepDive: '0D5A66',
    synthesis: '1E6B4F',
    viability: '7C3AED',
  },

  // Status colors
  success: '10B981',
  successLight: 'D1FAE5',
  successDark: '065F46',
  warning: 'F59E0B',
  warningLight: 'FEF3C7',
  warningDark: '92400E',
  error: 'EF4444',
  errorLight: 'FEE2E2',
  errorDark: '991B1B',

  // Text colors
  textPrimary: '1A202C',
  textSecondary: '4A5568',
  textMuted: '718096',
  white: 'FFFFFF',

  // Backgrounds and borders
  border: 'E2E8F0',
  backgroundLight: 'F7FAFC',
  backgroundAlt: 'EDF2F7',
};

/**
 * Recommendation badge specifications
 */
export const RECOMMENDATION_STYLES = {
  GO: {
    background: 'D1FAE5',
    border: '10B981',
    text: '065F46',
    label: 'GO',
  },
  MAYBE: {
    background: 'FEF3C7',
    border: 'F59E0B',
    text: '92400E',
    label: 'MAYBE',
  },
  NO: {
    background: 'FEE2E2',
    border: 'EF4444',
    text: '991B1B',
    label: 'NO',
  },
  CONDITIONAL_GO: {
    background: 'FEF3C7',
    border: 'F59E0B',
    text: '92400E',
    label: 'CONDITIONAL GO',
  },
  HOLD: {
    background: 'FED7AA',
    border: 'F97316',
    text: 'C2410C',
    label: 'HOLD',
  },
  NO_GO: {
    background: 'FEE2E2',
    border: 'EF4444',
    text: '991B1B',
    label: 'NO GO',
  },
};

/**
 * Evidence marker specifications
 */
export const EVIDENCE_MARKERS = {
  VALIDATED: { background: 'D1FAE5', text: '065F46' },
  LIKELY: { background: 'DBEAFE', text: '1E40AF' },
  ASSUMED: { background: 'FEF3C7', text: '92400E' },
  UNVALIDATED: { background: 'FEE2E2', text: '991B1B' },
  DISPUTED: { background: 'F3E8FF', text: '6B21A8' },
};

/**
 * Score badge specifications (for 1-5 scores)
 */
export const SCORE_BADGES = {
  5: { background: 'D1FAE5', text: '065F46', label: 'Complete' },
  4: { background: 'DBEAFE', text: '1E40AF', label: 'Strong' },
  3: { background: 'FEF3C7', text: '92400E', label: 'Adequate' },
  2: { background: 'FED7AA', text: 'C2410C', label: 'Weak' },
  1: { background: 'FEE2E2', text: '991B1B', label: 'Critical Gap' },
};

/**
 * Status badge based on average scores
 */
export const STATUS_BADGES = {
  STRONG: { min: 4.0, max: 5.0, background: 'D1FAE5', text: '065F46' },
  ADEQUATE: { min: 3.0, max: 3.99, background: 'DBEAFE', text: '1E40AF' },
  CONCERN: { min: 2.0, max: 2.99, background: 'FED7AA', text: 'C2410C' },
  CRITICAL: { min: 1.0, max: 1.99, background: 'FEE2E2', text: '991B1B' },
};

/**
 * Typography scale (in half-points for docx)
 */
export const TYPOGRAPHY = {
  documentTitle: { size: 56, bold: true }, // 28pt
  sectionHeader: { size: 32, bold: true }, // 16pt
  subsectionHeader: { size: 28, bold: true }, // 14pt
  subSubsectionHeader: { size: 24, bold: true }, // 12pt
  bodyText: { size: 22, bold: false }, // 11pt
  tableHeader: { size: 20, bold: true }, // 10pt
  tableBody: { size: 20, bold: false }, // 10pt
  caption: { size: 18, bold: false, italic: true }, // 9pt
  footer: { size: 18, bold: false }, // 9pt
};

/**
 * Spacing values in DXA (twentieths of a point)
 * 1440 DXA = 1 inch
 */
export const SPACING = {
  pageMargins: 1440, // 1.0 inch
  sectionSpacing: 480, // 0.33 inch
  paragraphAfter: 200, // 0.14 inch
  listItemIndent: 720, // 0.5 inch
  tableCellPadding: 100, // 0.07 inch
};

/**
 * Threshold status indicators for dimensions
 */
export const THRESHOLD_STATUS = {
  above: { symbol: '\u2713', color: '10B981' }, // check mark
  borderline: { symbol: '\u2248', color: 'F59E0B' }, // approximately equal
  below: { symbol: '\u2717', color: 'EF4444' }, // X mark
};

/**
 * VIANEO dimension weights and thresholds
 */
export const DIMENSION_CONFIG = {
  legitimacy: { weight: 0.15, threshold: 3.0 },
  desirability: { weight: 0.25, threshold: 3.5, priority: true },
  acceptability: { weight: 0.20, threshold: 3.0 },
  feasibility: { weight: 0.20, threshold: 3.0 },
  viability: { weight: 0.20, threshold: 3.0 },
};

/**
 * Investment readiness gauge zones
 */
export const GAUGE_ZONES = [
  { min: 0, max: 40, color: 'EF4444', label: 'Not Ready' },
  { min: 40, max: 60, color: 'F59E0B', label: 'Early Stage' },
  { min: 60, max: 80, color: 'EAB308', label: 'Developing' },
  { min: 80, max: 100, color: '10B981', label: 'Investment Ready' },
];

/**
 * Chart color schemes
 */
export const CHART_COLORS = {
  primary: '#00A3B5',
  primaryFill: 'rgba(0, 163, 181, 0.3)',
  threshold: '#EF4444',
  gridLines: '#E2E8F0',
  labels: '#1A202C',
  dimensions: [
    '#0A2540', // Team/Legitimacy
    '#0D5A66', // Technology/Desirability
    '#1E6B4F', // Management/Acceptability
    '#7C3AED', // Commercial/Feasibility
    '#00A3B5', // Viability
  ],
  evidence: {
    VALIDATED: '#10B981',
    LIKELY: '#3B82F6',
    ASSUMED: '#F59E0B',
    UNVALIDATED: '#EF4444',
    DISPUTED: '#8B5CF6',
  },
};

/**
 * Table column widths (in DXA)
 */
export const TABLE_WIDTHS = {
  full: 9360, // Full width at 1-inch margins on letter paper
  half: 4680,
  third: 3120,
  quarter: 2340,
  narrow: 1500,
  score: 1200,
  status: 1800,
};

/**
 * Get phase color based on phase name
 */
export function getPhaseColor(phase) {
  const phaseMap = {
    'Foundation': REPORT_COLORS.phases.foundation,
    'Deep Dive': REPORT_COLORS.phases.deepDive,
    'Synthesis': REPORT_COLORS.phases.synthesis,
    'Viability': REPORT_COLORS.phases.viability,
  };
  return phaseMap[phase] || REPORT_COLORS.primary;
}

/**
 * Get status badge based on score average
 */
export function getStatusBadge(score) {
  if (score >= 4.0) return { ...STATUS_BADGES.STRONG, label: 'STRONG' };
  if (score >= 3.0) return { ...STATUS_BADGES.ADEQUATE, label: 'ADEQUATE' };
  if (score >= 2.0) return { ...STATUS_BADGES.CONCERN, label: 'CONCERN' };
  return { ...STATUS_BADGES.CRITICAL, label: 'CRITICAL' };
}

/**
 * Get score badge based on individual score (1-5)
 */
export function getScoreBadge(score) {
  const roundedScore = Math.round(score);
  return SCORE_BADGES[roundedScore] || SCORE_BADGES[3];
}

/**
 * Get threshold status for a dimension score
 */
export function getThresholdStatus(score, threshold, tolerance = 0.3) {
  if (score >= threshold) return THRESHOLD_STATUS.above;
  if (score >= threshold - tolerance) return THRESHOLD_STATUS.borderline;
  return THRESHOLD_STATUS.below;
}
