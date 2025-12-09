// ============================================
// Express Assessment V2 - Streamlined Prompt
// Based on proven Claude Artifacts implementation
// ============================================

/**
 * VIANEO Framework Configuration with Sub-Dimensions
 */
export const DIMENSIONS = [
  {
    id: 'legitimacy',
    name: 'Legitimacy',
    weight: 0.15,
    threshold: 3.0,
    question: 'Is the problem real and significant?',
    color: '#10B981',
    lightBg: '#D1FAE5',
    subDimensions: [
      { id: 'painIntensity', name: 'Pain Intensity', description: 'How acute is the problem?' },
      { id: 'marketSize', name: 'Market Size', description: 'Scale of affected population' },
      { id: 'evidenceQuality', name: 'Evidence Quality', description: 'Validation strength' }
    ]
  },
  {
    id: 'desirability',
    name: 'Desirability',
    weight: 0.25,
    threshold: 3.5,
    question: 'Do people want YOUR solution?',
    color: '#3B82F6',
    lightBg: '#DBEAFE',
    subDimensions: [
      { id: 'productMarketFit', name: 'Product-Market Fit', description: 'Solution resonance' },
      { id: 'differentiation', name: 'Differentiation', description: 'Unique value proposition' },
      { id: 'userDemand', name: 'User Demand', description: 'Pull from market' }
    ]
  },
  {
    id: 'acceptability',
    name: 'Acceptability',
    weight: 0.20,
    threshold: 3.0,
    question: 'Will the ecosystem support you?',
    color: '#8B5CF6',
    lightBg: '#EDE9FE',
    subDimensions: [
      { id: 'partnerReadiness', name: 'Partner Readiness', description: 'Ecosystem willingness' },
      { id: 'regulatory', name: 'Regulatory Fit', description: 'Legal/compliance alignment' },
      { id: 'stakeholderBuyIn', name: 'Stakeholder Buy-in', description: 'Key player support' }
    ]
  },
  {
    id: 'feasibility',
    name: 'Feasibility',
    weight: 0.20,
    threshold: 3.0,
    question: 'Can you actually deliver?',
    color: '#F59E0B',
    lightBg: '#FEF3C7',
    subDimensions: [
      { id: 'technicalCapability', name: 'Technical Capability', description: 'Can it be built?' },
      { id: 'teamCompetence', name: 'Team Competence', description: 'Skills match' },
      { id: 'resourceAvailability', name: 'Resource Availability', description: 'Access to needs' }
    ]
  },
  {
    id: 'viability',
    name: 'Viability',
    weight: 0.20,
    threshold: 3.0,
    question: 'Is the model sustainable?',
    color: '#EF4444',
    lightBg: '#FEE2E2',
    subDimensions: [
      { id: 'revenueClarity', name: 'Revenue Clarity', description: 'Monetization model' },
      { id: 'unitEconomics', name: 'Unit Economics', description: 'Profitability per unit' },
      { id: 'pathToProfitability', name: 'Path to Profitability', description: 'Sustainability roadmap' }
    ]
  }
];

/**
 * Get gate recommendation based on overall score
 */
export function getGateRecommendation(score) {
  if (score >= 90) return { label: 'GO', color: '#10B981', bg: '#D1FAE5', description: 'Strong pass. Proceed with investment.' };
  if (score >= 75) return { label: 'CONDITIONAL GO', color: '#F59E0B', bg: '#FEF3C7', description: 'Proceed with specific conditions to address.' };
  if (score >= 60) return { label: 'HOLD', color: '#F97316', bg: '#FFEDD5', description: 'Significant gaps. Needs more work.' };
  return { label: 'NO GO', color: '#EF4444', bg: '#FEE2E2', description: 'Fundamental issues prevent success.' };
}

/**
 * Express V2 System Prompt - Streamlined VIANEO Assessment
 */
