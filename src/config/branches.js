// ============================================
// Branch Configuration
// Data-driven configuration for organization-specific assessment tracks
// Per PDR-002: Hourglass Architecture & Context Engine
// ============================================

/**
 * @typedef {'strict' | 'warn' | 'soft'} EnforcementLevel
 */

/**
 * @typedef {'market' | 'financials' | 'team' | 'technology' | 'traction' | 'competition' | 'risks' | 'validation'} FactCategory
 */

/**
 * @typedef {Object} BranchConfig
 * @property {string} id - Unique branch identifier
 * @property {string} name - Display name
 * @property {string} icon - Emoji icon for UI
 * @property {string} description - Brief description of the branch focus
 * @property {Record<number, string>} promptOverrides - Custom prompt IDs for specific steps
 * @property {string[]} requiredKeyFacts - Key Facts that must be extracted for this branch
 * @property {number[]} skipSteps - Steps to skip for this branch
 * @property {string[]} focusAreas - Priority analysis areas for this branch
 * @property {Object} contextWeights - Weight multipliers for context injection
 */

/**
 * Branch configuration for organization-specific assessment tracks
 * @type {Record<string, BranchConfig>}
 */
export const BRANCHES = {
  '360SIS': {
    id: '360SIS',
    name: '360 Social Impact Studios',
    icon: '🌍',
    description: 'Social impact metrics, SDG alignment, and beneficiary outcomes',
    promptOverrides: {
      1: 'step1-360sis',
      // Step 1 uses social impact application form template
    },
    requiredKeyFacts: [
      'sdg_alignment',
      'impact_metrics',
      'beneficiary_count',
      'theory_of_change',
      'social_return_on_investment',
    ],
    skipSteps: [],
    focusAreas: [
      'social_impact',
      'sustainability',
      'community_engagement',
      'sdg_goals',
    ],
    contextWeights: {
      impact_metrics: 1.5,  // Emphasize impact in context
      financials: 0.8,      // De-emphasize pure financial metrics
    },
  },

  'CNEN': {
    id: 'CNEN',
    name: 'CNEN (Brazil Nuclear)',
    icon: '🇧🇷',
    description: 'Nuclear safety, regulatory compliance, and technology readiness',
    promptOverrides: {
      1: 'step1-cnen',
      4: 'step4-cnen',  // Regulatory-focused Legitimacy assessment
    },
    requiredKeyFacts: [
      'trl_level',
      'regulatory_status',
      'safety_certification',
      'nuclear_application',
      'compliance_status',
    ],
    skipSteps: [],
    focusAreas: [
      'regulatory_compliance',
      'safety',
      'technology_readiness',
      'nuclear_applications',
    ],
    contextWeights: {
      technology: 1.5,      // Emphasize tech readiness
      risks: 1.5,           // Emphasize risk assessment
      regulatory: 2.0,      // Heavy emphasis on regulatory
    },
  },

  'GENERIC': {
    id: 'GENERIC',
    name: 'Standard VIANEO Assessment',
    icon: '📊',
    description: 'Standard assessment without organization-specific application form',
    promptOverrides: {},
    requiredKeyFacts: [],
    skipSteps: [1],  // Skip Application Form step - go directly to analysis
    focusAreas: [
      'market_opportunity',
      'team_capability',
      'technology_differentiation',
      'business_model',
    ],
    contextWeights: {},  // Use default weights
  },
};

/**
 * Get branch configuration by ID
 * @param {string} branchId - The branch ID to look up
 * @returns {BranchConfig | null} The branch config or null if not found
 */
export const getBranchConfig = (branchId) => {
  return BRANCHES[branchId] || null;
};

/**
 * Get all available branch IDs
 * @returns {string[]} Array of branch IDs
 */
export const getBranchIds = () => {
  return Object.keys(BRANCHES);
};

/**
 * Check if a step should be skipped for a branch
 * @param {string} branchId - The branch ID
 * @param {number} stepId - The step number
 * @returns {boolean} True if the step should be skipped
 */
export const shouldSkipStep = (branchId, stepId) => {
  const branch = getBranchConfig(branchId);
  return branch?.skipSteps.includes(stepId) ?? false;
};

/**
 * Get the prompt override for a step (if any)
 * @param {string} branchId - The branch ID
 * @param {number} stepId - The step number
 * @returns {string | null} The prompt override ID or null
 */
export const getPromptOverride = (branchId, stepId) => {
  const branch = getBranchConfig(branchId);
  return branch?.promptOverrides[stepId] ?? null;
};

/**
 * Get required Key Facts for a branch
 * @param {string} branchId - The branch ID
 * @returns {string[]} Array of required Key Fact keys
 */
export const getRequiredKeyFacts = (branchId) => {
  const branch = getBranchConfig(branchId);
  return branch?.requiredKeyFacts ?? [];
};

/**
 * Default branch ID when none is selected
 */
export const DEFAULT_BRANCH = 'GENERIC';

/**
 * Validate if a branch ID is valid
 * @param {string} branchId - The branch ID to validate
 * @returns {boolean} True if valid
 */
export const isValidBranch = (branchId) => {
  return branchId in BRANCHES;
};
