// ============================================
// Express Assessment Mode - Comprehensive Prompt
// Synthesizes all 13 VIANEO Framework steps
// ============================================

import { injectDynamicValues } from './prompts/index.js';

/**
 * Express Mode System Prompt
 * Generates a comprehensive 360 Business Validation Report in a single execution
 */
export const EXPRESS_MODE_SYSTEM_PROMPT = `You are executing the VIANEO Framework in Express Assessment Mode.

Generate a comprehensive 360 Business Validation Report covering all 13 steps in a single cohesive analysis. This report is designed for board presentations and investment committees.

## FRAMEWORK OVERVIEW

The VIANEO Framework assesses ventures across 5 weighted dimensions:
- **Legitimacy (15%)**: Is there a real problem worth solving? (Threshold: ≥3.0)
- **Desirability (25%)**: Do specific people want YOUR solution? (Threshold: ≥3.5) ⭐ HIGHEST BAR
- **Acceptability (20%)**: Will the ecosystem support you? (Threshold: ≥3.0)
- **Feasibility (20%)**: Can you actually deliver? (Threshold: ≥3.0)
- **Viability (20%)**: Is the business model sustainable? (Threshold: ≥3.0)

Overall Threshold: ≥3.2 (weighted average)

## OUTPUT STRUCTURE

Generate a structured JSON response with the following format. IMPORTANT: Output ONLY valid JSON, no markdown or other formatting.

{
  "metadata": {
    "projectName": "string",
    "assessmentDate": "string",
    "assessor": "VIANEO Sprint Automator - Express Mode",
    "documentId": "string"
  },

  "executiveSummary": {
    "recommendation": "GO|CONDITIONAL_GO|HOLD|NO_GO",
    "confidenceLevel": "HIGH|MEDIUM|LOW",
    "investmentReadinessScore": number (0-100),
    "recommendationBadge": {
      "color": "#10B981|#F59E0B|#F97316|#EF4444",
      "label": "string"
    },
    "keyStrengths": ["string (max 5 items)"],
    "criticalRisks": ["string (max 5 items)"],
    "synthesisNarrative": "string (200-300 words)"
  },

  "companyOverview": {
    "b1_overview": {
      "text": "string (max 150 chars)",
      "companyName": "string",
      "founded": "string",
      "location": "string",
      "legalStructure": "string",
      "teamSize": "number"
    },
    "b2_problem": {
      "text": "string (max 300 chars, solution-neutral)",
      "evidenceBasis": "VALIDATED|ASSUMED"
    },
    "b3_solution": {
      "text": "string (max 300 chars)",
      "technicalApproach": ["string (3 items)"],
      "evidenceBasis": "VALIDATED|ASSUMED"
    },
    "b4_market": {
      "primaryUsers": "string (max 150 chars)",
      "primaryBuyers": "string (max 150 chars)",
      "segments": [{"name": "string", "size": "string", "characteristics": "string"}],
      "evidenceBasis": "VALIDATED|ASSUMED"
    },
    "b5_businessModel": {
      "text": "string (max 300 chars)",
      "pricing": "string",
      "unitEconomics": "string",
      "evidenceBasis": "VALIDATED|ASSUMED"
    },
    "b6_traction": {
      "text": "string (max 300 chars)",
      "metrics": {
        "customerInterviews": number,
        "payingCustomers": number,
        "pilots": number,
        "revenue": "string",
        "lois": number
      },
      "developmentStage": "CONCEPT|PROTOTYPE|MVP|BETA|PRODUCTION",
      "evidenceBasis": "VALIDATED|ASSUMED"
    },
    "b7_team": {
      "text": "string (max 200 chars)",
      "members": [{"name": "string", "role": "string", "experience": "string", "commitment": "FULL_TIME|PART_TIME"}]
    },
    "maturityStage": "IDEA|PROOF|PROMISING|LAUNCH|GROWTH",
    "trlLevel": number (1-9),
    "trlJustification": "string"
  },

  "diagnosticAssessment": {
    "team": {
      "score": number (1-5, one decimal),
      "status": "STRONG|ADEQUATE|CONCERN|CRITICAL",
      "keyStrength": "string",
      "keyGap": "string",
      "questions": [
        {"id": "T1", "question": "string", "score": number (1-5), "evidence": "string", "redFlag": boolean},
        // ... T1-T9
      ]
    },
    "technology": {
      "score": number,
      "status": "string",
      "keyStrength": "string",
      "keyGap": "string",
      "questions": [
        {"id": "Tech1", "question": "string", "score": number, "evidence": "string", "redFlag": boolean}
        // ... Tech1-Tech11
      ]
    },
    "management": {
      "score": number,
      "status": "string",
      "keyStrength": "string",
      "keyGap": "string",
      "questions": [
        {"id": "M1", "question": "string", "score": number, "evidence": "string", "redFlag": boolean}
        // ... M1-M12
      ]
    },
    "commercial": {
      "score": number,
      "status": "string",
      "keyStrength": "string",
      "keyGap": "string",
      "questions": [
        {"id": "C1", "question": "string", "score": number, "evidence": "string", "redFlag": boolean}
        // ... C1-C8
      ]
    },
    "overallScore": number,
    "overallStatus": "string",
    "totalRedFlags": number,
    "questionsForFounders": [{"priority": "HIGH|MEDIUM", "question": "string", "rationale": "string"}]
  },

  "marketMaturity": {
    "legitimacy": {
      "score": number,
      "weight": 0.15,
      "threshold": 3.0,
      "meetsThreshold": boolean,
      "questions": [{"id": "L1", "question": "string", "score": number, "evidence": "string"}]
    },
    "desirability": {
      "score": number,
      "weight": 0.25,
      "threshold": 3.5,
      "meetsThreshold": boolean,
      "questions": [{"id": "D1", "question": "string", "score": number, "evidence": "string"}]
    },
    "acceptability": {
      "score": number,
      "weight": 0.20,
      "threshold": 3.0,
      "meetsThreshold": boolean,
      "questions": [{"id": "A1", "question": "string", "score": number, "evidence": "string"}]
    },
    "feasibility": {
      "score": number,
      "weight": 0.20,
      "threshold": 3.0,
      "meetsThreshold": boolean,
      "questions": [{"id": "F1", "question": "string", "score": number, "evidence": "string"}]
    },
    "viability": {
      "score": number,
      "weight": 0.20,
      "threshold": 3.0,
      "meetsThreshold": boolean,
      "questions": [{"id": "V1", "question": "string", "score": number, "evidence": "string"}]
    },
    "weightedOverall": number,
    "decision": "GO|MAYBE|NO",
    "decisionRationale": "string"
  },

  "legitimacyWorksheet": {
    "projectGenesis": "string (max 250 chars)",
    "problemToSolve": "string (max 250 chars)",
    "fieldOfApplication": "string (max 60 chars)",
    "humanResources": [{"role": "string", "name": "string", "experience": "string", "years": number, "differentiator": boolean}],
    "physicalIpResources": [{"type": "string", "description": "string", "status": "string", "differentiator": "string"}],
    "financialResources": [{"source": "string", "amount": "string", "status": "string", "timeline": "string"}],
    "competitiveAdvantages": "string (max 250 chars)",
    "legitimacyScore": number,
    "strengths": [{"item": "string", "evidence": "string"}],
    "gaps": [{"item": "string", "impact": "string", "priority": "HIGH|MEDIUM|LOW"}],
    "keyRisks": [{"risk": "string", "likelihood": "string", "impact": "string", "mitigation": "string"}]
  },

  "needsAnalysis": {
    "fieldOfApplication": "string (max 60 chars)",
    "requesters": [
      {
        "id": "R1",
        "role": "string (3-6 words)",
        "type": "USER|BUYER|BOTH",
        "description": "string (2-4 sentences)",
        "interviewCount": number,
        "reliability": "VALIDATED|PARTIAL|UNVALIDATED"
      }
    ],
    "needs": [
      {
        "id": "N1",
        "statement": "string (max 60 chars)",
        "category": "TASK|PAIN|EXPECTATION",
        "evidence": "VALIDATED|ASSUMED"
      }
    ],
    "existingSolutions": [
      {
        "id": "S1",
        "name": "string",
        "description": "string",
        "limitations": "string"
      }
    ],
    "totalInterviews": number,
    "validatedRequesters": number,
    "desirabilityAssessment": "STRONG|MODERATE|WEAK|CRITICAL"
  },

  "personas": [
    {
      "name": "string (first name only)",
      "age": number,
      "role": "string",
      "type": "USER|BUYER|BOTH",
      "sourceRequesters": ["R1", "R2"],
      "interviewCount": number,
      "validationBadge": "VALIDATED|PARTIAL|NEEDS_VALIDATION",
      "validationScore": number (1-5),
      "lifeMotivations": "string (2-3 sentences)",
      "personalityValues": "string (2-3 sentences)",
      "thinksFeels": "string",
      "seesObserves": "string",
      "saysDoes": "string",
      "hears": "string",
      "tasks": ["string (max 60 chars each)"],
      "pains": ["string (max 60 chars each)"],
      "expectations": ["string (max 60 chars each)"],
      "currentSolutions": "string"
    }
  ],

  "needsMatrix": {
    "matrix": [
      {
        "needId": "N1",
        "needStatement": "string",
        "requesterRatings": [
          {"requesterId": "R1", "importance": "F|I|S|N|?", "satisfaction": "VW|P|RN|NA|?"}
        ]
      }
    ],
    "tier1Opportunities": [{"needId": "string", "requesters": ["string"], "description": "string"}],
    "tier2Opportunities": [{"needId": "string", "requesters": ["string"], "description": "string"}],
    "tier3ResearchGaps": [{"needId": "string", "requesters": ["string"], "validationRequired": "string"}],
    "topOpportunities": [{"rank": number, "need": "string", "segment": "string", "gap": "string", "advantage": "string"}]
  },

  "playersInfluencers": {
    "players": [
      {
        "id": "P1",
        "name": "string (max 60 chars)",
        "type": "CUSTOMER|COMPETITOR|SUPPLIER|PARTNER|CHANNEL",
        "rating": "FAVORABLE|NEUTRAL|UNFAVORABLE",
        "strategicNote": "string (max 250 chars)"
      }
    ],
    "influencers": [
      {
        "id": "I1",
        "name": "string",
        "type": "REGULATOR|ASSOCIATION|STANDARDS|MEDIA|NGO",
        "rating": "FAVORABLE|NEUTRAL|UNFAVORABLE",
        "strategicNote": "string"
      }
    ],
    "acceptabilityScore": number,
    "overallAssessment": "FAVORABLE|MIXED|CHALLENGING|HOSTILE",
    "engagementPriorities": [{"entity": "string", "current": "string", "target": "string", "action": "string"}],
    "mitigationStrategies": [{"entity": "string", "threatLevel": "string", "reason": "string", "strategy": "string"}]
  },

  "valueNetwork": {
    "enablers": [{"entity": "string", "type": "string", "acceptability": "string", "valueProvided": "string"}],
    "coreProduct": {"organization": "string", "solution": "string", "differentiator": "string"},
    "channels": [{"entity": "string", "type": "string", "acceptability": "string", "valueExchange": "string", "priority": "string"}],
    "buyers": [{"entity": "string", "type": "string", "acceptability": "string", "requesterRoles": ["string"], "needLevel": "string"}],
    "endUsers": [{"entity": "string", "type": "string", "acceptability": "string", "requesterRoles": ["string"], "primaryNeed": "string"}],
    "valueFlows": [{"from": "string", "flowType": "string", "to": "string", "description": "string"}],
    "priorityTargets": [{"entity": "string", "column": number, "acceptability": "string", "needLevel": "string", "reason": "string"}],
    "networkStrengths": [{"dynamic": "string", "entities": ["string"], "value": "string"}],
    "networkGaps": [{"gap": "string", "impact": "string", "mitigation": "string"}]
  },

  "diagnosticComment": {
    "strengthsSummary": "string (1-2 sentences)",
    "risksSummary": "string (1-2 sentences)",
    "nearTermActions": "string (2-3 sentences)",
    "evidenceGaps": "string (1-2 sentences)",
    "dimensionScores": {
      "legitimacy": {"score": number, "source": "string"},
      "desirability": {"score": number, "source": "string"},
      "acceptability": {"score": number, "source": "string"},
      "feasibility": {"score": number, "source": "string"},
      "viability": {"score": number, "source": "string"},
      "overall": number
    },
    "detailedStrengths": [{"item": "string", "evidence": "string", "sourceStep": number}],
    "detailedRisks": [{"risk": "string", "impact": "string", "likelihood": "string", "sourceStep": number}],
    "immediateRecommendations": [{"action": "string", "owner": "string", "deliverable": "string", "metric": "string"}],
    "shortTermRecommendations": [{"milestone": "string", "owner": "string", "dependencies": "string", "criteria": "string"}],
    "keyAssumptions": [{"item": "string", "whyMatters": "string", "validationMethod": "string"}]
  },

  "featuresNeedsMatrix": {
    "needsClassification": [{"id": "string", "statement": "string", "category": "string", "priority": "HIGH|MEDIUM|EXPECTED|LOW|ACCESSORY", "coverageTarget": "string"}],
    "features": [{"id": "string", "name": "string", "description": "string", "status": "EXISTING|NEW", "mvp": boolean}],
    "coverageMatrix": [
      {"featureId": "string", "addressedNeeds": ["N1", "N2"], "coverageCount": number}
    ],
    "coverageByPriority": {
      "high": {"total": number, "covered": number, "percentage": number, "targetMet": boolean},
      "medium": {"total": number, "covered": number, "percentage": number, "targetMet": boolean},
      "expected": {"total": number, "covered": number, "percentage": number, "targetMet": boolean}
    },
    "uncoveredNeeds": [{"needId": "string", "priority": "string", "gapReason": "string", "mitigation": "string"}],
    "mvpFeatures": [{"feature": "string", "needsAddressed": ["string"], "feasibility": "string"}],
    "deferredFeatures": [{"feature": "string", "needsAddressed": ["string"], "deferralReason": "string", "phase": "string"}],
    "roadmap": {
      "phase1": [{"feature": "string", "effort": "S|M|L", "dependencies": "string"}],
      "phase2": [{"feature": "string", "effort": "string", "dependencies": "string"}],
      "phase3": [{"feature": "string", "effort": "string", "dependencies": "string"}]
    }
  },

  "viabilityAssessment": {
    "projectOverview": "string (max 250 chars)",
    "gateRecommendation": "GO|CONDITIONAL_GO|HOLD|NO_GO",
    "confidenceLevel": "HIGH|MEDIUM|LOW",
    "keyFactor": "string",
    "vianeoScores": {
      "legitimacy": {"score": number, "threshold": 3.0, "meetsThreshold": boolean},
      "desirability": {"score": number, "threshold": 3.5, "meetsThreshold": boolean},
      "acceptability": {"score": number, "threshold": 3.0, "meetsThreshold": boolean},
      "feasibility": {"score": number, "threshold": 3.0, "meetsThreshold": boolean},
      "viability": {"score": number, "threshold": 3.0, "meetsThreshold": boolean},
      "overall": number,
      "meetsOverallThreshold": boolean
    },
    "strengthsByTheme": {
      "teamCapabilities": [{"strength": "string", "evidence": "string"}],
      "marketValidation": [{"strength": "string", "evidence": "string"}],
      "technologyProduct": [{"strength": "string", "evidence": "string"}],
      "businessModel": [{"strength": "string", "evidence": "string"}]
    },
    "riskRegister": [
      {"id": number, "risk": "string", "impact": "HIGH|MEDIUM|LOW", "likelihood": "HIGH|MEDIUM|LOW", "mitigation": "string"}
    ],
    "conditions": [{"condition": "string", "whyRequired": "string", "timeline": "string", "owner": "string"}],
    "ninetyDayRoadmap": {
      "days1to30": [{"action": "string", "owner": "string", "deliverable": "string", "metric": "string"}],
      "days31to60": [{"milestone": "string", "owner": "string", "dependencies": "string", "criteria": "string"}],
      "days61to90": [{"objective": "string", "owner": "string", "investment": "string", "outcome": "string"}]
    },
    "kpis": [{"name": "string", "current": "string", "target30Day": "string", "target90Day": "string"}],
    "reassessmentTriggers": {
      "positive": "string",
      "negative": "string",
      "market": "string"
    },
    "finalRationale": "string (3-4 sentences)"
  },

  "chartData": {
    "diagnosticScorecard": {
      "labels": ["Team", "Technology", "Management", "Commercial"],
      "values": [number, number, number, number],
      "colors": ["#0A2540", "#0D5A66", "#1E6B4F", "#7C3AED"]
    },
    "vianeoRadar": {
      "labels": ["Legitimacy", "Desirability", "Acceptability", "Feasibility", "Viability"],
      "values": [number, number, number, number, number],
      "thresholds": [3.0, 3.5, 3.0, 3.0, 3.0]
    },
    "needsMatrix": [
      {"name": "string (need)", "value": number (1-5), "ease": number (1-5)}
    ],
    "investmentReadinessGauge": {
      "score": number (0-100),
      "zones": [
        {"min": 0, "max": 59, "color": "#EF4444", "label": "Decline"},
        {"min": 60, "max": 74, "color": "#F97316", "label": "Needs Work"},
        {"min": 75, "max": 89, "color": "#F59E0B", "label": "Conditional"},
        {"min": 90, "max": 100, "color": "#10B981", "label": "Strong Pass"}
      ]
    }
  },

  "appendices": {
    "evidenceQualityAssessment": {
      "validatedClaims": number,
      "assumedClaims": number,
      "unvalidatedClaims": number,
      "overallQuality": "HIGH|MEDIUM|LOW"
    },
    "redFlagsRegister": [{"flag": "string", "severity": "CRITICAL|HIGH|MEDIUM", "details": "string", "sourceStep": number}],
    "methodologyNotes": "string"
  }
}

## CRITICAL REQUIREMENTS

1. **COMPLETE ALL SECTIONS**: Every section must be fully populated. Do not skip or abbreviate.

2. **CHARACTER LIMITS ARE NON-NEGOTIABLE**:
   - B1 Overview: 150 chars max
   - B2 Problem: 300 chars max (MUST be solution-neutral)
   - B3 Solution: 300 chars max
   - B4 Users/Buyers: 150 chars each
   - B5 Business Model: 300 chars max
   - B6 Traction: 300 chars max
   - B7 Team: 200 chars max
   - Need statements: 60 chars max each
   - Field of application: 60 chars max
   - Entity names: 60 chars max
   - Strategic notes: 250 chars max
   - Project overview: 250 chars max

3. **EVIDENCE MARKERS**: All claims MUST be marked:
   - VALIDATED: Direct evidence from primary sources
   - ASSUMED: Reasonable assumption without direct evidence
   - UNVALIDATED: Claim made without supporting evidence

4. **SCORING DISCIPLINE**:
   - All dimension scores: 1-5 scale (one decimal place)
   - Calculate weighted averages correctly
   - Investment Readiness Score: 0-100 based on weighted criteria:
     * ≥90: STRONG PASS (GO)
     * 75-89: CONDITIONAL PASS (CONDITIONAL_GO)
     * 60-74: NEEDS WORK (HOLD)
     * <60: DECLINE (NO_GO)

5. **40Q DIAGNOSTIC**: Assess ALL 40 questions:
   - Team (T1-T9): 9 questions
   - Technology (Tech1-Tech11): 11 questions
   - Management (M1-M12): 12 questions
   - Commercial (C1-C8): 8 questions

6. **29Q MARKET MATURITY**: Assess ALL 29 questions across 5 dimensions

7. **CONSISTENCY**: Scores and findings must be internally consistent across all sections

8. **RED FLAGS**: Any score of 1 = CRITICAL red flag (must document)

9. **JSON VALIDITY**: Output MUST be valid JSON. No trailing commas, proper escaping of quotes.

10. **DESIRABILITY IS HIGHEST BAR**: 25% weight, threshold ≥3.5. Be especially rigorous.`;

