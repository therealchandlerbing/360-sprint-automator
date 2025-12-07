// ============================================
// Methodology Constants
// Data for the VIANEO Business Model methodology modal
// ============================================

// The 5 VIANEO Dimensions
export const DIMENSIONS = [
  {
    id: 'legitimacy',
    name: 'Legitimacy',
    weight: 15,
    threshold: 3.0,
    question: 'Is there a real, validated problem worth solving?',
    details: [
      'Problem validation and evidence',
      'Market need documentation',
      'Pain point quantification',
    ],
  },
  {
    id: 'desirability',
    name: 'Desirability',
    weight: 25,
    threshold: 3.5,
    question: 'Do specific people want YOUR solution?',
    details: [
      'Requester identification (people, not organizations)',
      'Needs validation with specific evidence',
      'Willingness to pay or adopt',
    ],
    isEmphasis: true,
  },
  {
    id: 'acceptability',
    name: 'Acceptability',
    weight: 20,
    threshold: 3.0,
    question: 'Will the ecosystem support you?',
    details: [
      'Ecosystem player mapping',
      'Influencer and blocker identification',
      'Regulatory and compliance landscape',
    ],
  },
  {
    id: 'feasibility',
    name: 'Feasibility',
    weight: 20,
    threshold: 3.0,
    question: 'Can you actually build and deliver it?',
    details: [
      'Technical capability assessment',
      'Team composition and expertise',
      'Development status and roadmap',
    ],
  },
  {
    id: 'viability',
    name: 'Viability',
    weight: 20,
    threshold: 3.0,
    question: 'Is the business model economically sustainable?',
    details: [
      'Business model clarity',
      'Revenue model validation',
      'Unit economics and sustainability',
    ],
  },
];

// Evidence markers with their colors
export const EVIDENCE_MARKERS = [
  { tag: 'VALIDATED', desc: 'Direct evidence from primary sources', color: '#10B981', bg: '#D1FAE5' },
  { tag: 'LIKELY', desc: 'Strong indirect evidence or logical inference', color: '#0D9488', bg: '#CCFBF1' },
  { tag: 'ASSUMED', desc: 'Reasonable assumption without direct evidence', color: '#F59E0B', bg: '#FEF3C7' },
  { tag: 'UNVALIDATED', desc: 'Claim made without supporting evidence', color: '#EF4444', bg: '#FEE2E2' },
  { tag: 'DISPUTED', desc: 'Conflicting evidence or questionable claims', color: '#8B5CF6', bg: '#EDE9FE' },
];

// Process phases for the 13-step assessment
export const PROCESS_PHASES = [
  {
    name: 'Foundation (Steps 0-3)',
    items: [
      'Extract and structure core business information',
      'Initial scoring across all 5 VIANEO dimensions',
    ],
  },
  {
    name: 'Deep Dive (Steps 4-9)',
    items: [
      'Validate the problem (Legitimacy)',
      'Map stakeholders and their needs (Desirability)',
      'Assess ecosystem players (Acceptability)',
    ],
  },
  {
    name: 'Synthesis (Steps 10-11)',
    items: [
      'Connect findings into executive decision brief',
      'Align features to validated needs',
    ],
  },
  {
    name: 'Final Assessment (Step 12)',
    items: [
      'Final viability scoring and gate recommendation',
      'GO / CONDITIONAL / NO-GO decision',
    ],
  },
];

// Scoring requirements (1-5 scale)
export const SCORING_REQUIREMENTS = [
  { score: 5, desc: 'External validation, documented evidence, multiple sources' },
  { score: 4, desc: 'Some external validation, clear capability demonstrated' },
  { score: 3, desc: 'Internal validation only, reasonable assumptions' },
  { score: 2, desc: 'Significant gaps, acknowledged but unaddressed' },
  { score: 1, desc: 'Critical gap requiring immediate attention (RED FLAG)' },
];
