import React, { useState, useCallback, useRef } from 'react';

// ============================================
// VIANEO Framework Constants & Configuration
// ============================================

const STEPS = [
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

const PHASES = ['Foundation', 'Deep Dive', 'Synthesis', 'Viability'];

// Design System: Stripe-inspired palette with guaranteed contrast
const COLORS = {
  // Primary brand (Stripe-inspired deep blue)
  primary: '#0A2540',
  primaryLight: '#1A365D',
  primaryAccent: '#00A3B5',
  
  // Phase colors (WCAG AA compliant on white backgrounds)
  phases: {
    'Foundation': { bg: '#0A2540', text: '#FFFFFF', light: '#E8F4F8' },
    'Deep Dive': { bg: '#0D5A66', text: '#FFFFFF', light: '#E0F2F1' },
    'Synthesis': { bg: '#1E6B4F', text: '#FFFFFF', light: '#E8F5E9' },
    'Viability': { bg: '#7C3AED', text: '#FFFFFF', light: '#EDE9FE' },
  },
  
  // Neutrals
  white: '#FFFFFF',
  background: '#F7FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  
  // Text (proper contrast ratios)
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.8)',
  
  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  error: '#EF4444',
};

// ============================================
// Comprehensive VIANEO Prompts
// Based on GITHUB Master Vianeo Repository
// ============================================

