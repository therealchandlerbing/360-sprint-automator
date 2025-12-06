// ============================================
// Document Design System
// Professional formatting for all outputs
// ============================================

export const DOC_DESIGN = {
  // Character limits (strictly enforced)
  limits: {
    tiny: 60,        // Field of application, need statements, bullets
    short: 150,      // Company overview, row notes
    medium: 250,     // Synthesis notes, competitive advantages
    standard: 300,   // Problem, solution, market, model, traction
    paragraph: 500,  // Executive context
  },

  // Evidence markers
  evidence: {
    validated: '[VALIDATED]',
    assumed: '[ASSUMED]',
    insufficient: '[INSUFFICIENT DATA]',
  },

  // Validation badges
  badges: {
    exceptional: '✓ VALIDATED (10+ interviews)',
    strong: '✓ VALIDATED (5-10 interviews)',
    adequate: '⚠ PARTIAL (3-5 interviews)',
    weak: '⚠ PARTIAL (1-2 interviews)',
    none: '✗ NEEDS VALIDATION (0 interviews)',
  },

  // Acceptability indicators
  acceptability: {
    favorable: '🟢 Favorable',
    neutral: '🟡 Neutral',
    unfavorable: '🔴 Unfavorable',
  },

  // Score interpretations
  scores: {
    exceptional: { min: 4.5, max: 5.0, label: 'Exceptional', color: '#10B981' },
    strong: { min: 4.0, max: 4.4, label: 'Strong', color: '#059669' },
    promising: { min: 3.5, max: 3.9, label: 'Promising', color: '#0D9488' },
    adequate: { min: 3.0, max: 3.4, label: 'Adequate', color: '#F59E0B' },
    concern: { min: 2.0, max: 2.9, label: 'Concern', color: '#F97316' },
    critical: { min: 1.0, max: 1.9, label: 'Critical', color: '#EF4444' },
  },

  // Gate recommendations
  gates: {
    go: { label: 'GO', color: '#10B981', criteria: 'All thresholds met' },
    conditional: { label: 'CONDITIONAL GO', color: '#F59E0B', criteria: 'Prerequisites required' },
    hold: { label: 'HOLD', color: '#F97316', criteria: 'Validation needed' },
    noGo: { label: 'NO GO', color: '#EF4444', criteria: 'Fundamental issues' },
  },

  // Maturity stages
  maturity: ['IDEA', 'PROOF', 'PROMISING', 'LAUNCH', 'GROWTH'],

  // TRL levels
  trl: {
    1: 'Basic principles observed',
    2: 'Technology concept formulated',
    3: 'Experimental proof of concept',
    4: 'Technology validated in lab',
    5: 'Technology validated in relevant environment',
    6: 'Technology demonstrated in relevant environment',
    7: 'System prototype demonstrated',
    8: 'System complete and qualified',
    9: 'System proven in operational environment',
  },
};