/**
 * Express Mode User Prompt Template
 */
export const EXPRESS_MODE_USER_PROMPT_TEMPLATE = `Generate a comprehensive 360 Business Validation Report in Express Assessment Mode.

## PROJECT INFORMATION

**Project Name**: {PROJECT_NAME}

## SOURCE MATERIALS

{SOURCE_MATERIALS}

## INSTRUCTIONS

Execute the complete VIANEO Framework assessment covering all 13 steps:

**PHASE 1 - FOUNDATION:**
- Step 0: Executive Brief (B1-B7, maturity stage, TRL)
- Step 2: 40Q Diagnostic (Team T1-T9, Tech1-Tech11, Management M1-M12, Commercial C1-C8)
- Step 3: 29Q Market Maturity (Legitimacy, Desirability, Acceptability, Feasibility, Viability)

**PHASE 2 - DEEP DIVE:**
- Step 4: Legitimacy Worksheet (problem validation, means inventory)
- Step 5: Needs & Requesters (WHO/WHAT/WHY/HOW)
- Step 6: Personas (evidence-based, from requesters)
- Step 7: Needs Qualification Matrix (priority quadrants)
- Step 8: Players & Influencers (ecosystem acceptability)
- Step 9: Value Network (5-column mapping)

**PHASE 3 - SYNTHESIS:**
- Step 10: Diagnostic Comment (executive synthesis)
- Step 11: Features-Needs Matrix (MVP scope, coverage analysis)

**PHASE 4 - VIABILITY:**
- Step 12: Final Viability Assessment (gate decision, investment readiness)

## OUTPUT REQUIREMENTS

1. Return ONLY valid JSON matching the schema in your instructions
2. Complete ALL sections - no abbreviated or partial responses
3. Enforce ALL character limits strictly
4. Mark ALL claims with evidence status
5. Calculate ALL scores accurately
6. Provide chart data for visualization
7. Be rigorous - if evidence is missing, score lower and note it
8. Do NOT inflate scores based on assumptions

Generate the complete assessment now.`;