export const EXPRESS_V2_SYSTEM_PROMPT = `You are an expert business analyst using the VIANEO Innovation Framework to evaluate startup/business ventures. Provide a COMPREHENSIVE, QUANTITATIVE assessment with deep cross-dimensional analysis.

## Business Information

You will receive information about a business venture including:
- Company name and tagline
- Problem statement
- Solution description
- Target market
- Business model
- Traction & validation
- Team composition
- Competition
- Additional context

## Your Task

Provide a DEEP, MULTI-LAYERED analysis using the VIANEO Framework. For each of the 5 dimensions, provide:

1. **Overall dimension score** (1.0-5.0, one decimal)
2. **Sub-dimension scores** (3 scores per dimension, each 1.0-5.0)
3. **Confidence score** (1-10) for your assessment
4. **Data quality score** (1-10) based on information provided
5. **Trend prediction** (improving/stable/declining)
6. **Strengths** (3-4 specific, evidence-based points)
7. **Risks** (3-4 specific, evidence-based points)
8. **Recommendations** (3-4 actionable, prioritized points)
9. **30/60/90 day projections** (what should happen in each timeframe)
10. **Key metrics** to track for this dimension
11. **Competitive positioning** (vs. market standards)
12. **Resource priorities** (2-3 specific resource needs for this dimension)

### The 5 Dimensions with Sub-Dimensions:

1. **LEGITIMACY (15% weight, threshold ≥3.0)**
   - Sub: Pain Intensity, Market Size, Evidence Quality

2. **DESIRABILITY (25% weight, threshold ≥3.5)**
   - Sub: Product-Market Fit, Differentiation, User Demand

3. **ACCEPTABILITY (20% weight, threshold ≥3.0)**
   - Sub: Partner Readiness, Regulatory Fit, Stakeholder Buy-in

4. **FEASIBILITY (20% weight, threshold ≥3.0)**
   - Sub: Technical Capability, Team Competence, Resource Availability

5. **VIABILITY (20% weight, threshold ≥3.0)**
   - Sub: Revenue Clarity, Unit Economics, Path to Profitability

## SCORING RUBRIC - Use Full Range (1.0 to 5.0)

You MUST use the FULL scoring range. Avoid clustering scores in the 3.0-4.0 "safe zone". Score based on EVIDENCE, not assumptions.

| Score Range | Meaning | Evidence Required |
|-------------|---------|-------------------|
| 1.0-1.9 | CRITICAL GAP - Missing fundamentals | No data, contradictions, red flags, fundamental flaws |
| 2.0-2.4 | SIGNIFICANT WEAKNESS - Major assumptions unvalidated | Anecdotal only, no market validation, wishful thinking |
| 2.5-2.9 | BELOW THRESHOLD - Notable gaps need resolution | Limited data, single data point, early assumptions |
| 3.0-3.4 | THRESHOLD MET - Functional but needs work | Some validation, early traction signals, reasonable basis |
| 3.5-3.9 | SOLID - Above average with minor gaps | Multiple validation points, early customers, credible plan |
| 4.0-4.4 | STRONG - Well-validated with clear evidence | Revenue data, testimonials, market proof, strong team |
| 4.5-4.9 | EXCELLENT - Exceptional with minimal gaps | Significant traction, proven model, competitive advantage |
| 5.0 | OUTSTANDING - Best-in-class, fully validated | Market leadership, exceptional metrics, undeniable proof |

### CALIBRATION: When to Score BELOW 3.0

- Pre-revenue startup with no paying customers → Viability: 2.0-2.5
- No user testing or customer validation → Desirability: 2.0-2.5
- Regulatory uncertainty in heavily regulated market → Acceptability: 2.0-2.5
- Solo founder, no technical co-founder for tech product → Feasibility: 2.0-2.5
- Problem statement based on founder intuition only → Legitimacy: 2.0-2.5
- No competitive differentiation identified → Desirability: 2.0-2.5
- Team lacks domain experience → Feasibility: 2.0-2.5

### CALIBRATION: When to Score ABOVE 4.5

- Proven PMF with 100K+ active users → Desirability: 4.5+
- $1M+ ARR with positive unit economics → Viability: 4.5+
- Strategic partnerships with industry leaders signed → Acceptability: 4.5+
- Team with multiple successful exits in domain → Feasibility: 4.5+
- Problem validated by extensive research + paying customers → Legitimacy: 4.5+
- Clear market leader in defined segment → Desirability: 4.5+
- Regulatory approval already obtained → Acceptability: 4.5+

## Evidence Tracking

For EACH dimension, categorize ALL claims using these tags:
- [VALIDATED]: Direct evidence provided (revenue numbers, customer data, signed contracts, pilot results)
- [INFERRED]: Reasonable inference from context (market size from industry reports, team capability from backgrounds)
- [ASSUMED]: No direct evidence, using industry norms or reasonable assumptions

**IMPORTANT**: Heavy reliance on [ASSUMED] evidence should REDUCE the dimension score by 0.5-1.0 points.

## Cross-Dimensional Analysis Required:

Analyze how dimensions interact:
- Which dimensions reinforce each other? (synergies)
- Which create tension? (tradeoffs)
- What are the critical dependencies?
- What's the bottleneck dimension?
- Create an interaction matrix showing impact scores (-10 to +10) between dimensions

## Required Output Format (STRICT JSON)

IMPORTANT: Replace ALL placeholder values (0.0, 0) with YOUR calculated scores based on the rubric above. All scores must be NUMERIC (not strings). Do NOT copy example values - calculate each score independently.

{
  "scores": {
    "legitimacy": 0.0,
    "desirability": 0.0,
    "acceptability": 0.0,
    "feasibility": 0.0,
    "viability": 0.0
  },
  "subScores": {
    "legitimacy": { "painIntensity": 0.0, "marketSize": 0.0, "evidenceQuality": 0.0 },
    "desirability": { "productMarketFit": 0.0, "differentiation": 0.0, "userDemand": 0.0 },
    "acceptability": { "partnerReadiness": 0.0, "regulatory": 0.0, "stakeholderBuyIn": 0.0 },
    "feasibility": { "technicalCapability": 0.0, "teamCompetence": 0.0, "resourceAvailability": 0.0 },
    "viability": { "revenueClarity": 0.0, "unitEconomics": 0.0, "pathToProfitability": 0.0 }
  },
  "evidenceBasis": {
    "legitimacy": { "validated": ["direct evidence item 1"], "inferred": ["inference 1"], "assumed": ["assumption 1"] },
    "desirability": { "validated": [], "inferred": [], "assumed": [] },
    "acceptability": { "validated": [], "inferred": [], "assumed": [] },
    "feasibility": { "validated": [], "inferred": [], "assumed": [] },
    "viability": { "validated": [], "inferred": [], "assumed": [] }
  },
  "confidence": { "legitimacy": 0, "desirability": 0, "acceptability": 0, "feasibility": 0, "viability": 0 },
  "dataQuality": { "legitimacy": 0, "desirability": 0, "acceptability": 0, "feasibility": 0, "viability": 0 },
  "trends": { "legitimacy": "stable", "desirability": "improving", "acceptability": "stable", "feasibility": "improving", "viability": "stable" },
  "analysis": {
    "legitimacy": {
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
      "risks": ["specific risk 1", "specific risk 2", "specific risk 3"],
      "recommendations": ["action 1", "action 2", "action 3"],
      "timeline": { "30day": "milestone", "60day": "milestone", "90day": "milestone" },
      "keyMetrics": ["metric 1", "metric 2", "metric 3"],
      "competitivePosition": "positioning statement",
      "resourcePriority": ["resource need 1", "resource need 2"]
    },
    "desirability": {
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
      "risks": ["specific risk 1", "specific risk 2", "specific risk 3"],
      "recommendations": ["action 1", "action 2", "action 3"],
      "timeline": { "30day": "milestone", "60day": "milestone", "90day": "milestone" },
      "keyMetrics": ["metric 1", "metric 2", "metric 3"],
      "competitivePosition": "positioning statement",
      "resourcePriority": ["resource need 1", "resource need 2"]
    },
    "acceptability": {
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
      "risks": ["specific risk 1", "specific risk 2", "specific risk 3"],
      "recommendations": ["action 1", "action 2", "action 3"],
      "timeline": { "30day": "milestone", "60day": "milestone", "90day": "milestone" },
      "keyMetrics": ["metric 1", "metric 2", "metric 3"],
      "competitivePosition": "positioning statement",
      "resourcePriority": ["resource need 1", "resource need 2"]
    },
    "feasibility": {
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
      "risks": ["specific risk 1", "specific risk 2", "specific risk 3"],
      "recommendations": ["action 1", "action 2", "action 3"],
      "timeline": { "30day": "milestone", "60day": "milestone", "90day": "milestone" },
      "keyMetrics": ["metric 1", "metric 2", "metric 3"],
      "competitivePosition": "positioning statement",
      "resourcePriority": ["resource need 1", "resource need 2"]
    },
    "viability": {
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
      "risks": ["specific risk 1", "specific risk 2", "specific risk 3"],
      "recommendations": ["action 1", "action 2", "action 3"],
      "timeline": { "30day": "milestone", "60day": "milestone", "90day": "milestone" },
      "keyMetrics": ["metric 1", "metric 2", "metric 3"],
      "competitivePosition": "positioning statement",
      "resourcePriority": ["resource need 1", "resource need 2"]
    }
  },
  "crossDimensionalAnalysis": {
    "synergies": ["synergy 1", "synergy 2"],
    "tradeoffs": ["tradeoff 1", "tradeoff 2"],
    "criticalDependencies": ["dependency 1", "dependency 2"],
    "bottleneck": {
      "dimension": "dimension_id",
      "reason": "explanation",
      "impact": "impact statement"
    },
    "interactionMatrix": {
      "legitimacy": { "desirability": 0, "acceptability": 0, "feasibility": 0, "viability": 0 },
      "desirability": { "legitimacy": 0, "acceptability": 0, "feasibility": 0, "viability": 0 },
      "acceptability": { "legitimacy": 0, "desirability": 0, "feasibility": 0, "viability": 0 },
      "feasibility": { "legitimacy": 0, "desirability": 0, "acceptability": 0, "viability": 0 },
      "viability": { "legitimacy": 0, "desirability": 0, "acceptability": 0, "feasibility": 0 }
    }
  },
  "executiveSummary": "2-3 sentence overview",
  "topStrengths": ["strength 1", "strength 2", "strength 3"],
  "criticalRisks": ["risk 1", "risk 2", "risk 3"],
  "immediateActions": ["action 1", "action 2", "action 3"],
  "resourcePriority": ["priority 1", "priority 2", "priority 3"]
}

IMPORTANT: Response must be valid JSON only. No markdown, no explanations before or after.`;

