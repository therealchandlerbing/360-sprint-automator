import React, { useState, useCallback, useRef, useEffect } from 'react';
import JSZip from 'jszip';

// ============================================
// Local Storage Keys for Session Persistence
// ============================================
const STORAGE_KEYS = {
  PROJECT_NAME: 'vianeo_projectName',
  INPUT_CONTENT: 'vianeo_inputContent',
  STEP_OUTPUTS: 'vianeo_stepOutputs',
  ORGANIZATION_BRANCH: 'vianeo_organizationBranch',
  CURRENT_STEP: 'vianeo_currentStep',
  LAST_SAVED: 'vianeo_lastSaved',
};

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

  4: {
    name: 'Legitimacy Worksheet',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 4: Legitimacy Worksheet.

## CORE PURPOSE
Validate foundational business justification by examining problem clarity, domain scope, team capabilities, and available resources. Weight in overall VIANEO Score: 15%.

## REQUIRED OUTPUT STRUCTURE

### 1. Core Project Information Table
| Field | Limit | Content |
|-------|-------|---------|
| Project Genesis | 250 chars | Origin story, founding context, key dates, partnerships |
| Problem to Solve | 250 chars | Gap/pain WITHOUT solution elements; include significance evidence |
| Field of Application | 60 chars | Specific sector with boundaries |

### 2. Available Means Assessment

**Human Resources Table (4-8 entries):**
- Role, Name, Experience Summary, Years in Domain
- Differentiator Status (Yes/No for rare expertise)
- Overall Synthesis Note (250 chars max)

**Physical/Intellectual Resources Table (4-10 entries):**
- Asset Type, Description, Status
- Differentiator Status (proprietary/exclusive/validated)
- Overall Synthesis Note (250 chars max)

**Financial Resources Table (3-6 entries):**
- Source, Amount, Status, Timeline
- Per-row notes (80 chars max)

### 3. Competitive Advantages (250 chars)
Synthesize 2-4 strongest moats with specific evidence.

### 4. Assessment Summary

**Scoring Components (1-5 scale):**
- Problem Definition: Clarity, validation sources, metrics
- Application Domain: Boundaries, expertise, scope appropriateness
- Team & Approach: Relevant expertise, methodology, commitment
- Resources: Asset differentiation, IP strength, funding adequacy

**Legitimacy Score = Average of 4 components**

**Score Interpretation:**
- 4.5-5.0: Exceptional
- 3.5-4.4: Above Average
- 3.0-3.4: Adequate
- 2.0-2.9: Below Average
- <2.0: Poor

**Required Sections:**
- Strengths: 4-6 evidence-based bullets with metrics
- Gaps: 5-8 honest capability/resource gaps
- Key Risk Factors: 4-6 specific threats
- Key Success Factors: 4-6 actionable items (6-12 month horizon)
- Overall Assessment: 150-200 word synthesis

## CHARACTER LIMITS (STRICTLY ENFORCED)
- Project Genesis: 250 chars
- Problem to Solve: 250 chars
- Field of Application: 60 chars
- Synthesis Notes: 250 chars
- Financial Row Notes: 80 chars
- Competitive Advantages: 250 chars

## WRITING STANDARDS
- Remove filler words ("very," "really," "in order to")
- Use strong verbs with specific numbers
- Distinguish validated capabilities from aspirations
- Cite concrete facts, not generic phrases`,
    userPromptTemplate: `Create a Legitimacy Worksheet for this venture:

EXECUTIVE BRIEF (Step 0):
{STEP_0_OUTPUT}

40Q DIAGNOSTIC (Step 2):
{STEP_2_OUTPUT}

29Q MARKET MATURITY (Step 3):
{STEP_3_OUTPUT}

Generate the complete Legitimacy Worksheet with all sections, enforcing character limits strictly. Score each component and provide the overall Legitimacy Score.`
  },

  5: {
    name: 'Needs & Requesters',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 5: Desirability - Needs/Requesters Analysis.

## CORE FRAMEWORK: WHO/WHAT/WHY/HOW
Weight in overall VIANEO Score: 25% (HIGHEST - Desirability dimension)

### WHO - Identify Requesters (6-10 distinct roles)
| Field | Standard |
|-------|----------|
| Requester Role | 3-6 words, specific professional titles |
| Description | 2-4 sentences (who, why they matter, current situation) |
| Reliability Rating | "More than 5 interviewed" / "Less than 5 interviewed [validate]" / "Not yet interviewed [validate]" |

**Critical:** Always separate Users from Buyers in B2B contexts.

### WHAT - Define Needs (exactly 10 needs)
Three categories:
- **Tasks (3-4):** Jobs to be done, goals, accomplishments
- **Pains (3-4):** Frustrations, risks, obstacles
- **Expectations (3-4):** Desired outcomes, success states

**NON-NEGOTIABLE: Maximum 60 characters per need statement**

Quality Standards:
- Each need distinct and testable
- No embedded solutions ("mobile app" is a solution, not a need)
- Evidence-based or explicitly labeled as hypothesis

### WHY - Map Existing Solutions (5-6 alternatives)
Include "Doing Nothing" as one option.
| Element | Requirement |
|---------|-------------|
| Solution Name | Specific brands or generic categories |
| Description | 2-3 sentences (what, who uses, how works) |
| Limitations | 2-4 sentences (specific, evidence-based gaps) |

### HOW VALIDATED - Evidence Assessment
- Strong Evidence: Facts with sources cited
- Weak Evidence: Assumptions requiring validation
- Validation Gaps: Prioritized High/Medium/Low

## STRATEGIC RECOMMENDATIONS
Three priorities, each containing:
- Clear action name with timeline
- Specific objective statement
- 3-5 measurable success metrics

## CHARACTER LIMITS (ENFORCED)
- Field of Application: 60 chars
- Each Need Statement: 60 chars MAX
- Ecosystem Notes: 250 chars
- Section Notes: 250 chars

## CRITICAL RULE
"Be ruthlessly honest about validation status. If no interviews exist, say so explicitly."`,
    userPromptTemplate: `Conduct the Needs & Requesters analysis (WHO/WHAT/WHY/HOW):

EXECUTIVE BRIEF (Step 0):
{STEP_0_OUTPUT}

LEGITIMACY WORKSHEET (Step 4):
{STEP_4_OUTPUT}

Generate the complete analysis with:
1. Requesters table (6-10 roles with reliability ratings)
2. Needs table (exactly 10 needs, max 60 chars each)
3. Existing solutions mapping (5-6 alternatives)
4. Evidence assessment and validation gaps
5. Strategic recommendations with timelines`
  },

  6: {
    name: 'Persona Development',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 6: Persona Development.

## CORE PURPOSE
Create 3-5 evidence-based user personas that validate the Desirability dimension (25% of score).

## CRITICAL ENTITY GUARDRAILS
- Derive personas EXCLUSIVELY from the Requesters list (Step 5)
- Do NOT invent personas outside this list
- Use requester names exactly as they appear
- Each persona maps to one or more requesters

## VALIDATION LEVELS & BADGES

| Level | Interviews | Badge | Score |
|-------|------------|-------|-------|
| Exceptional | 10+ | Green ✓ VALIDATED | 5 |
| Strong | 5-10 | Green ✓ VALIDATED | 4 |
| Adequate | 3-5 | Orange ⚠ PARTIAL | 3 (minimum) |
| Weak | 1-2 | Orange ⚠ PARTIAL | 2 |
| Insufficient | 0 | Red ✗ NEEDS VALIDATION | 1 |

**Minimum threshold:** 3 interviews per persona (9-15 total)

## PERSONA STRUCTURE (per persona, max 1 page)

1. **Validation Badge** (color-coded with interview count)

2. **Requester Section:**
   - First name only (single name)
   - Specific age number (e.g., "42" not "40-45")
   - Life/Motivations (2-3 sentences)
   - Personality/Values (2-3 sentences)

3. **Field of Application:**
   - Thinks/Feels (2-3 sentences)
   - Observes (2-3 sentences)
   - Does (2-3 sentences)
   - Others Say (2-3 sentences)

4. **Activities and Challenges:**
   - Tasks: 4-6 bullets (60 chars max each)
   - Pains: 4-6 bullets (60 chars max each)
   - Expectations: 4-6 bullets (60 chars max each)

5. **Current Solutions** (2-3 sentences naming specific tools with gaps)

## CHARACTER LIMITS (STRICT)
- All bullet points: 60 characters MAX
- First name: Single name only
- Age: Specific number, not range
- Paragraphs: Exactly 2-3 sentences each

## QUALITY GATE CHECKLIST
- [ ] 3-5 personas created
- [ ] Minimum 3 interviews per persona
- [ ] All bullets under 60 characters
- [ ] Paragraphs exactly 2-3 sentences
- [ ] Current solutions specifically named
- [ ] Validation badges match evidence
- [ ] Each persona distinct (no overlap)`,
    userPromptTemplate: `Create evidence-based personas from the Requesters analysis:

NEEDS & REQUESTERS (Step 5):
{STEP_5_OUTPUT}

EXECUTIVE BRIEF (Step 0):
{STEP_0_OUTPUT}

Generate 3-5 distinct personas with:
1. Validation badges showing interview evidence
2. Complete persona profiles (demographics, motivations, behaviors)
3. Tasks, Pains, Expectations (60 char limit per bullet)
4. Current solutions with gap analysis
5. Evidence base summary`
  },

  7: {
    name: 'Needs Qualification Matrix',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 7: Needs Qualification Matrix.

## CORE PURPOSE
Transform Step 5 analysis into a visual matrix identifying market opportunities where high-importance needs have low satisfaction.

## MATRIX STRUCTURE
- **Rows:** Need statements (10-12 from Step 5, max 60 chars each)
- **Columns:** Requester segments (6-9 from Step 5) with interview counts
- **Each Cell:** Two indicators - Importance (top) and Satisfaction (bottom)

## IMPORTANCE LEVELS
| Level | Color | Meaning |
|-------|-------|---------|
| Fundamental | Red #dc3544 | Critical, non-negotiable; business fails without |
| Important | Orange #fd7e14 | Significant priority with major impact |
| Secondary | Yellow #ffc107 | Useful but non-essential |
| None | Gray #6c757d | Irrelevant to this segment |
| Don't Know | Light gray | Insufficient data |

## SATISFACTION LEVELS
| Level | Color | Meaning |
|-------|-------|---------|
| Very Well | Green #28a745 | Existing solutions effective |
| Pretty Much | Teal #20c997 | Adequate with minor gaps |
| Rather Not | Yellow #ffc107 | Poor solutions, significant gaps |
| Not At All | Red #dc3544 | Complete market failure |
| N/A | Light gray | Only when importance = "None" |
| Don't Know | Light gray | Insufficient competitive data |

**RULE: When importance is "None", satisfaction MUST be "N/A"**

## PRIORITY ZONES

**Tier 1 - Critical Opportunities:**
Fundamental importance + Not At All satisfaction = highest priority

**Tier 2 - Strong Opportunities:**
Important + Rather Not/Not At All = solid improvement potential

**Tier 3 - Research Gaps:**
Clusters of "Don't Know" = immediate validation needed

## DATA INTEGRITY (NON-NEGOTIABLE)
- Every row = exact need from Step 5 (verbatim, no paraphrasing)
- Every column = exact requester from Step 5
- Matrix dimensions = exact count from source
- Do NOT abbreviate, combine, or infer needs

## OUTPUT FORMAT
Generate a markdown table with:
1. Column headers: Requester names + interview counts
2. Row labels: Need statements (60 char max)
3. Cell contents: [Importance] / [Satisfaction]
4. Summary: Priority opportunities identified
5. Validation gaps requiring interviews`,
    userPromptTemplate: `Create the Needs Qualification Matrix:

NEEDS & REQUESTERS (Step 5):
{STEP_5_OUTPUT}

PERSONAS (Step 6):
{STEP_6_OUTPUT}

Generate:
1. Complete matrix with all needs (rows) vs requesters (columns)
2. Importance and Satisfaction ratings for each cell
3. Priority opportunity identification (Tier 1, 2, 3)
4. Pattern analysis (horizontal, vertical trends)
5. Validation gaps and recommended actions`
  },

  8: {
    name: 'Players & Influencers',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 8: Players & Influencers Ecosystem Analysis.

## CORE PURPOSE
Map ecosystem acceptability by identifying who will support, resist, or influence your innovation. Weight: 20% (Acceptability dimension).

## TWO DISTINCT CATEGORIES

### Ecosystem Players (8-10 entries)
Active market participants who buy, sell, or provide in your market:
- Direct customers and end-users
- Competitors (direct and indirect)
- Suppliers and partners
- Distribution channels
- Value chain participants

**Selection test:** "Do they buy, sell, or provide something in our market?"

### Ecosystem Influencers (8-10 entries)
Market shapers without direct transactions:
- Regulators and government agencies
- Industry associations
- Standards bodies
- Media and analysts
- NGOs and advocacy groups

**Selection test:** "Do they influence our market without buying/selling in it?"

## ACCEPTABILITY RATING SYSTEM

| Rating | Stance | Indicator |
|--------|--------|-----------|
| Favorable 🟢 | Active support | Aligned incentives; you solve their problems |
| Neutral 🟡 | Wait-and-see | Need more information; could shift |
| Unfavorable 🔴 | Likely resistance | Threaten status quo; conflicting interests |

## STRICT SELECTION DISCIPLINE
Apply the "8-10 Rule": If you could only engage with 10 stakeholders per category, would this one make the cut?

**Avoid:**
- Listing 15-20 entities (forces prioritization)
- Generic categories instead of named entities
- Missing indirect competitors or substitutes
- Equal treatment of unequal power holders

## STRATEGIC NOTE FORMULA
[Current Situation] + [Impact] + [Strategic Implication]

Example: "Controls 60% distribution; partnership critical for Q2 launch; negotiation required on margin structure."

## CHARACTER LIMITS
- Entity name: 60 chars
- Strategic note: 250 chars
- Executive context: 500 chars

## OUTPUT STRUCTURE
For each category (Players and Influencers):
| Entity Name | Type | Acceptability | Strategic Note |
|-------------|------|---------------|----------------|`,
    userPromptTemplate: `Map the ecosystem Players & Influencers:

EXECUTIVE BRIEF (Step 0):
{STEP_0_OUTPUT}

NEEDS & REQUESTERS (Step 5):
{STEP_5_OUTPUT}

29Q MARKET MATURITY (Step 3):
{STEP_3_OUTPUT}

Generate:
1. Players table (8-10 most critical market participants)
2. Influencers table (8-10 key market shapers)
3. Acceptability ratings with rationale
4. Strategic notes explaining implications
5. Engagement priority recommendations`
  },

  9: {
    name: 'Value Network Map',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 9: Ecosystem Value Network Map.

## CORE STRUCTURE
5-column value network: Enablers & Influencers | Core Product | Channels & Partners | Buyers & Clients | End Users

## NODE TYPES & PROPERTIES

### Organizations (Primary Nodes)
- **Acceptability Status:** Favorable (green), Neutral (orange), Unfavorable (red)
- **Need Level:** Critical, Important, Secondary
- **Position:** Across five value chain columns

### Requesters (Nested within Organizations)
"Organizations don't have needs - people do."
- Specific roles/titles from Step 5
- Mapped to their parent organizations

## VALUE FLOW TYPES
Six connection types:
1. \`provides funding to\` - capital flow
2. \`provides technology to\` - technical enablement
3. \`distributed via\` - go-to-market path
4. \`serves\` - customer relationships
5. \`deploys for\` - usage enablement
6. \`influences\` - non-transactional impact

## PRIORITY TARGET LOGIC
Organizations meeting BOTH criteria get priority focus:
1. Favorable acceptability AND
2. Critical or Important need from contained requesters

## VALIDATION GUARDRAILS
"Only use listed entity names. Do NOT invent new entities."
All stakeholders must originate from:
- Step 5 (Requesters)
- Step 8 (Players/Influencers)

## OUTPUT FORMAT
Generate a structured network map showing:
1. All five columns with positioned entities
2. Acceptability color coding
3. Value flows between entities
4. Priority targets highlighted
5. Summary of network dynamics`,
    userPromptTemplate: `Create the Value Network Map:

NEEDS & REQUESTERS (Step 5):
{STEP_5_OUTPUT}

PLAYERS & INFLUENCERS (Step 8):
{STEP_8_OUTPUT}

EXECUTIVE BRIEF (Step 0):
{STEP_0_OUTPUT}

Generate:
1. 5-column network structure with all entities positioned
2. Acceptability ratings (color-coded)
3. Value flow connections between entities
4. Priority targets (favorable + critical need)
5. Network analysis and strategic implications`
  },

  10: {
    name: 'Diagnostic Comment',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 10: Diagnostic Comment & Executive Decision Brief.

## CORE PRINCIPLE
"Conciseness over comprehensiveness, specificity over abstraction, actionability over analysis, evidence-based over aspirational."

## EXECUTIVE DECISION BRIEF (4 paragraphs, 6-8 sentences total)

### Paragraph 1: Strengths (1-2 sentences)
Validated assets and competitive advantages with specific numbers, names, metrics.

### Paragraph 2: Risks (1-2 sentences)
Critical vulnerabilities threatening viability, quantified where possible.

### Paragraph 3: Near-term Actions (2-3 sentences)
3-4 concrete initiatives with named owners and 30-60 day timeframes.

### Paragraph 4: Evidence Gaps (1-2 sentences)
Material missing validation affecting decision confidence.

## DIMENSION SCORE SYNTHESIS

| Dimension | Weight | Score | Status |
|-----------|--------|-------|--------|
| Legitimacy | 15% | X.X | [interpretation] |
| Desirability | 25% | X.X | [interpretation] |
| Acceptability | 20% | X.X | [interpretation] |
| Feasibility | 20% | X.X | [interpretation] |
| Viability | 20% | X.X | [interpretation] |

**Status Interpretation:**
- 4.5-5.0: Strong
- 3.5-4.4: Promising
- 3.0-3.4: Developing
- 2.0-2.9: Problematic
- <2.0: Non-viable

## RECOMMENDATION FORMAT
Structure across four time horizons:
1. **Immediate (Weeks 1-4):** Specific actions
2. **Short-term (Months 2-3):** Key milestones
3. **Medium-term (Months 4-6):** Strategic objectives
4. **Success Metrics:** Specific thresholds

## FORMATTING STANDARDS
- No em dashes (use commas or parentheses)
- Every claim backed by assessment data
- Specific evidence (never "some" or "several")
- Named owners for all actions
- Only material gaps (not minor documentation issues)`,
    userPromptTemplate: `Generate the Diagnostic Comment synthesizing all prior analysis:

{ALL_PRIOR_OUTPUTS}

Create:
1. Executive Decision Brief (4 paragraphs, 6-8 sentences)
2. Dimension Score Summary table with interpretations
3. Detailed Strengths (4-6 evidence-based items)
4. Detailed Risks (4-6 specific vulnerabilities)
5. Recommendations across four time horizons
6. Key assumptions and open questions`
  },

  11: {
    name: 'Features-Needs Matrix',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 11: Features-Needs Matrix.

## CORE PURPOSE
Bridge validation to execution by mapping solution capabilities against validated customer needs. Zero hallucination of entities.

## DATA SOURCES (EXACT MATCH REQUIRED)

### Needs (from Step 5)
- Extract verbatim (max 60 chars each)
- Classify by opportunity level from Step 7:
  - **High** (green): Core value proposition, must address
  - **Medium** (yellow): Competitive differentiator
  - **Low** (orange): Secondary importance
  - **Expected** (blue): Table stakes
  - **Accessory** (gray): Peripheral

### Features (10-15 solution capabilities)
- Action-oriented descriptions
- Mark as Existing or New

### Means (from Step 4)
- Human, physical, intellectual resources
- Differentiation status indicators

## MATRIX 1: FEATURES-NEEDS

| Structure | Requirement |
|-----------|-------------|
| Rows | Features (10-15) |
| Columns | Need statements from Step 5 |
| Cell Logic | Checkmark ONLY when feature directly solves need |
| Coloring | Based on opportunity classification |

**Coverage Target:** 40-80% overall; 100% for High-Opportunity needs

## MATRIX 2: FEATURES-MEANS

Same row structure (features) with columns = available resources.
Shows implementation feasibility through resource alignment.

## COVERAGE MAPPING RULES
Mark checkmark ONLY when:
- Feature directly addresses the need
- User would find obvious value
- Connection requires no rationalization

Leave blank when connection is indirect.

## MVP DEFINITION FORMULA
MVP = Features addressing (All High + All Expected)
      excluding Features with only (Accessory + Low) coverage

## NON-NEGOTIABLE CONSTRAINTS
- All need statements match Step 5 exactly
- All means match Step 4 exactly
- Features-Needs and Features-Means share identical row ordering
- No inferred or implied needs/means added`,
    userPromptTemplate: `Create the Features-Needs Matrix:

{ALL_PRIOR_OUTPUTS}

Generate:
1. Features list (10-15 capabilities, mark Existing/New)
2. Features-Needs Matrix with coverage checkmarks
3. Features-Means Matrix showing resource alignment
4. Opportunity classification for each need
5. Coverage analysis and gap identification
6. MVP scope recommendation
7. Deferred features with rationale`
  },

  12: {
    name: 'Viability Assessment',
    systemPrompt: `You are a VIANEO Framework evaluator executing Step 12: Final Viability Assessment.

## CORE PURPOSE
Synthesize all prior evaluation steps into a decision-ready viability assessment with gate recommendation.

## GATE RECOMMENDATION FRAMEWORK

| Decision | Criteria |
|----------|----------|
| **GO** | All thresholds met, strengths outweigh risks, next steps clear |
| **CONDITIONAL GO** | Mostly positive with specific prerequisites required first |
| **HOLD** | Significant uncertainties needing validation before advancement |
| **NO GO** | Fundamental issues beyond reasonable resolution |

## VIABILITY DASHBOARD STRUCTURE

### 1. Snapshot (≤1 minute read)
- Context summary
- Dimension scores table with source citations
- Threshold status for each dimension

### 2. Strengths & Assets (3-7 items)
- Grouped by theme
- Step references included
- Concrete evidence cited

### 3. Risks & Weaknesses (3-7 items)
- Specific evidence links
- Uncertainty language when appropriate
- Impact assessment

### 4. Key Assumptions & Open Questions
- Numbered list
- Why each matters
- Required validation method

### 5. Gate Recommendation
- Clear decision (GO/CONDITIONAL GO/HOLD/NO GO)
- Conditions if applicable
- Timeline for reassessment if not GO

## DIMENSION THRESHOLDS

| Dimension | Weight | Threshold | Focus |
|-----------|--------|-----------|-------|
| Legitimacy | 15% | ≥3.0 | Real problem worth solving? |
| Desirability | 25% | ≥3.5 | People want YOUR solution? |
| Acceptability | 20% | ≥3.0 | Ecosystem will support? |
| Feasibility | 20% | ≥3.0 | Can you deliver? |
| Viability | 20% | ≥3.0 | Business model sustainable? |

**Overall Threshold:** ≥3.2 weighted average

## CRITICAL REQUIREMENTS
- Dimension scores sourced from prior steps (no invented metrics)
- All strengths/risks linked to supporting steps
- Product descriptions ≤250 characters
- Conditions specified if not unconditional GO`,
    userPromptTemplate: `Generate the Final Viability Assessment:

{ALL_PRIOR_OUTPUTS}

Create:
1. Executive Snapshot with dimension scores
2. Strengths & Assets (3-7 items with evidence)
3. Risks & Weaknesses (3-7 items with evidence)
4. Key Assumptions & Open Questions
5. Gate Recommendation (GO/CONDITIONAL GO/HOLD/NO GO)
6. Conditions and prerequisites if applicable
7. 90-day action roadmap
8. Success metrics and reassessment triggers`
  },
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
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const sessionInputRef = useRef(null);

  // ============================================
  // Session Recovery: Load from localStorage on mount
  // ============================================
  useEffect(() => {
    try {
      const savedProjectName = localStorage.getItem(STORAGE_KEYS.PROJECT_NAME);
      const savedInputContent = localStorage.getItem(STORAGE_KEYS.INPUT_CONTENT);
      const savedStepOutputs = localStorage.getItem(STORAGE_KEYS.STEP_OUTPUTS);
      const savedBranch = localStorage.getItem(STORAGE_KEYS.ORGANIZATION_BRANCH);
      const savedCurrentStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);

      if (savedProjectName) setProjectName(savedProjectName);
      if (savedInputContent) setInputContent(savedInputContent);
      if (savedStepOutputs) {
        try {
          setStepOutputs(JSON.parse(savedStepOutputs));
        } catch {
          // Invalid JSON, ignore
        }
      }
      if (savedBranch) setOrganizationBranch(savedBranch);
      if (savedCurrentStep) {
        const step = parseInt(savedCurrentStep, 10);
        if (!isNaN(step) && step >= 0 && step < STEPS.length) {
          setCurrentStep(step);
        }
      }
    } catch {
      // localStorage not available or error, continue with defaults
    }
    setIsSessionLoaded(true);
  }, []);

  // ============================================
  // Auto-save: Save to localStorage when state changes
  // ============================================
  useEffect(() => {
    // Don't save until initial session is loaded to prevent overwriting
    if (!isSessionLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEYS.PROJECT_NAME, projectName);
      localStorage.setItem(STORAGE_KEYS.INPUT_CONTENT, inputContent);
      localStorage.setItem(STORAGE_KEYS.STEP_OUTPUTS, JSON.stringify(stepOutputs));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, String(currentStep));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
      if (organizationBranch) {
        localStorage.setItem(STORAGE_KEYS.ORGANIZATION_BRANCH, organizationBranch);
      }
    } catch {
      // localStorage not available or quota exceeded, silently fail
    }
  }, [isSessionLoaded, projectName, inputContent, stepOutputs, currentStep, organizationBranch]);

  // ============================================
  // Unsaved Changes Warning: Warn before closing
  // ============================================
  useEffect(() => {
    const hasUnsavedWork = Object.keys(stepOutputs).length > 0 || inputContent.trim().length > 0;

    const handleBeforeUnload = (e) => {
      if (hasUnsavedWork) {
        e.preventDefault();
        // Modern browsers require returnValue to be set
        e.returnValue = 'You have unsaved work. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stepOutputs, inputContent]);

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

    // Step dependencies per PRD specification:
    // Step 1: needs Step 0
    // Step 2: needs Step 0
    // Step 3: needs Steps 0, 2
    // Step 4: needs Steps 0, 2, 3
    // Step 5: needs Steps 0, 4
    // Step 6: needs Steps 0, 5
    // Step 7: needs Steps 5, 6
    // Step 8: needs Steps 0, 3, 5
    // Step 9: needs Steps 0, 5, 8
    // Steps 10-12: need ALL prior outputs

    // Always include Step 0 for steps 1+
    if (stepId >= 1 && stepOutputs[0]) context.STEP_0_OUTPUT = stepOutputs[0];

    // Step 2 dependencies
    if (stepId === 2 && stepOutputs[0]) context.STEP_0_OUTPUT = stepOutputs[0];

    // Step 3 dependencies
    if (stepId >= 3 && stepOutputs[2]) context.STEP_2_OUTPUT = stepOutputs[2];

    // Step 4 dependencies (needs 0, 2, 3)
    if (stepId >= 4 && stepOutputs[3]) context.STEP_3_OUTPUT = stepOutputs[3];

    // Step 5 dependencies (needs 0, 4)
    if (stepId >= 5 && stepOutputs[4]) context.STEP_4_OUTPUT = stepOutputs[4];

    // Step 6+ dependencies (needs 5)
    if (stepId >= 6 && stepOutputs[5]) context.STEP_5_OUTPUT = stepOutputs[5];

    // Step 7 dependencies (needs 5, 6)
    if (stepId >= 7 && stepOutputs[6]) context.STEP_6_OUTPUT = stepOutputs[6];

    // Step 8 dependencies (needs 0, 3, 5 - already included above)

    // Step 9 dependencies (needs 5, 8)
    if (stepId >= 9 && stepOutputs[8]) context.STEP_8_OUTPUT = stepOutputs[8];

    // Steps 10-12: aggregate ALL prior outputs
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

  // Download all outputs as ZIP bundle with manifest
  const downloadAllAsZip = useCallback(async () => {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');

    const zip = new JSZip();

    // Add each step output as a separate file
    const files = [];
    Object.entries(stepOutputs)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([stepId, output]) => {
        const step = STEPS[parseInt(stepId)];
        const filename = `${String(stepId).padStart(2, '0')}${step.outputFile.replace(/^_\d+/, '')}.md`;
        zip.file(filename, output);
        files.push({
          step: parseInt(stepId),
          filename: filename,
          size: output.length
        });
      });

    // Create manifest
    const manifest = {
      projectName: projectName || 'Project',
      generatedAt: timestamp,
      completedSteps: Object.keys(stepOutputs).map(id => parseInt(id)).sort((a, b) => a - b),
      organizationBranch: organizationBranch,
      totalSteps: STEPS.length,
      files: files
    };
    zip.file('_manifest.json', JSON.stringify(manifest, null, 2));

    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_VIANEO_Sprint_${date}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }, [stepOutputs, projectName, organizationBranch]);

  // Copy output to clipboard
  const copyToClipboard = useCallback(async (stepId) => {
    const output = stepOutputs[stepId];
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopyFeedback(stepId);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyFeedback(stepId);
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  }, [stepOutputs]);

  // Export session state as JSON
  const exportSession = useCallback(() => {
    const date = new Date().toISOString().split('T')[0];
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');

    const sessionData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projectName: projectName,
      organizationBranch: organizationBranch,
      currentStep: currentStep,
      stepOutputs: stepOutputs,
      inputContent: inputContent
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_session_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [projectName, organizationBranch, currentStep, stepOutputs, inputContent]);

  // Import session state from JSON
  const importSession = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sessionData = JSON.parse(e.target.result);

        // Validate session data
        if (!sessionData.version || !sessionData.stepOutputs) {
          setError('Invalid session file format');
          return;
        }

        // Restore session state
        if (sessionData.projectName) setProjectName(sessionData.projectName);
        if (sessionData.organizationBranch) setOrganizationBranch(sessionData.organizationBranch);
        if (typeof sessionData.currentStep === 'number') setCurrentStep(sessionData.currentStep);
        if (sessionData.stepOutputs) setStepOutputs(sessionData.stepOutputs);
        if (sessionData.inputContent) setInputContent(sessionData.inputContent);

        setError(null);
        setProcessingLog([{ time: new Date().toLocaleTimeString(), message: `Session restored from ${file.name}` }]);
      } catch (err) {
        setError(`Failed to import session: ${err.message}`);
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  }, []);

  // Clear session from localStorage and reset state
  const clearSession = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear all session data? This cannot be undone.')) {
      return;
    }

    // Clear localStorage
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch {
      // localStorage not available
    }

    // Reset state
    setProjectName('');
    setInputContent('');
    setStepOutputs({});
    setCurrentStep(0);
    setOrganizationBranch(null);
    setUploadedFiles([]);
    setProcessingLog([]);
    setError(null);
    setShowBranchSelector(false);
  }, []);

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
            {/* Download Buttons */}
            {completedSteps > 0 && (
              <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.border}` }}>
                <button onClick={downloadAllAsZip} style={styles.downloadAllButton}>
                  ↓ Download ZIP Bundle
                </button>
                <button
                  onClick={downloadAllOutputs}
                  style={{ ...styles.downloadAllButton, marginTop: '8px', backgroundColor: COLORS.primaryLight }}
                >
                  ↓ Download Markdown
                </button>
              </div>
            )}

            {/* Session Management */}
            <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Session
              </div>
              <input
                type="file"
                ref={sessionInputRef}
                accept=".json"
                onChange={importSession}
                style={{ display: 'none' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={exportSession}
                  disabled={completedSteps === 0}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: completedSteps > 0 ? COLORS.background : COLORS.borderLight,
                    color: completedSteps > 0 ? COLORS.textPrimary : COLORS.textMuted,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    cursor: completedSteps > 0 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Export
                </button>
                <button
                  onClick={() => sessionInputRef.current?.click()}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: COLORS.background,
                    color: COLORS.textPrimary,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Import
                </button>
              </div>
              <button
                onClick={clearSession}
                disabled={completedSteps === 0 && !inputContent.trim()}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: (completedSteps > 0 || inputContent.trim()) ? '#FEF2F2' : COLORS.borderLight,
                  color: (completedSteps > 0 || inputContent.trim()) ? COLORS.error : COLORS.textMuted,
                  border: `1px solid ${(completedSteps > 0 || inputContent.trim()) ? '#FECACA' : COLORS.border}`,
                  borderRadius: '8px',
                  cursor: (completedSteps > 0 || inputContent.trim()) ? 'pointer' : 'not-allowed',
                }}
              >
                Clear Session
              </button>
              {/* Auto-save indicator */}
              <div style={{
                marginTop: '12px',
                fontSize: '11px',
                color: COLORS.textMuted,
                textAlign: 'center',
              }}>
                Auto-saving enabled
              </div>
            </div>
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => copyToClipboard(currentStep)}
                    style={{
                      ...styles.downloadButton,
                      backgroundColor: copyFeedback === currentStep ? COLORS.success : COLORS.primaryLight,
                    }}
                  >
                    {copyFeedback === currentStep ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button onClick={() => downloadOutput(currentStep)} style={styles.downloadButton}>
                    ↓ Download
                  </button>
                </div>
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
