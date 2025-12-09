// ============================================
// Score Extractor (PDR-002 Section 3.3)
// Extract scores from Step 2 & 3 outputs for context injection
// ============================================

/**
 * @typedef {Object} DimensionScores
 * @property {Record<string, number>} scores - Score values by dimension
 * @property {number} [overall] - Overall/weighted score
 * @property {string} [recommendation] - GO/MAYBE/NO recommendation
 */

// ============================================
// JSON Block Extraction (Primary Method)
// ============================================

/**
 * Extract scores from JSON block in step output
 * This is the preferred method - prompts should output scores in JSON format
 * @param {string} stepOutput - Raw step output text
 * @returns {DimensionScores | null} Extracted scores or null
 */
export const extractScoresFromOutput = (stepOutput) => {
  if (!stepOutput) return null;

  // Look for JSON code block
  const jsonBlockMatch = stepOutput.match(/```json\s*([\s\S]*?)\s*```/);

  if (jsonBlockMatch) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1]);

      // Handle both { scores: {...} } and direct { dimension: score } format
      if (parsed.scores) {
        return {
          scores: parsed.scores,
          overall: parsed.overall ?? null,
          recommendation: parsed.recommendation ?? null,
        };
      }

      // Check if it looks like a scores object directly
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        const hasNumericValues = Object.values(parsed).some(
          (v) => typeof v === 'number' || (typeof v === 'object' && 'score' in v)
        );

        if (hasNumericValues) {
          // Normalize scores
          const scores = {};
          let overall = null;

          for (const [key, value] of Object.entries(parsed)) {
            if (key.toLowerCase() === 'overall' || key.toLowerCase() === 'total') {
              overall = typeof value === 'number' ? value : value?.score;
            } else if (typeof value === 'number') {
              scores[key] = value;
            } else if (typeof value === 'object' && 'score' in value) {
              scores[key] = value.score;
            }
          }

          return { scores, overall, recommendation: parsed.recommendation ?? null };
        }
      }
    } catch (e) {
      console.warn('Failed to parse scores JSON block:', e);
    }
  }

  // Fallback: Try to extract from markdown tables
  return extractScoresFromMarkdown(stepOutput);
};

// ============================================
// Markdown Table Extraction (Fallback Method)
// ============================================

/**
 * Extract scores from markdown tables (fallback for non-JSON outputs)
 * @param {string} stepOutput - Raw step output text
 * @returns {DimensionScores | null} Extracted scores or null
 */
const extractScoresFromMarkdown = (stepOutput) => {
  const scores = {};
  let overall = null;
  let recommendation = null;

  // Pattern for Step 2 (40Q Diagnostic) dimension scores
  // e.g., "**Team Dimension Score**: 3.5 / 5.0"
  const step2Pattern = /\*\*(Team|Technology|Management|Commercial)\s*(?:Dimension\s*)?Score\*\*:\s*\[?(\d+\.?\d*)\]?\s*(?:\/\s*5\.?0?)?/gi;
  let match;

  while ((match = step2Pattern.exec(stepOutput)) !== null) {
    const dimension = match[1];
    const score = parseFloat(match[2]);
    if (!isNaN(score)) {
      scores[dimension] = score;
    }
  }

  // Pattern for Step 3 (29Q Market Maturity) dimension scores
  // e.g., "**Legitimacy Score**: [X.X] / 5.0"
  const step3Pattern = /\*\*(Legitimacy|Desirability|Acceptability|Feasibility|Viability)\s*Score\*\*:\s*\[?(\d+\.?\d*)\]?\s*(?:\/\s*5\.?0?)?/gi;

  while ((match = step3Pattern.exec(stepOutput)) !== null) {
    const dimension = match[1];
    const score = parseFloat(match[2]);
    if (!isNaN(score)) {
      scores[dimension] = score;
    }
  }

  // Extract overall score
  const overallPatterns = [
    /\*\*(?:Overall|OVERALL|Total|TOTAL)\s*(?:Diagnostic\s*)?Score\*\*:\s*\[?(\d+\.?\d*)\]?\s*(?:\/\s*5\.?0?)?/i,
    /\*\*OVERALL\*\*\s*\|\s*\*\*\[?(\d+\.?\d*)\]?\*\*/i,
    /Overall:\s*\[?(\d+\.?\d*)\]?/i,
  ];

  for (const pattern of overallPatterns) {
    const overallMatch = stepOutput.match(pattern);
    if (overallMatch) {
      overall = parseFloat(overallMatch[1]);
      if (!isNaN(overall)) break;
    }
  }

  // Extract recommendation (GO/MAYBE/NO)
  const recommendationPatterns = [
    /\*\*(?:DECISION|Recommendation)\*\*:\s*\[?(GO|MAYBE|NO)\]?/i,
    /\*\*Recommendation\*\*:\s*\[?(PROCEED|PROCEED WITH CAUTION|ADDRESS GAPS FIRST|DO NOT PROCEED)\]?/i,
  ];

  for (const pattern of recommendationPatterns) {
    const recMatch = stepOutput.match(pattern);
    if (recMatch) {
      recommendation = recMatch[1].toUpperCase();
      break;
    }
  }

  // Only return if we found any scores
  if (Object.keys(scores).length === 0 && overall === null) {
    return null;
  }

  return { scores, overall, recommendation };
};