/**
 * Express V2 User Prompt Template
 */
export const EXPRESS_V2_USER_PROMPT_TEMPLATE = `You are executing the VIANEO Framework in Express Assessment Mode.

## Business Information

**Company Name:** {COMPANY_NAME}
**Tagline:** {TAGLINE}

**Problem Statement:**
{PROBLEM}

**Solution:**
{SOLUTION}

**Target Market:**
{TARGET_MARKET}

**Business Model:**
{BUSINESS_MODEL}

**Traction & Validation:**
{TRACTION}

**Team:**
{TEAM}

**Competition:**
{COMPETITION}

**Additional Context:**
{ADDITIONAL_CONTEXT}

## Instructions

Provide a DEEP, MULTI-LAYERED analysis using the VIANEO Framework. For each of the 5 dimensions, provide:

1. Overall dimension score (1.0-5.0, one decimal)
2. Sub-dimension scores (3 scores per dimension, each 1.0-5.0)
3. Confidence score (1-10) for your assessment
4. Data quality score (1-10) based on information provided
5. Trend prediction (improving/stable/declining)
6. Strengths (3-4 specific, evidence-based points)
7. Risks (3-4 specific, evidence-based points)
8. Recommendations (3-4 actionable, prioritized points)
9. 30/60/90 day projections
10. Key metrics to track for this dimension
11. Competitive positioning

## CRITICAL: Evidence Tracking Required

For EACH dimension, you MUST categorize ALL claims in the evidenceBasis object:
- **validated**: Direct evidence provided (revenue numbers, customer data, signed contracts, pilot results)
- **inferred**: Reasonable inference from context (market size from industry reports, team capability from backgrounds)
- **assumed**: No direct evidence, using industry norms or reasonable assumptions

**SCORING IMPACT**: Heavy reliance on [ASSUMED] evidence MUST reduce the dimension score by 0.5-1.0 points.

## CRITICAL: Use Full Score Range

- Scores BELOW 3.0: Pre-revenue, no validation, regulatory uncertainty, solo founder, founder intuition only
- Scores ABOVE 4.5: 100K+ users, $1M+ ARR, signed partnerships, multiple exits, extensive market research

Additionally, provide:
- Cross-dimensional analysis (synergies, tradeoffs, dependencies, bottleneck)
- Interaction matrix showing how dimensions influence each other
- Executive summary
- Top strengths, critical risks, immediate actions
- Resource priorities (3-4 prioritized areas where resources should be allocated)

Return ONLY valid JSON matching the schema. All scores must be NUMERIC values (not strings). Be rigorous - if evidence is missing, score lower and note it. Do NOT inflate scores based on assumptions.`;

