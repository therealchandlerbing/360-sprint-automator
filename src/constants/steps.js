// ============================================
// VIANEO Framework Steps & Phases
// ============================================

export const STEPS = [
  { id: 0, name: 'Executive Brief', description: 'Extract structured brief from raw materials', phase: 'Foundation', outputFile: '_00_ExecutiveBrief' },
  { id: 1, name: 'Application Forms', description: 'Generate program-specific documentation', phase: 'Foundation', hasBranch: true, outputFile: '_01_ApplicationForm' },
  { id: 2, name: '40Q Diagnostic', description: '4-dimension rapid assessment (Team, Tech, Mgmt, Commercial)', phase: 'Foundation', outputFile: '_02_Diagnostic' },
  { id: 3, name: '29Q Market Maturity', description: '5-dimension VIANEO scoring with weighted thresholds', phase: 'Foundation', outputFile: '_03_MarketMaturity' },
  { id: 4, name: 'Legitimacy Worksheet', description: 'Problem validation and means inventory', phase: 'Deep Dive', outputFile: '_04_Legitimacy' },
  { id: 5, name: 'Needs & Requesters', description: 'WHO/WHAT/WHY/HOW analysis (4-file output)', phase: 'Deep Dive', outputFile: '_05_NeedsRequesters' },
  { id: 6, name: 'Persona Development', description: 'Evidence-based personas from requesters', phase: 'Deep Dive', outputFile: '_06_Personas' },
  { id: 7, name: 'Needs Qualification', description: 'Interactive matrix & priority zones', phase: 'Deep Dive', outputFile: '_07_NeedsMatrix' },
  { id: 8, name: 'Players & Influencers', description: 'Ecosystem acceptability mapping', phase: 'Deep Dive', outputFile: '_08_Players' },
  { id: 9, name: 'Value Network Map', description: 'Network visualization & value flows', phase: 'Deep Dive', outputFile: '_09_ValueNetwork' },
  { id: 10, name: 'Diagnostic Comment', description: 'Executive decision brief', phase: 'Synthesis', outputFile: '_10_DiagnosticComment' },
  { id: 11, name: 'Features-Needs Matrix', description: 'MVP scope analysis with entity validation', phase: 'Synthesis', outputFile: '_11_FeaturesNeeds' },
  { id: 12, name: 'Viability Assessment', description: 'Gate recommendation & dashboard', phase: 'Viability', hasSubSteps: true, outputFile: '_12_Viability' },
];

export const PHASES = ['Foundation', 'Deep Dive', 'Synthesis', 'Viability'];