/**
 * Get Express Mode prompts with dynamic values injected
 */
export function getExpressModePrompts(projectName, sourceContent) {
  const systemPrompt = injectDynamicValues(EXPRESS_MODE_SYSTEM_PROMPT);

  const userPrompt = EXPRESS_MODE_USER_PROMPT_TEMPLATE
    .replace('{PROJECT_NAME}', projectName || 'Unnamed Project')
    .replace('{SOURCE_MATERIALS}', sourceContent || 'No source materials provided');

  return {
    systemPrompt,
    userPrompt
  };
}

/**
 * Validate Express Mode assessment output
 */
export function validateExpressAssessment(data) {
  const errors = [];
  const warnings = [];

  // Check required top-level sections
  const requiredSections = [
    'metadata',
    'executiveSummary',
    'companyOverview',
    'diagnosticAssessment',
    'marketMaturity',
    'legitimacyWorksheet',
    'needsAnalysis',
    'personas',
    'needsMatrix',
    'playersInfluencers',
    'valueNetwork',
    'diagnosticComment',
    'featuresNeedsMatrix',
    'viabilityAssessment',
    'chartData'
  ];

  for (const section of requiredSections) {
    if (!data[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  }

  // Validate character limits
  if (data.companyOverview) {
    const co = data.companyOverview;
    if (co.b1_overview?.text?.length > 150) {
      warnings.push(`B1 Overview exceeds 150 chars (${co.b1_overview.text.length})`);
    }
    if (co.b2_problem?.text?.length > 300) {
      warnings.push(`B2 Problem exceeds 300 chars (${co.b2_problem.text.length})`);
    }
    if (co.b3_solution?.text?.length > 300) {
      warnings.push(`B3 Solution exceeds 300 chars (${co.b3_solution.text.length})`);
    }
    if (co.b7_team?.text?.length > 200) {
      warnings.push(`B7 Team exceeds 200 chars (${co.b7_team.text.length})`);
    }
  }

  // Validate scores are in range
  if (data.diagnosticAssessment) {
    const da = data.diagnosticAssessment;
    for (const dim of ['team', 'technology', 'management', 'commercial']) {
      if (da[dim]?.score && (da[dim].score < 1 || da[dim].score > 5)) {
        errors.push(`${dim} score out of range: ${da[dim].score}`);
      }
    }
  }

  // Validate market maturity thresholds
  if (data.marketMaturity) {
    const mm = data.marketMaturity;
    if (mm.desirability?.score < 3.5 && mm.desirability?.meetsThreshold) {
      warnings.push('Desirability marked as meeting threshold but score < 3.5');
    }
    if (mm.weightedOverall && (mm.weightedOverall < 1 || mm.weightedOverall > 5)) {
      errors.push(`Weighted overall score out of range: ${mm.weightedOverall}`);
    }
  }

  // Validate investment readiness score
  if (data.executiveSummary?.investmentReadinessScore) {
    const irs = data.executiveSummary.investmentReadinessScore;
    if (irs < 0 || irs > 100) {
      errors.push(`Investment readiness score out of range: ${irs}`);
    }
  }

  // Validate needs have 60 char limit
  if (data.needsAnalysis?.needs) {
    for (const need of data.needsAnalysis.needs) {
      if (need.statement?.length > 60) {
        warnings.push(`Need ${need.id} exceeds 60 chars: ${need.statement.length}`);
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
 * Calculate investment readiness score from assessment data
 */
export function calculateInvestmentReadinessScore(data) {
  if (!data.marketMaturity) return 0;

  const mm = data.marketMaturity;
  const scores = {
    legitimacy: mm.legitimacy?.score || 0,
    desirability: mm.desirability?.score || 0,
    acceptability: mm.acceptability?.score || 0,
    feasibility: mm.feasibility?.score || 0,
    viability: mm.viability?.score || 0
  };

  // Weighted average (out of 5)
  const weightedScore =
    (scores.legitimacy * 0.15) +
    (scores.desirability * 0.25) +
    (scores.acceptability * 0.20) +
    (scores.feasibility * 0.20) +
    (scores.viability * 0.20);

  // Convert to 0-100 scale
  return Math.round((weightedScore / 5) * 100);
}

/**
 * Get recommendation based on investment readiness score
 */
export function getRecommendation(score) {
  if (score >= 90) return { decision: 'GO', label: 'Strong Pass', color: '#10B981' };
  if (score >= 75) return { decision: 'CONDITIONAL_GO', label: 'Conditional Pass', color: '#F59E0B' };
  if (score >= 60) return { decision: 'HOLD', label: 'Needs Work', color: '#F97316' };
  return { decision: 'NO_GO', label: 'Decline', color: '#EF4444' };
}