/**
 * Get Express V2 prompts with dynamic values injected
 */
export function getExpressV2Prompts(formData) {
  const userPrompt = EXPRESS_V2_USER_PROMPT_TEMPLATE
    .replace('{COMPANY_NAME}', formData.companyName || 'Unnamed Company')
    .replace('{TAGLINE}', formData.tagline || 'Not provided')
    .replace('{PROBLEM}', formData.problem || 'Not provided')
    .replace('{SOLUTION}', formData.solution || 'Not provided')
    .replace('{TARGET_MARKET}', formData.targetMarket || 'Not provided')
    .replace('{BUSINESS_MODEL}', formData.businessModel || 'Not provided')
    .replace('{TRACTION}', formData.traction || 'Not provided')
    .replace('{TEAM}', formData.team || 'Not provided')
    .replace('{COMPETITION}', formData.competition || 'Not provided')
    .replace('{ADDITIONAL_CONTEXT}', formData.additionalContext || 'Not provided');

  return {
    systemPrompt: EXPRESS_V2_SYSTEM_PROMPT,
    userPrompt
  };
}

/**
 * Helper to coerce a value to a number (handles string numbers from LLM)
 * @param {any} value - Value to coerce
 * @returns {number|null} Numeric value or null if not coercible
 */
function coerceToNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Extract number from strings like "3.5" or "3.5 (your score)"
    const match = value.match(/^(\d+\.?\d*)/);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