const STEP_PROMPTS = {
  0: {
    name: 'Executive Brief Extraction',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 0: Executive Brief Extraction.

Your task is to transform raw application materials into a structured 7-section Executive Brief following the VIANEO methodology.

## REQUIRED OUTPUT STRUCTURE

Create a Markdown document with these exact sections:

### Document Header
\`\`\`
# Executive Brief Template

## Project Information
**Project Name:** [Enter project name]
**Date Prepared:** YYYY-MM-DD
**Prepared By:** VIANEO Sprint Automator
**Executive Brief ID:** EB-YYYY-NNN
\`\`\`

### Section B1: Company Overview (150 chars max)
**Name** | Founded | Location | Legal Structure

### Section B2: Problem Statement (300 chars max)
Solution-neutral description of the problem. Must NOT embed solution.
Include: specific pain point, affected population, measurable impact.

### Section B3: Solution Description (300 chars max)
How the solution works. Include: core mechanism, key differentiators.

### Section B4: Target Market (300 chars max)
Users and Buyers (if different). Include: segment size, characteristics.
Format: "Users: [X]. Buyers: [Y]." if distinct.

### Section B5: Business Model (300 chars max)
Revenue model, pricing structure, unit economics if known.

### Section B6: Traction & Status (300 chars max)
Quantified validation: # customers, revenue, pilots, interviews.
Mark claims as [VALIDATED] or [ASSUMED] based on evidence.

### Section B7: Team Summary (200 chars max)
Key team members with relevant experience.

### Maturity Stage Classification
Determine one of: IDEA | PROOF | PROMISING | LAUNCH | GROWTH
Provide TRL rating (1-9) and justification.

### Supplementary Notes
- Risks & Dependencies (250 chars max)
- Evidence Quality Assessment
- Red Flags Identified

## CRITICAL RULES
1. Enforce character limits STRICTLY (this forces clarity)
2. Keep B2 solution-neutral (problem only, no embedded solution)
3. Quantify everything in B6 with numbers
4. Mark all claims as [VALIDATED] or [ASSUMED]
5. Flag red flags explicitly: zero validation, no prototype, part-time team

## EVIDENCE TRACKING
For every claim in B2-B7, add source type:
- Stakeholder interviews (with count)
- Published research (with citation)
- Internal analysis
- ASSUMED (no evidence)`,
    userPromptTemplate: `Please extract an Executive Brief from the following materials:

{INPUT_CONTENT}

Generate the complete Executive Brief following the VIANEO Step 0 format with all 7 sections (B1-B7), Maturity Stage Classification, and Supplementary Notes. Enforce all character limits strictly.`
  },

  1: {
    name: 'Application Forms',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 1: Application Forms.

Based on the Executive Brief from Step 0, generate a formal application form for the selected program.

## AVAILABLE FORMATS

### 360 SIS (Social Impact Studios)
Focus on:
- Social impact metrics and SDG alignment
- Community benefit assessment
- Sustainability goals
- Impact thesis and theory of change

### CNEN (Brazil Nuclear Commission)
Focus on:
- Technical readiness and nuclear safety
- Regulatory compliance documentation
- Brazilian-specific requirements
- Technical innovation assessment

## OUTPUT REQUIREMENTS
- Professional committee-ready formatting
- All character limits from source brief respected
- Clear sections matching program requirements
- Evidence citations carried forward from Step 0`,
    userPromptTemplate: `Based on the Executive Brief below, generate a {BRANCH} application form:

EXECUTIVE BRIEF:
{STEP_0_OUTPUT}

Create a professional, committee-ready application document following the {BRANCH} format requirements.`
  },

  2: {
    name: '40-Question Diagnostic Assessment',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 2: 40-Question Diagnostic Assessment.

## OVERVIEW
Conduct a rapid comprehensive assessment across four critical dimensions using exactly 40 questions.

## DIMENSION BREAKDOWN
- **Team (T1-T9):** 9 questions on founder/team capabilities, experience, commitment
- **Technology (Tech1-Tech11):** 11 questions on technical innovation, feasibility, development status
- **Management (M1-M12):** 12 questions on strategic planning, operations, governance
- **Commercial (C1-C8):** 8 questions on market validation, business model, revenue

## SCORING SCALE (1-5)
| Score | Meaning | Evidence Required |
|-------|---------|------------------|
| **5** | Complete | External validation, documented evidence, multiple sources |
| **4** | Strong | Some external validation, clear capability, preliminary evidence |
| **3** | Adequate | Internal validation only, reasonable assumptions |
| **2** | Weak | Significant gaps, aware but not addressed |
| **1** | Critical Gap | No evidence, major deficiency, RED FLAG |

## SPECIAL RESPONSE TYPES
- **INSUFFICIENT DATA** - Cannot assess, add to "Questions to Ask Founders"
- **CONTEXTUAL NOTE** - Score needs qualification
- **N/A** - Question doesn't apply to this venture type

## DIMENSION THRESHOLDS
| Average | Status |
|---------|--------|
| 4.0-5.0 | STRONG |
| 3.0-3.9 | ADEQUATE |
| 2.0-2.9 | CONCERN |
| 1.0-1.9 | CRITICAL |

## RED FLAGS (Must Document)
- Any score of 1 = CRITICAL red flag
- Dimension with 3+ scores of 2 = Dimension red flag

## REQUIRED OUTPUT
Generate both Assessment Results (all 40 questions) and Score Summary (executive view).`,
    userPromptTemplate: `Conduct the 40-Question Diagnostic Assessment on this venture:

EXECUTIVE BRIEF:
{STEP_0_OUTPUT}

Generate both the full Assessment Results document and the Score Summary, scoring all 40 questions with evidence.`
  },

  3: {
    name: '29-Question Market Maturity Assessment',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 3: 29-Question Market Maturity Assessment.

## THE 5 DIMENSIONS (Weighted)
| Dimension | Weight | Threshold | Focus |
|-----------|--------|-----------|-------|
| **Legitimacy** | 15% | ≥3.0 | Is there a real problem worth solving? |
| **Desirability** | 25% | ≥3.5 | Do specific people want YOUR solution? ⭐ HIGHEST BAR |
| **Acceptability** | 20% | ≥3.0 | Will the ecosystem support you? |
| **Feasibility** | 20% | ≥3.0 | Can you actually deliver? |
| **Viability** | 20% | ≥3.0 | Is the business model sustainable? |

**Overall Threshold:** ≥3.2 (weighted average)

## DECISION CRITERIA
**GO:** Overall ≥3.2 AND all dimensions meet thresholds
**MAYBE:** Near thresholds (within 0.3), specific remediation path exists
**NO:** Below thresholds by >0.3, fundamental flaws`,
    userPromptTemplate: `Conduct the 29-Question Market Maturity Assessment:

EXECUTIVE BRIEF:
{STEP_0_OUTPUT}

40Q DIAGNOSTIC RESULTS:
{STEP_2_OUTPUT}

Generate the full 29Q assessment with weighted dimension scores and GO/MAYBE/NO recommendation.`
  },

  // Steps 4-12 prompts (abbreviated for space, same structure as before)
  4: { name: 'Legitimacy Worksheet', systemPrompt: 'Deep dive into problem validation...', userPromptTemplate: '{STEP_0_OUTPUT}' },
  5: { name: 'Needs & Requesters', systemPrompt: 'WHO/WHAT/WHY/HOW analysis...', userPromptTemplate: '{STEP_0_OUTPUT}' },
  6: { name: 'Persona Development', systemPrompt: 'Evidence-based personas...', userPromptTemplate: '{STEP_5_OUTPUT}' },
  7: { name: 'Needs Qualification', systemPrompt: 'Interactive matrix...', userPromptTemplate: '{STEP_5_OUTPUT}' },
  8: { name: 'Players & Influencers', systemPrompt: 'Ecosystem mapping...', userPromptTemplate: '{STEP_0_OUTPUT}' },
  9: { name: 'Value Network Map', systemPrompt: 'Network visualization...', userPromptTemplate: '{STEP_5_OUTPUT}' },
  10: { name: 'Diagnostic Comment', systemPrompt: 'Executive decision brief...', userPromptTemplate: '{ALL_PRIOR_OUTPUTS}' },
  11: { name: 'Features-Needs Matrix', systemPrompt: 'MVP scope analysis...', userPromptTemplate: '{ALL_PRIOR_OUTPUTS}' },
  12: { name: 'Viability Assessment', systemPrompt: 'Gate recommendation...', userPromptTemplate: '{ALL_PRIOR_OUTPUTS}' },
};

// ============================================
// Styled Components (Inline for reliability)
// ============================================

const styles = {
  // Layout
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  // Header (Stripe-inspired)
  header: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
    padding: '20px 32px',
    borderBottom: `4px solid ${COLORS.primaryAccent}`,
  },
  headerInner: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    width: '48px',
    height: '48px',
    background: COLORS.primaryAccent,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: COLORS.white,
    boxShadow: '0 4px 12px rgba(0, 163, 181, 0.3)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: '-0.02em',
  },
  headerSubtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: COLORS.textOnDarkMuted,
  },
  progressSection: {
    textAlign: 'right',
  },
  progressLabel: {
    fontSize: '14px',
    color: COLORS.textOnDarkMuted,
    marginBottom: '8px',
  },
  progressValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.white,
  },
  progressBar: {
    width: '200px',
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: '4px',
    transition: 'width 0.4s ease',
  },

  // Main Layout
  mainLayout: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px 32px',
    display: 'flex',
    gap: '32px',
  },

  // Sidebar
  sidebar: {
    width: '280px',
    flexShrink: 0,
  },
  sidebarCard: {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    position: 'sticky',
    top: '24px',
  },
  sidebarHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  stepsContainer: {
    padding: '12px',
    maxHeight: 'calc(100vh - 280px)',
    overflowY: 'auto',
  },
  phaseGroup: {
    marginBottom: '16px',
  },
  phaseLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: COLORS.white,
    padding: '6px 12px',
    borderRadius: '6px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  stepButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    marginBottom: '4px',
  },
  stepButtonActive: {
    backgroundColor: COLORS.phases['Foundation'].light,
  },
  stepButtonComplete: {
    backgroundColor: COLORS.successLight,
  },
  stepNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  },
  stepName: {
    fontSize: '14px',
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  downloadAllButton: {
    margin: '16px',
    padding: '14px',
    width: 'calc(100% - 32px)',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  // Main Content
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  stepHeader: {
    marginBottom: '24px',
  },
  stepMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  phaseBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.white,
    padding: '6px 14px',
    borderRadius: '6px',
  },
  stepIndicator: {
    fontSize: '14px',
    color: COLORS.textMuted,
  },
  stepTitle: {
    margin: '0 0 8px',
    fontSize: '28px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: '-0.02em',
  },
  stepDescription: {
    margin: 0,
    fontSize: '16px',
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },

  // Cards
  card: {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '20px 24px',
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.background,
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cardBody: {
    padding: '24px',
  },

  // Form Elements
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    fontSize: '14px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '10px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '200px',
    lineHeight: 1.6,
    boxSizing: 'border-box',
  },
  uploadZone: {
    border: `2px dashed ${COLORS.border}`,
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: COLORS.background,
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  uploadText: {
    fontSize: '16px',
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  uploadHint: {
    fontSize: '14px',
    color: COLORS.textMuted,
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    marginBottom: '8px',
  },
  fileName: {
    flex: 1,
    fontSize: '14px',
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: '13px',
    color: COLORS.textMuted,
  },
  removeButton: {
    width: '24px',
    height: '24px',
    backgroundColor: '#FEE2E2',
    color: COLORS.error,
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },

  // Branch Selector
  branchGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '16px',
  },
  branchButton: {
    padding: '24px',
    backgroundColor: COLORS.background,
    border: `2px solid ${COLORS.border}`,
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s ease',
  },
  branchIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  branchName: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  branchDesc: {
    fontSize: '13px',
    color: COLORS.textMuted,
  },

  // Buttons
  processButton: {
    width: '100%',
    padding: '18px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(10, 37, 64, 0.2)',
  },
  processButtonDisabled: {
    backgroundColor: COLORS.border,
    color: COLORS.textMuted,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: COLORS.white,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  // Output
  outputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: COLORS.background,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  downloadButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  outputContent: {
    padding: '24px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  outputText: {
    margin: 0,
    fontSize: '13px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    lineHeight: 1.7,
    color: COLORS.textPrimary,
    whiteSpace: 'pre-wrap',
  },

  // Processing Log
  logContainer: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#1E293B',
    borderRadius: '10px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    fontSize: '13px',
  },
  logEntry: {
    color: '#94A3B8',
    marginBottom: '4px',
  },
  logTime: {
    color: '#64748B',
  },

  // Error
  errorBox: {
    padding: '16px 20px',
    backgroundColor: '#FEF2F2',
    border: `1px solid #FECACA`,
    borderRadius: '10px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: COLORS.error,
    fontSize: '15px',
  },

  // Navigation
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  navButton: {
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  navButtonSecondary: {
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
    border: `2px solid ${COLORS.border}`,
  },
  navButtonPrimary: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

// ============================================
// Main Application Component
// ============================================

export default function VianeoSprintAutomator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [inputContent, setInputContent] = useState('');
  const [stepOutputs, setStepOutputs] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLog, setProcessingLog] = useState([]);
  const [organizationBranch, setOrganizationBranch] = useState(null);
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const addLog = useCallback((message) => {
    setProcessingLog(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  }, []);

  const handleFileUpload = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    const fileData = [];
    
    for (const file of files) {
      const text = await file.text();
      fileData.push({ name: file.name, size: file.size, content: text });
    }
    
    setUploadedFiles(prev => [...prev, ...fileData]);
    const combined = fileData.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n');
    setInputContent(prev => prev + (prev ? '\n\n' : '') + combined);
    
    if (!projectName && fileData.length > 0) {
      setProjectName(fileData[0].name.split('.')[0].replace(/[_-]/g, ' '));
    }
  }, [projectName]);

  const removeFile = useCallback((index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const buildContext = useCallback((stepId) => {
    const context = {};
    if (stepId >= 1 && stepOutputs[0]) context.STEP_0_OUTPUT = stepOutputs[0];
    if (stepId >= 3 && stepOutputs[2]) context.STEP_2_OUTPUT = stepOutputs[2];
    if (stepId >= 4 && stepOutputs[3]) context.STEP_3_OUTPUT = stepOutputs[3];
    if (stepId >= 5 && stepOutputs[4]) context.STEP_4_OUTPUT = stepOutputs[4];
    if (stepId >= 6 && stepOutputs[5]) context.STEP_5_OUTPUT = stepOutputs[5];
    if (stepId >= 7 && stepOutputs[6]) context.STEP_6_OUTPUT = stepOutputs[6];
    if (stepId >= 8 && stepOutputs[7]) context.STEP_7_OUTPUT = stepOutputs[7];
    if (stepId >= 9 && stepOutputs[8]) context.STEP_8_OUTPUT = stepOutputs[8];
    if (stepId >= 10) {
      context.ALL_PRIOR_OUTPUTS = Object.entries(stepOutputs)
        .filter(([id]) => parseInt(id) < stepId)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([id, output]) => `## Step ${id}: ${STEPS[parseInt(id)].name}\n\n${output}`)
        .join('\n\n---\n\n');
    }
    return context;
  }, [stepOutputs]);

  // API call with exponential backoff retry logic
  const callClaudeAPI = useCallback(async (systemPrompt, userPrompt, addLogFn) => {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          addLogFn(`Retry attempt ${attempt}/${maxRetries} after ${delay/1000}s delay...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const response = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 8000,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `API error: ${response.status}`;

          // Retry on rate limit (429) or server errors (5xx)
          if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
            addLogFn(`${errorMessage} - will retry...`);
            continue;
          }

          throw new Error(errorMessage);
        }

        return await response.json();
      } catch (err) {
        if (attempt === maxRetries) {
          throw err;
        }
        // Network errors - retry
        if (err.name === 'TypeError' || err.message.includes('fetch')) {
          addLogFn(`Network error - will retry...`);
          continue;
        }
        throw err;
      }
    }
  }, []);

  const processStep = useCallback(async () => {
    if (currentStep === 1 && !organizationBranch) {
      setShowBranchSelector(true);
      return;
    }
    if (currentStep === 0 && !inputContent.trim()) {
      setError('Please upload files or paste content to analyze');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingLog([]);
    addLog(`Starting Step ${currentStep}: ${STEPS[currentStep].name}`);

    try {
      const promptConfig = STEP_PROMPTS[currentStep];
      const context = buildContext(currentStep);

      let userPrompt = promptConfig.userPromptTemplate;
      if (currentStep === 0) {
        userPrompt = userPrompt.replace('{INPUT_CONTENT}', inputContent);
      } else if (currentStep === 1) {
        userPrompt = userPrompt.replace('{BRANCH}', organizationBranch);
        userPrompt = userPrompt.replace('{STEP_0_OUTPUT}', context.STEP_0_OUTPUT || '');
      } else {
        Object.entries(context).forEach(([key, value]) => {
          userPrompt = userPrompt.replace(`{${key}}`, value || '[Not available]');
        });
      }

      addLog('Sending request to Claude API...');

      const data = await callClaudeAPI(promptConfig.systemPrompt, userPrompt, addLog);
      addLog('Response received, processing...');

      const output = data.content.filter(item => item.type === "text").map(item => item.text).join("\n");
      setStepOutputs(prev => ({ ...prev, [currentStep]: output }));
      addLog(`Step ${currentStep} complete!`);
    } catch (err) {
      setError(`Error: ${err.message}`);
      addLog(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [currentStep, inputContent, organizationBranch, buildContext, addLog, callClaudeAPI]);

  const downloadOutput = useCallback((stepId) => {
    const output = stepOutputs[stepId];
    if (!output) return;
    const step = STEPS[stepId];
    const date = new Date().toISOString().split('T')[0];
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');
    const filename = `${safeName}_${date}${step.outputFile}.md`;
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [stepOutputs, projectName]);

  const downloadAllOutputs = useCallback(() => {
    const date = new Date().toISOString().split('T')[0];
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');
    const allContent = Object.entries(stepOutputs)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([stepId, output]) => `# Step ${stepId}: ${STEPS[parseInt(stepId)].name}\n\n${output}`)
      .join('\n\n---\n\n');
    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_${date}_VIANEO_Sprint_Complete.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [stepOutputs, projectName]);

  const completedSteps = Object.keys(stepOutputs).length;
  const progressPercent = Math.round((completedSteps / STEPS.length) * 100);
  const currentStepInfo = STEPS[currentStep];
  const currentPhase = currentStepInfo?.phase;
  const phaseColor = COLORS.phases[currentPhase];
  const canProceed = stepOutputs[currentStep] !== undefined;

  return (
    <div style={styles.container}>
      {/* CSS Keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus { border-color: ${COLORS.primaryAccent} !important; }
        button:hover:not(:disabled) { transform: translateY(-1px); }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>V</div>
            <div>
              <h1 style={styles.headerTitle}>VIANEO Sprint Automator</h1>
              <p style={styles.headerSubtitle}>Evidence-Based Business Validation</p>
            </div>
          </div>
          <div style={styles.progressSection}>
            <div style={styles.progressLabel}>Sprint Progress</div>
            <div style={styles.progressValue}>{completedSteps} of {STEPS.length} steps</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div style={styles.mainLayout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <div style={styles.sidebarHeader}>
              <h2 style={styles.sidebarTitle}>Steps</h2>
            </div>
            <div style={styles.stepsContainer}>
              {PHASES.map(phase => (
                <div key={phase} style={styles.phaseGroup}>
                  <div style={{ ...styles.phaseLabel, backgroundColor: COLORS.phases[phase].bg }}>
                    {phase}
                  </div>
                  {STEPS.filter(s => s.phase === phase).map(step => {
                    const isActive = currentStep === step.id;
                    const isComplete = stepOutputs[step.id] !== undefined;
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        style={{
                          ...styles.stepButton,
                          ...(isActive ? { backgroundColor: COLORS.phases[phase].light } : {}),
                          ...(isComplete && !isActive ? styles.stepButtonComplete : {}),
                        }}
                      >
                        <span style={{
                          ...styles.stepNumber,
                          backgroundColor: isComplete ? COLORS.success : isActive ? COLORS.phases[phase].bg : COLORS.border,
                          color: isComplete || isActive ? COLORS.white : COLORS.textSecondary,
                        }}>
                          {isComplete ? '✓' : step.id}
                        </span>
                        <span style={styles.stepName}>{step.name}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            {completedSteps > 0 && (
              <button onClick={downloadAllOutputs} style={styles.downloadAllButton}>
                ↓ Download All Outputs
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Step Header */}
          <div style={styles.stepHeader}>
            <div style={styles.stepMeta}>
              <span style={{ ...styles.phaseBadge, backgroundColor: phaseColor.bg }}>{currentPhase}</span>
              <span style={styles.stepIndicator}>Step {currentStepInfo.id} of 12</span>
            </div>
            <h2 style={styles.stepTitle}>{currentStepInfo.name}</h2>
            <p style={styles.stepDescription}>{currentStepInfo.description}</p>
          </div>

          {/* Branch Selector */}
          {showBranchSelector && currentStep === 1 && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Select Application Format</h3>
              </div>
              <div style={styles.cardBody}>
                <p style={{ margin: '0 0 16px', color: COLORS.textSecondary }}>
                  Choose the program format for the application form:
                </p>
                <div style={styles.branchGrid}>
                  {[
                    { id: '360SIS', name: '360 Social Impact Studios', icon: '🌍', desc: 'Social impact metrics, SDG alignment' },
                    { id: 'CNEN', name: 'CNEN', icon: '🇧🇷', desc: 'Brazil Nuclear Commission format' }
                  ].map(branch => (
                    <button
                      key={branch.id}
                      onClick={() => { setOrganizationBranch(branch.id); setShowBranchSelector(false); }}
                      style={styles.branchButton}
                      onMouseEnter={e => { e.target.style.borderColor = COLORS.primaryAccent; e.target.style.backgroundColor = COLORS.phases['Foundation'].light; }}
                      onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.backgroundColor = COLORS.background; }}
                    >
                      <div style={styles.branchIcon}>{branch.icon}</div>
                      <div style={styles.branchName}>{branch.name}</div>
                      <div style={styles.branchDesc}>{branch.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Section (Step 0) */}
          {currentStep === 0 && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Source Materials</h3>
              </div>
              <div style={styles.cardBody}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '8px' }}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project or company name"
                    style={styles.input}
                  />
                </div>

                <input type="file" ref={fileInputRef} multiple accept=".txt,.md,.pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
                <div onClick={() => fileInputRef.current?.click()} style={styles.uploadZone}>
                  <div style={styles.uploadIcon}>📄</div>
                  <div style={styles.uploadText}>Drop files or click to upload</div>
                  <div style={styles.uploadHint}>TXT, MD, PDF, DOCX supported</div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} style={styles.fileItem}>
                        <span style={styles.fileName}>{file.name}</span>
                        <span style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                        <button onClick={() => removeFile(idx)} style={styles.removeButton}>×</button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '8px' }}>
                    Or paste content directly
                  </label>
                  <textarea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder="Paste pitch deck content, business plan, or other materials..."
                    style={styles.textarea}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={processStep}
            disabled={isProcessing || (currentStep === 0 && !inputContent.trim())}
            style={{
              ...styles.processButton,
              ...(isProcessing || (currentStep === 0 && !inputContent.trim()) ? styles.processButtonDisabled : {}),
            }}
          >
            {isProcessing ? (
              <>
                <div style={styles.spinner} />
                Processing Step {currentStep}...
              </>
            ) : (
              `Execute Step ${currentStep}: ${currentStepInfo.name}`
            )}
          </button>

          {/* Processing Log */}
          {processingLog.length > 0 && (
            <div style={styles.logContainer}>
              {processingLog.map((log, idx) => (
                <div key={idx} style={styles.logEntry}>
                  <span style={styles.logTime}>[{log.time}]</span> {log.message}
                </div>
              ))}
            </div>
          )}

          {/* Output Display */}
          {stepOutputs[currentStep] && (
            <div style={{ ...styles.card, marginTop: '24px' }}>
              <div style={styles.outputHeader}>
                <h3 style={styles.cardTitle}>Output</h3>
                <button onClick={() => downloadOutput(currentStep)} style={styles.downloadButton}>
                  ↓ Download Markdown
                </button>
              </div>
              <div style={styles.outputContent}>
                <pre style={styles.outputText}>{stepOutputs[currentStep]}</pre>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={styles.navigation}>
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              style={{
                ...styles.navButton,
                ...styles.navButtonSecondary,
                ...(currentStep === 0 ? styles.navButtonDisabled : {}),
              }}
            >
              ← Previous Step
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}
              disabled={!canProceed || currentStep >= STEPS.length - 1}
              style={{
                ...styles.navButton,
                ...styles.navButtonPrimary,
                ...(!canProceed || currentStep >= STEPS.length - 1 ? styles.navButtonDisabled : {}),
              }}
            >
              Next Step →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
