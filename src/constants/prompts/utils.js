// ============================================
// Prompt Utilities
// Shared functions for VIANEO prompts
// ============================================

/**
 * Inject dynamic date values into a prompt string
 * Replaces placeholders with current date/year values
 * @param {string} prompt - The prompt string with placeholders
 * @returns {string} - The prompt with injected values
 */
export const injectDynamicValues = (prompt) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const docId = `${currentYear}-${Date.now().toString(36).slice(-4).toUpperCase()}`;

  return prompt
    .replace(/\{\{CURRENT_DATE\}\}/g, currentDate)
    .replace(/\{\{CURRENT_YEAR\}\}/g, currentYear)
    .replace(/\{\{DOC_ID\}\}/g, docId);
};