/**
 * Validate Express V2 assessment output
 */
export function validateExpressV2Assessment(data) {
  const errors = [];
  const warnings = [];

  // Check required top-level sections
  const requiredSections = [
    'scores',
    'subScores',
    'evidenceBasis',
    'confidence',
    'dataQuality',
    'trends',
    'analysis',
    'crossDimensionalAnalysis',
    'executiveSummary',
    'topStrengths',
    'criticalRisks',
    'immediateActions',
    'resourcePriority'
  ];

  for (const section of requiredSections) {
    if (!data[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  }

  // Validate evidence basis structure
  if (data.evidenceBasis) {
    for (const dim of DIMENSIONS) {
      const evidence = data.evidenceBasis[dim.id];
      if (!evidence) {
        warnings.push(`Missing evidence basis for ${dim.name}`);
        continue;
      }
      // Check for required evidence categories
      const requiredCategories = ['validated', 'inferred', 'assumed'];
      for (const category of requiredCategories) {
        if (!Array.isArray(evidence[category])) {
          warnings.push(`${dim.name} evidence basis missing ${category} array`);
        }
      }
      // Warn if heavy reliance on assumptions
      if (Array.isArray(evidence.assumed) && Array.isArray(evidence.validated)) {
        const assumedCount = evidence.assumed.length;
        const validatedCount = evidence.validated.length;
        if (assumedCount > 3 && validatedCount === 0) {
          warnings.push(`${dim.name} relies heavily on assumptions with no validated evidence`);
        }
      }
    }
  }

  // Validate dimension scores are in range (1-5)
  if (data.scores) {
    for (const dim of DIMENSIONS) {
      const rawScore = data.scores[dim.id];
      const score = coerceToNumber(rawScore);
      if (score === null || score < 1 || score > 5) {
        errors.push(`${dim.name} score out of range or invalid: ${rawScore}`);
      } else {
        // Coerce the score in place for downstream use
        data.scores[dim.id] = score;
      }
    }
  }

  // Validate sub-scores
  if (data.subScores) {
    for (const dim of DIMENSIONS) {
      const subScores = data.subScores[dim.id];
      if (!subScores) {
        errors.push(`Missing sub-scores for ${dim.name}`);
        continue;
      }
      for (const subDim of dim.subDimensions) {
        const rawScore = subScores[subDim.id];
        const score = coerceToNumber(rawScore);
        if (score === null || score < 1 || score > 5) {
          warnings.push(`${dim.name}.${subDim.name} score out of range or invalid: ${rawScore}`);
        } else {
          // Coerce the score in place for downstream use
          subScores[subDim.id] = score;
        }
      }
    }
  }

  // Validate confidence scores are in range (1-10)
  if (data.confidence) {
    for (const dim of DIMENSIONS) {
      const rawValue = data.confidence[dim.id];
      const value = coerceToNumber(rawValue);
      if (value === null || value < 1 || value > 10) {
        warnings.push(`${dim.name} confidence out of range (1-10): ${rawValue}`);
      } else {
        data.confidence[dim.id] = value;
      }
    }
  }

  // Validate data quality scores are in range (1-10)
  if (data.dataQuality) {
    for (const dim of DIMENSIONS) {
      const rawValue = data.dataQuality[dim.id];
      const value = coerceToNumber(rawValue);
      if (value === null || value < 1 || value > 10) {
        warnings.push(`${dim.name} dataQuality out of range (1-10): ${rawValue}`);
      } else {
        data.dataQuality[dim.id] = value;
      }
    }
  }

  // Validate trends have valid values
  if (data.trends) {
    const validTrends = ['improving', 'stable', 'declining'];
    for (const dim of DIMENSIONS) {
      const trend = data.trends[dim.id];
      if (!validTrends.includes(trend)) {
        warnings.push(`${dim.name} trend invalid (must be improving/stable/declining): ${trend}`);
      }
    }
  }

  // Validate analysis structure for each dimension
  if (data.analysis) {
    const requiredAnalysisFields = ['strengths', 'risks', 'recommendations'];
    for (const dim of DIMENSIONS) {
      const analysis = data.analysis[dim.id];
      if (!analysis) {
        warnings.push(`Missing analysis for ${dim.name}`);
        continue;
      }
      for (const field of requiredAnalysisFields) {
        if (!Array.isArray(analysis[field]) || analysis[field].length === 0) {
          warnings.push(`${dim.name} analysis missing or empty: ${field}`);
        }
      }
    }
  }

  // Validate threshold compliance
  if (data.scores) {
    for (const dim of DIMENSIONS) {
      const score = data.scores[dim.id];
      if (typeof score === 'number' && score < dim.threshold) {
        warnings.push(`${dim.name} score ${score.toFixed(1)} is below threshold ${dim.threshold}`);
      }
    }
  }

  // Check for score clustering (anti-pattern from original audit)
  if (data.scores) {
    const scores = DIMENSIONS.map(dim => data.scores[dim.id]).filter(s => typeof s === 'number');
    if (scores.length === 5) {
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      const range = max - min;
      if (range < 0.5 && min >= 3.0 && max <= 4.0) {
        warnings.push(`Score clustering detected: all scores between ${min.toFixed(1)}-${max.toFixed(1)}. Consider if differentiation is appropriate.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculate overall score from dimension scores
 */
export function calculateOverallScore(scores) {
  if (!scores) return 0;

  const weightedScore = DIMENSIONS.reduce((sum, dim) => {
    return sum + (scores[dim.id] || 0) * dim.weight;
  }, 0);

  // Convert to 0-100 scale
  return (weightedScore / 5) * 100;
}
