// ============================================
// VIANEO Prompts - Modular Index
// Re-exports all step prompts for backward compatibility
// ============================================

// Utility exports
export { injectDynamicValues } from './utils.js';

// Individual step exports (for selective loading)
export { STEP_0 } from './step0-executive-brief.js';
export { STEP_1 } from './step1-application-forms.js';
export { STEP_2 } from './step2-diagnostic.js';
export { STEP_3 } from './step3-market-maturity.js';
export { STEP_4 } from './step4-legitimacy.js';
export { STEP_5 } from './step5-needs-requesters.js';
export { STEP_6 } from './step6-personas.js';
export { STEP_7 } from './step7-needs-matrix.js';
export { STEP_8 } from './step8-players-influencers.js';
export { STEP_9 } from './step9-value-network.js';
export { STEP_10 } from './step10-diagnostic-comment.js';
export { STEP_11 } from './step11-features-needs.js';
export { STEP_12 } from './step12-viability.js';

// Import all steps for combined export
import { STEP_0 } from './step0-executive-brief.js';
import { STEP_1 } from './step1-application-forms.js';
import { STEP_2 } from './step2-diagnostic.js';
import { STEP_3 } from './step3-market-maturity.js';
import { STEP_4 } from './step4-legitimacy.js';
import { STEP_5 } from './step5-needs-requesters.js';
import { STEP_6 } from './step6-personas.js';
import { STEP_7 } from './step7-needs-matrix.js';
import { STEP_8 } from './step8-players-influencers.js';
import { STEP_9 } from './step9-value-network.js';
import { STEP_10 } from './step10-diagnostic-comment.js';
import { STEP_11 } from './step11-features-needs.js';
import { STEP_12 } from './step12-viability.js';

/**
 * Combined STEP_PROMPTS object for backward compatibility
 * Maintains the same structure as the original prompts.js
 */
export const STEP_PROMPTS = {
  0: STEP_0,
  1: STEP_1,
  2: STEP_2,
  3: STEP_3,
  4: STEP_4,
  5: STEP_5,
  6: STEP_6,
  7: STEP_7,
  8: STEP_8,
  9: STEP_9,
  10: STEP_10,
  11: STEP_11,
  12: STEP_12,
};
