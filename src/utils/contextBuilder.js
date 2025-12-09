// ============================================
// Context Builder (PDR-002 Section 3.1-3.2)
// Implements Context Matrix Strategy for Hourglass Architecture
// ============================================

import { STEPS } from '../constants/steps.js';

/**
 * Compression levels for context injection
 * @typedef {'full' | 'scores_only' | 'summary' | 'key_facts_only'} CompressionLevel
 */

/**
 * @typedef {Object} ContextInput
 * @property {string} source - Source identifier (e.g., 'STEP_0', 'KEY_FACTS', 'INPUT_CONTENT')
 * @property {CompressionLevel} compression - How to compress the source
 * @property {string} [filter] - Optional filter (e.g., 'market' for KEY_FACTS:market)
 */

/**
 * @typedef {Object} StepContextConfig
 * @property {ContextInput[]} inputs - Array of context inputs for this step
 */

// ============================================
// Context Matrix Strategy (PDR-002 Section 3.1)
// ============================================

/**
 * Context injection strategy per step
 * Replaces the ALL_PRIOR_OUTPUTS concatenation pattern
 * @type {Record<number, StepContextConfig>}
 */
export const CONTEXT_STRATEGY = {
  0: {
    inputs: [{ source: 'INPUT_CONTENT', compression: 'full' }],
  },
  1: {
    inputs: [
      { source: 'STEP_0', compression: 'full' },
      { source: 'BRANCH_CONFIG', compression: 'full' },
    ],
  },
  2: {
    inputs: [{ source: 'STEP_0', compression: 'full' }],
  },
  3: {
    inputs: [
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_2', compression: 'scores_only' },
    ],
  },
  4: {
    inputs: [
      { source: 'STEP_0', compression: 'full' },
      { source: 'KEY_FACTS', compression: 'full', filter: 'market' },
    ],
  },
  5: {
    inputs: [
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_4', compression: 'full' },
    ],
  },
  6: {
    inputs: [
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_5', compression: 'full' },
    ],
  },
  7: {
    inputs: [
      { source: 'STEP_5', compression: 'full' },
      { source: 'STEP_6', compression: 'full' },
    ],
  },
  8: {
    inputs: [
      { source: 'STEP_0', compression: 'full' },
      { source: 'KEY_FACTS', compression: 'full' },
    ],
  },
  9: {
    inputs: [
      { source: 'STEP_8', compression: 'full' },
      { source: 'KEY_FACTS', compression: 'full' },
    ],
  },
  // Step 10: SYNTHESIS INFLECTION POINT (The "Neck" of the Hourglass)
  10: {
    inputs: [
      { source: 'KEY_FACTS', compression: 'full' },
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_2', compression: 'scores_only' },
      { source: 'STEP_3', compression: 'scores_only' },
      { source: 'STEPS_4_9', compression: 'summary' },
    ],
  },
  11: {
    inputs: [
      { source: 'KEY_FACTS', compression: 'full' },
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_10', compression: 'full' },
    ],
  },
  12: {
    inputs: [
      { source: 'KEY_FACTS', compression: 'full' },
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_10', compression: 'full' },
      { source: 'STEP_11', compression: 'full' },
    ],
  },
};

// ============================================
// Content Retrieval Functions
// ============================================

/**
 * Get step output with optional label
 * @param {Record<number, string>} stepOutputs - Step outputs object
 * @param {number} stepId - Step ID to retrieve
 * @param {boolean} [includeLabel=true] - Include step name label
 * @returns {string} Step output content
 */
const getStepOutput = (stepOutputs, stepId, includeLabel = true) => {
  const output = stepOutputs[stepId];
  if (!output) return '';

  if (includeLabel) {
    const step = STEPS[stepId];
    return `## Step ${stepId}: ${step?.name || 'Unknown'}\n\n${output}`;
  }
  return output;
};

/**
 * Get Key Facts as context string
 * @param {Object} keyFactsStore - Key Facts store instance
 * @param {string} [filter] - Optional category filter
 * @returns {string} Formatted Key Facts context
 */
const getKeyFactsContext = (keyFactsStore, filter = null) => {
  if (!keyFactsStore || typeof keyFactsStore.getFactsAsContext !== 'function') {
    return '';
  }
  return keyFactsStore.getFactsAsContext(filter);
};

/**
 * Get branch configuration as context
 * @param {string} branchId - Branch ID
 * @param {Object} branchesConfig - Branches configuration object
 * @returns {string} Formatted branch context
 */