// ============================================
// Score Formatting Functions
// ============================================

/**
 * Format extracted scores for context injection
 * @param {DimensionScores} scoresData - Extracted scores data
 * @param {string} label - Label for the scores section
 * @returns {string} Formatted markdown string
 */
export const formatScoresForContext = (scoresData, label = 'Assessment Scores') => {
  if (!scoresData || !scoresData.scores) {
    return '';
  }

  const { scores, overall, recommendation } = scoresData;
  const lines = [];

  lines.push(`## ${label}`);
  lines.push('');

  // Format individual dimension scores
  for (const [dimension, score] of Object.entries(scores)) {
    const formattedScore = typeof score === 'number' ? score.toFixed(1) : score;
    lines.push(`- **${dimension}**: ${formattedScore}/5.0`);
  }

  // Add overall score if available
  if (overall !== null && overall !== undefined) {
    lines.push('');
    lines.push(`**Overall Score**: ${typeof overall === 'number' ? overall.toFixed(2) : overall}/5.0`);
  }

  // Add recommendation if available
  if (recommendation) {
    lines.push(`**Recommendation**: ${recommendation}`);
  }

  return lines.join('\n');
};

/**
 * Format scores as a compact summary for token efficiency
 * @param {DimensionScores} scoresData - Extracted scores data
 * @returns {string} Compact scores string
 */
export const formatScoresCompact = (scoresData) => {
  if (!scoresData || !scoresData.scores) {
    return '';
  }

  const { scores, overall, recommendation } = scoresData;
  const scorePairs = Object.entries(scores)
    .map(([dim, score]) => `${dim[0]}:${typeof score === 'number' ? score.toFixed(1) : score}`)
    .join(' | ');

  let result = scorePairs;

  if (overall !== null && overall !== undefined) {
    result += ` | Overall:${typeof overall === 'number' ? overall.toFixed(2) : overall}`;
  }

  if (recommendation) {
    result += ` [${recommendation}]`;
  }

  return result;
};

// ============================================
// Step-Specific Extractors
// ============================================

/**
 * Extract Step 2 (40Q Diagnostic) scores
 * @param {string} stepOutput - Step 2 output
 * @returns {DimensionScores | null} Extracted scores
 */
export const extractStep2Scores = (stepOutput) => {
  const result = extractScoresFromOutput(stepOutput);

  // Validate expected dimensions for Step 2
  const expectedDimensions = ['Team', 'Technology', 'Management', 'Commercial'];
  if (result && result.scores) {
    const hasDimensions = expectedDimensions.some((dim) =>
      Object.keys(result.scores).some((key) => key.toLowerCase() === dim.toLowerCase())
    );
    if (hasDimensions) {
      return result;
    }
  }

  return result;
};

/**
 * Extract Step 3 (29Q Market Maturity) scores
 * @param {string} stepOutput - Step 3 output
 * @returns {DimensionScores | null} Extracted scores
 */
export const extractStep3Scores = (stepOutput) => {
  const result = extractScoresFromOutput(stepOutput);

  // Validate expected dimensions for Step 3
  const expectedDimensions = ['Legitimacy', 'Desirability', 'Acceptability', 'Feasibility', 'Viability'];
  if (result && result.scores) {
    const hasDimensions = expectedDimensions.some((dim) =>
      Object.keys(result.scores).some((key) => key.toLowerCase() === dim.toLowerCase())
    );
    if (hasDimensions) {
      return result;
    }
  }

  return result;
};

/**
 * Get formatted context for both Step 2 and Step 3 scores
 * @param {Record<number, string>} stepOutputs - All step outputs
 * @returns {string} Combined scores context string
 */
export const getCombinedScoresContext = (stepOutputs) => {
  const parts = [];

  if (stepOutputs[2]) {
    const step2Scores = extractStep2Scores(stepOutputs[2]);
    if (step2Scores) {
      parts.push(formatScoresForContext(step2Scores, '40Q Diagnostic Scores'));
    }
  }

  if (stepOutputs[3]) {
    const step3Scores = extractStep3Scores(stepOutputs[3]);
    if (step3Scores) {
      parts.push(formatScoresForContext(step3Scores, '29Q Market Maturity Scores'));
    }
  }

  return parts.join('\n\n');
};

// ============================================
// Score Validation
// ============================================

/**
 * Validate that scores are within expected range
 * @param {DimensionScores} scoresData - Scores to validate
 * @param {number} [min=1] - Minimum valid score
 * @param {number} [max=5] - Maximum valid score
 * @returns {boolean} True if all scores are valid
 */
export const validateScores = (scoresData, min = 1, max = 5) => {
  if (!scoresData || !scoresData.scores) {
    return false;
  }

  for (const score of Object.values(scoresData.scores)) {
    if (typeof score !== 'number' || score < min || score > max) {
      return false;
    }
  }

  if (scoresData.overall !== null && scoresData.overall !== undefined) {
    if (typeof scoresData.overall !== 'number' || scoresData.overall < min || scoresData.overall > max) {
      return false;
    }
  }

  return true;
};

export default {
  extractScoresFromOutput,
  formatScoresForContext,
  formatScoresCompact,
  extractStep2Scores,
  extractStep3Scores,
  getCombinedScoresContext,
  validateScores,
};
