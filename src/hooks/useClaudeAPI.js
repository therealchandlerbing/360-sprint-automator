// ============================================
// Claude API Hook
// Handles API calls with retry logic
// ============================================

import { useCallback } from 'react';

/**
 * Hook to manage Claude API calls with exponential backoff retry
 * @returns {Object} API call function
 */
export const useClaudeAPI = () => {
  /**
   * Call Claude API with retry logic
   * @param {string} systemPrompt - System prompt for Claude
   * @param {string} userPrompt - User prompt for Claude
   * @param {Function} addLog - Function to add log entries
   * @returns {Promise<Object>} API response
   */
  const callClaudeAPI = useCallback(async (systemPrompt, userPrompt, addLog) => {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          addLog?.(`Retry attempt ${attempt}/${maxRetries} after ${delay/1000}s delay...`);
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
            addLog?.(`${errorMessage} - will retry...`);
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
          addLog?.(`Network error - will retry...`);
          continue;
        }
        throw err;
      }
    }
  }, []);

  return { callClaudeAPI };
};
