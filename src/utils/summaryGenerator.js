// ============================================
// Summary Generator (PDR-002 Section 3.4)
// Generate AI summary of Steps 4-9 for Step 10 context compression
// ============================================

/**
 * System prompt for generating the Steps 4-9 summary
 * This compresses ~15K tokens of deep dive analysis into ~2.5K tokens
 */
export const SUMMARY_SYSTEM_PROMPT = `You are a synthesis assistant for VIANEO Sprint Automator.

Your task is to create a concise executive summary that captures the essential insights from the deep-dive analysis steps.

## Output Requirements

- Maximum 500 words
- Structured markdown format
- Focus on actionable insights, not general observations
- Preserve specific numbers, names, and metrics
- Highlight validated vs. assumed information

## Your Expertise

You understand startup evaluation, market analysis, and the VIANEO framework which assesses projects on:
- Legitimacy (real problem worth solving)
- Desirability (people want the solution)
- Acceptability (ecosystem supports it)
- Feasibility (team can deliver)
- Viability (sustainable business)`;

/**
 * Generate the user prompt for summary generation
 * @param {Record<number, string>} stepOutputs - Step outputs 4-9
 * @returns {string} Formatted user prompt
 */
export const generateSummaryPrompt = (stepOutputs) => {
  const sections = [];

  // Step 4: Legitimacy
  if (stepOutputs[4]) {
    sections.push(`## STEP 4 - LEGITIMACY WORKSHEET
${stepOutputs[4]}`);
  }

  // Step 5: Needs & Requesters
  if (stepOutputs[5]) {
    sections.push(`## STEP 5 - NEEDS & REQUESTERS
${stepOutputs[5]}`);
  }

  // Step 6: Personas
  if (stepOutputs[6]) {
    sections.push(`## STEP 6 - PERSONA DEVELOPMENT
${stepOutputs[6]}`);
  }

  // Step 7: Needs Matrix
  if (stepOutputs[7]) {
    sections.push(`## STEP 7 - NEEDS QUALIFICATION MATRIX
${stepOutputs[7]}`);
  }

  // Step 8: Players & Influencers
  if (stepOutputs[8]) {
    sections.push(`## STEP 8 - PLAYERS & INFLUENCERS
${stepOutputs[8]}`);
  }

  // Step 9: Value Network
  if (stepOutputs[9]) {
    sections.push(`## STEP 9 - VALUE NETWORK MAP
${stepOutputs[9]}`);
  }

  const inputContent = sections.join('\n\n---\n\n');

  return `Given the following deep-dive analysis outputs from Steps 4-9, create a concise executive summary (max 500 words) that captures:

1. **Key Validation Findings**: What's proven vs. what's still assumed
2. **Critical Risks Identified**: Top risks that could derail the project
3. **Ecosystem Dynamics**: Key players, influencers, and value network insights
4. **Priority Opportunities**: Most promising paths forward

---

${inputContent}

---

## OUTPUT FORMAT (Use this exact structure):

## Deep Dive Summary (Steps 4-9)

### Validation Status
[3-5 bullet points on what's validated vs. assumed]

### Critical Risks
[3-5 bullet points on key risks]

### Ecosystem Dynamics
[3-5 bullet points on players, influencers, value flows]

### Priority Opportunities
[3-5 bullet points on recommended focus areas]

### Key Metrics Extracted
[Any specific numbers, percentages, or metrics worth preserving]`;
};

/**
 * Check if summary generation is needed (Steps 4-9 exist)
 * @param {Record<number, string>} stepOutputs - Step outputs
 * @returns {boolean} True if summary can be generated
 */
export const canGenerateSummary = (stepOutputs) => {
  // Need at least Steps 4 and 5 to generate a meaningful summary
  return Boolean(stepOutputs[4] && stepOutputs[5]);
};

/**
 * Get the list of available steps for summary (4-9)
 * @param {Record<number, string>} stepOutputs - Step outputs
 * @returns {number[]} Array of step IDs that have content
 */
export const getAvailableStepsForSummary = (stepOutputs) => {
  const available = [];
  for (let i = 4; i <= 9; i++) {
    if (stepOutputs[i]) {
      available.push(i);
    }
  }
  return available;
};

/**
 * Estimate token count for Steps 4-9 content
 * @param {Record<number, string>} stepOutputs - Step outputs
 * @returns {number} Estimated token count
 */
