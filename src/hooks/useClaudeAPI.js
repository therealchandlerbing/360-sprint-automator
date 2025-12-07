// ============================================
// Claude API Hook
// Handles API calls with retry logic and timeout
// ============================================

import { useCallback } from 'react';

// Configuration constants
const CONFIG = {
  maxRetries: 4,
  baseDelay: 2000, // 2 seconds for standard errors
  timeoutBaseDelay: 8000, // 8 seconds for 504 timeout errors
  rateLimitBaseDelay: 15000, // 15 seconds for rate limit errors (429) - aggressive backoff
  clientTimeout: 300000, // 5 minutes client-side timeout (matches Vercel maxDuration)
};

/**
 * Check if an error is a network-related error that should be retried
 * @param {Error} err - The error to check
 * @returns {boolean} True if it's a retriable network error
 */
const isNetworkError = (err) => {
  // TypeError is thrown for network failures in most browsers
  if (err.name === 'TypeError') return true;

  // AbortError from our timeout - treat as network issue
  if (err.name === 'AbortError') return true;

  // Check common network error messages across browsers
  const networkErrorPatterns = [
    'fetch',
    'network',
    'failed to fetch',
    'load failed',
    'networkerror',
    'connection',
    'timeout',
    'aborted',
  ];

  const errorMessage = err.message.toLowerCase();
  return networkErrorPatterns.some(pattern => errorMessage.includes(pattern));
};

/**
 * Hook to manage Claude API calls with exponential backoff retry
 * @returns {Object} API call function
 */
export const useClaudeAPI = () => {
  /**
   * Call Claude API with retry logic and client-side timeout
   * @param {string} systemPrompt - System prompt for Claude
   * @param {string} userPrompt - User prompt for Claude
   * @param {Function} addLog - Function to add log entries
   * @returns {Promise<Object>} API response
   */
  const callClaudeAPI = useCallback(async (systemPrompt, userPrompt, addLog) => {
    const { maxRetries, baseDelay, timeoutBaseDelay, rateLimitBaseDelay, clientTimeout } = CONFIG;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const requestStartTime = Date.now();

      // Create AbortController for client-side timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), clientTimeout);

      try {
        const response = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const requestDuration = ((Date.now() - requestStartTime) / 1000).toFixed(1);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `API error: ${response.status}`;

          // Retry on rate limit (429) or server errors (5xx)
          if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
            // Use appropriate delay based on error type
            let delay;
            if (response.status === 504) {
              delay = timeoutBaseDelay * Math.pow(2, attempt);
            } else if (response.status === 429) {
              delay = rateLimitBaseDelay * Math.pow(2, attempt);
            } else {
              delay = baseDelay * Math.pow(2, attempt);
            }

            const retryNum = attempt + 1;
            addLog?.(`${errorMessage} (${requestDuration}s) - retry ${retryNum}/${maxRetries} after ${delay/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw new Error(errorMessage);
        }

        // Log success message if request succeeded after retrying
        if (attempt > 0) {
          addLog?.(`Request succeeded after ${attempt} ${attempt === 1 ? 'retry' : 'retries'} (${requestDuration}s)`);
        }

        return await response.json();
      } catch (err) {
        clearTimeout(timeoutId);
        const requestDuration = ((Date.now() - requestStartTime) / 1000).toFixed(1);

        if (attempt === maxRetries) {
          throw err;
        }

        // Network errors and timeouts - retry with standard delay
        if (isNetworkError(err)) {
          const delay = baseDelay * Math.pow(2, attempt);
          const retryNum = attempt + 1;
          const errorType = err.name === 'AbortError' ? 'Request timeout' : 'Network error';
          addLog?.(`${errorType} (${requestDuration}s) - retry ${retryNum}/${maxRetries} after ${delay/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw err;
      }
    }
  }, []);

  return { callClaudeAPI };
};
