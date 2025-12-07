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
    const maxRetries = 4; // Increased from 3 for better resilience against 504 errors
    const baseDelay = 2000; // 2 seconds
    const timeoutBaseDelay = 8000; // 8 seconds for timeout errors (504) - increased for API recovery time

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
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
            // Use longer delay for timeout errors (504), standard delay for others
            const delay = response.status === 504
              ? timeoutBaseDelay * Math.pow(2, attempt)
              : baseDelay * Math.pow(2, attempt);
            const retryNum = attempt + 1;
            addLog?.(`${errorMessage} - retry ${retryNum}/${maxRetries} after ${delay/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw new Error(errorMessage);
        }

        // Log success message if request succeeded after retrying
        if (attempt > 0) {
          addLog?.(`Request succeeded after ${attempt} ${attempt === 1 ? 'retry' : 'retries'}`);
        }

        return await response.json();
      } catch (err) {
        if (attempt === maxRetries) {
          throw err;
        }
        // Network errors - retry with standard delay
        if (err.name === 'TypeError' || err.message.includes('fetch')) {
          const delay = baseDelay * Math.pow(2, attempt);
          const retryNum = attempt + 1;
          addLog?.(`Network error - retry ${retryNum}/${maxRetries} after ${delay/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw err;
      }
    }
  }, []);

  return { callClaudeAPI };
};