export const estimateStepsTokenCount = (stepOutputs) => {
  let totalChars = 0;
  for (let i = 4; i <= 9; i++) {
    if (stepOutputs[i]) {
      totalChars += stepOutputs[i].length;
    }
  }
  // Rough approximation: 4 characters per token
  return Math.ceil(totalChars / 4);
};

/**
 * Generate summary using the Claude API
 * This function should be called from App.jsx before Step 10 processing
 *
 * @param {Record<number, string>} stepOutputs - Step outputs 4-9
 * @param {Function} callClaudeAPI - API calling function
 * @param {Function} [onProgress] - Optional progress callback
 * @returns {Promise<string>} Generated summary
 */
export const generateStepsSummary = async (stepOutputs, callClaudeAPI, onProgress = null) => {
  if (!canGenerateSummary(stepOutputs)) {
    throw new Error('Insufficient step outputs for summary generation. Steps 4 and 5 are required.');
  }

  const availableSteps = getAvailableStepsForSummary(stepOutputs);
  const inputTokens = estimateStepsTokenCount(stepOutputs);

  if (onProgress) {
    onProgress(`Generating summary of Steps ${availableSteps.join(', ')} (~${inputTokens} tokens → ~600 tokens)`);
  }

  const userPrompt = generateSummaryPrompt(stepOutputs);

  try {
    const response = await callClaudeAPI(SUMMARY_SYSTEM_PROMPT, userPrompt);

    // Extract text content from response
    const summary = response.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

    if (onProgress) {
      onProgress('Summary generation complete');
    }

    return summary;
  } catch (error) {
    console.error('Summary generation failed:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
};

/**
 * Create a fallback summary without AI (basic extraction)
 * Use this if AI summary generation fails
 * @param {Record<number, string>} stepOutputs - Step outputs
 * @returns {string} Basic summary
 */
export const createFallbackSummary = (stepOutputs) => {
  const sections = [];

  sections.push('## Deep Dive Summary (Steps 4-9)');
  sections.push('');
  sections.push('*Note: This is a condensed view. Full analysis available in individual steps.*');
  sections.push('');

  // Extract key sections from each step
  const stepSummaries = [
    { id: 4, name: 'Legitimacy', key: 'Problem Validation' },
    { id: 5, name: 'Needs & Requesters', key: 'WHO/WHAT Analysis' },
    { id: 6, name: 'Personas', key: 'Target Personas' },
    { id: 7, name: 'Needs Matrix', key: 'Priority Needs' },
    { id: 8, name: 'Players', key: 'Ecosystem Players' },
    { id: 9, name: 'Value Network', key: 'Value Flows' },
  ];

  for (const step of stepSummaries) {
    if (stepOutputs[step.id]) {
      sections.push(`### ${step.name} (Step ${step.id})`);

      // Try to extract first substantive paragraph or section
      const content = stepOutputs[step.id];
      const lines = content.split('\n').filter(line => line.trim());

      // Find first content after any header
      let foundContent = false;
      let contentLines = [];

      for (const line of lines) {
        if (foundContent && contentLines.length < 5) {
          if (line.startsWith('#')) break;
          if (line.trim()) contentLines.push(line);
        }
        if (line.startsWith('##') && !foundContent) {
          foundContent = true;
        }
      }

      if (contentLines.length > 0) {
        sections.push(contentLines.join('\n'));
      } else {
        sections.push(`*${step.key} analysis completed. See Step ${step.id} for details.*`);
      }

      sections.push('');
    }
  }

  return sections.join('\n');
};

/**
 * Summary generator configuration
 */
export const SUMMARY_CONFIG = {
  /** Maximum words for the summary */
  maxWords: 500,
  /** Approximate token limit for the summary */
  maxTokens: 700,
  /** Steps included in the summary */
  includedSteps: [4, 5, 6, 7, 8, 9],
  /** Model to use for summary (recommend Haiku for speed) */
  recommendedModel: 'claude-3-haiku-20240307',
};

export default {
  SUMMARY_SYSTEM_PROMPT,
  generateSummaryPrompt,
  canGenerateSummary,
  getAvailableStepsForSummary,
  estimateStepsTokenCount,
  generateStepsSummary,
  createFallbackSummary,
  SUMMARY_CONFIG,
};