const getBranchContext = (branchId, branchesConfig) => {
  if (!branchId || !branchesConfig) return '';

  const branch = branchesConfig[branchId];
  if (!branch) return '';

  return `## Branch Configuration: ${branch.name}

**Focus Areas:** ${branch.focusAreas?.join(', ') || 'Standard assessment'}
**Required Key Facts:** ${branch.requiredKeyFacts?.join(', ') || 'None specified'}
**Description:** ${branch.description || 'Standard VIANEO assessment'}`;
};

// ============================================
// Score Extraction Integration
// ============================================

/**
 * Extract scores from step output and format for context
 * @param {string} stepOutput - Raw step output
 * @param {string} label - Label for the scores section
 * @returns {string} Formatted scores context or empty string
 */
const getScoresContext = (stepOutput, label) => {
  // Import dynamically to avoid circular dependency
  // The actual extraction is done by scoreExtractor.js
  const { extractScoresFromOutput, formatScoresForContext } = getScoreExtractorFunctions();

  if (!extractScoresFromOutput || !formatScoresForContext) {
    // Fallback: return empty if score extractor not available
    return '';
  }

  const scores = extractScoresFromOutput(stepOutput);
  if (!scores) return '';

  return formatScoresForContext(scores, label);
};

// Lazy-load score extractor to avoid circular deps
let scoreExtractorModule = null;
const getScoreExtractorFunctions = () => {
  if (!scoreExtractorModule) {
    try {
      // This will be populated after scoreExtractor.js is created
      scoreExtractorModule = {
        extractScoresFromOutput: null,
        formatScoresForContext: null,
      };
    } catch (e) {
      console.warn('Score extractor not available:', e);
    }
  }
  return scoreExtractorModule || {};
};

// Setter to inject score extractor functions
export const setScoreExtractorFunctions = (extractFn, formatFn) => {
  scoreExtractorModule = {
    extractScoresFromOutput: extractFn,
    formatScoresForContext: formatFn,
  };
};

// ============================================
// Summary Generation Integration
// ============================================

/**
 * Get AI-generated summary of Steps 4-9
 * This is set externally by the summary generator
 * @type {string | null}
 */
let cachedStepsSummary = null;

/**
 * Set the cached summary for Steps 4-9
 * @param {string} summary - AI-generated summary
 */
export const setStepsSummary = (summary) => {
  cachedStepsSummary = summary;
};

/**
 * Get the cached summary for Steps 4-9
 * @returns {string | null} The summary or null
 */
export const getStepsSummary = () => cachedStepsSummary;

/**
 * Clear the cached summary
 */
export const clearStepsSummary = () => {
  cachedStepsSummary = null;
};

// ============================================
// Main Context Builder Function
// ============================================

/**
 * Build context string for a specific step using the Context Matrix strategy
 * @param {number} stepId - Step ID to build context for
 * @param {Object} projectState - Project state object
 * @param {Record<number, string>} projectState.stepOutputs - Step outputs
 * @param {string} projectState.inputContent - Original input content
 * @param {string} [projectState.organizationBranch] - Selected branch ID
 * @param {Object} [options] - Optional configuration
 * @param {Object} [options.keyFactsStore] - Key Facts store instance
 * @param {Object} [options.branchesConfig] - Branches configuration
 * @param {string} [options.stepsSummary] - Pre-generated summary for Steps 4-9
 * @returns {Object} Context object with named placeholders
 */
export const buildStepContext = (stepId, projectState, options = {}) => {
  const { stepOutputs, inputContent, organizationBranch } = projectState;
  const { keyFactsStore, branchesConfig, stepsSummary } = options;

  const strategy = CONTEXT_STRATEGY[stepId];
  if (!strategy) {
    console.warn(`No context strategy defined for step ${stepId}`);
    return {};
  }

  const context = {};
  const contextParts = [];

  for (const input of strategy.inputs) {
    let content = '';
    let contextKey = '';

    switch (input.source) {
      case 'INPUT_CONTENT':
        content = inputContent || '';
        contextKey = 'INPUT_CONTENT';
        break;

      case 'BRANCH_CONFIG':
        content = getBranchContext(organizationBranch, branchesConfig);
        contextKey = 'BRANCH_CONFIG';
        break;

      case 'KEY_FACTS':
        content = getKeyFactsContext(keyFactsStore, input.filter);
        contextKey = input.filter ? `KEY_FACTS_${input.filter.toUpperCase()}` : 'KEY_FACTS';
        break;

      case 'STEPS_4_9':
        // Use provided summary or cached summary
        content = stepsSummary || cachedStepsSummary || '';
        contextKey = 'STEPS_4_9_SUMMARY';

        // Fallback: If no summary available, generate a basic concatenation
        if (!content && input.compression === 'summary') {
          const fallbackParts = [];
          for (let i = 4; i <= 9; i++) {
            if (stepOutputs[i]) {
              fallbackParts.push(getStepOutput(stepOutputs, i, true));
            }
          }
          content = fallbackParts.join('\n\n---\n\n');
        }
        break;

      default:
        // Handle STEP_X sources
        if (input.source.startsWith('STEP_')) {
          const sourceStepId = parseInt(input.source.replace('STEP_', ''), 10);

          if (input.compression === 'scores_only') {
            // Extract only scores from the step output
            const label = `${STEPS[sourceStepId]?.name || `Step ${sourceStepId}`} Scores`;
            content = getScoresContext(stepOutputs[sourceStepId] || '', label);

            // Fallback if score extraction fails
            if (!content && stepOutputs[sourceStepId]) {
              content = getStepOutput(stepOutputs, sourceStepId, true);
            }
          } else {
            // Full output
            content = getStepOutput(stepOutputs, sourceStepId, true);
          }

          contextKey = `STEP_${sourceStepId}_OUTPUT`;
        }
    }

    if (content) {
      context[contextKey] = content;
      contextParts.push(content);
    }
  }

  // Also provide a combined ALL_CONTEXT for prompts that use it
  context.ALL_CONTEXT = contextParts.join('\n\n---\n\n');

  return context;
};

/**
 * Build context and return as a single string (legacy compatibility)
 * @param {number} stepId - Step ID
 * @param {Object} projectState - Project state
 * @param {Object} [options] - Options
 * @returns {string} Combined context string
 */
export const buildStepContextString = (stepId, projectState, options = {}) => {
  const context = buildStepContext(stepId, projectState, options);
  return context.ALL_CONTEXT || '';
};

// ============================================
// Legacy Compatibility Layer
// ============================================

/**
 * Build context in legacy format (for backward compatibility with existing prompts)
 * @param {number} stepId - Step ID
 * @param {Record<number, string>} stepOutputs - Step outputs
 * @returns {Object} Legacy context object
 */
export const buildLegacyContext = (stepId, stepOutputs) => {
  const context = {};

  // Always include Step 0 for steps 1+
  if (stepId >= 1 && stepOutputs[0]) context.STEP_0_OUTPUT = stepOutputs[0];
  if (stepId >= 3 && stepOutputs[2]) context.STEP_2_OUTPUT = stepOutputs[2];
  if (stepId >= 4 && stepOutputs[3]) context.STEP_3_OUTPUT = stepOutputs[3];
  if (stepId >= 5 && stepOutputs[4]) context.STEP_4_OUTPUT = stepOutputs[4];
  if (stepId >= 6 && stepOutputs[5]) context.STEP_5_OUTPUT = stepOutputs[5];
  if (stepId >= 7 && stepOutputs[6]) context.STEP_6_OUTPUT = stepOutputs[6];
  if (stepId >= 9 && stepOutputs[8]) context.STEP_8_OUTPUT = stepOutputs[8];

  // Steps 10-12: aggregate ALL prior outputs (legacy behavior)
  if (stepId >= 10) {
    context.ALL_PRIOR_OUTPUTS = Object.entries(stepOutputs)
      .filter(([id]) => parseInt(id, 10) < stepId)
      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
      .map(([id, output]) => `## Step ${id}: ${STEPS[parseInt(id, 10)]?.name || 'Unknown'}\n\n${output}`)
      .join('\n\n---\n\n');
  }

  return context;
};

/**
 * Estimate token count for a step's context (rough approximation)
 * @param {number} stepId - Step ID
 * @param {Object} projectState - Project state
 * @param {Object} [options] - Options
 * @returns {number} Estimated token count
 */
export const estimateContextTokens = (stepId, projectState, options = {}) => {
  const context = buildStepContext(stepId, projectState, options);
  const combinedLength = Object.values(context)
    .filter((v) => typeof v === 'string')
    .join('')
    .length;

  // Rough approximation: 4 characters per token
  return Math.ceil(combinedLength / 4);
};

export default {
  CONTEXT_STRATEGY,
  buildStepContext,
  buildStepContextString,
  buildLegacyContext,
  setStepsSummary,
  getStepsSummary,
  clearStepsSummary,
  setScoreExtractorFunctions,
  estimateContextTokens,
};
