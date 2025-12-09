/**
 * Vercel Serverless Function: Claude API Proxy
 *
 * This endpoint securely proxies requests to the Anthropic Claude API,
 * keeping the API key server-side and never exposed to the client.
 *
 * Endpoint: POST /api/claude
 */

export const config = {
  maxDuration: 300, // Allow up to 5 minutes for Claude API responses (complex prompts need more time)
};

const DEFAULT_CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const API_TIMEOUT_SECONDS = 270;
const API_TIMEOUT_MS = API_TIMEOUT_SECONDS * 1000;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate API key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'API key not configured. Please set ANTHROPIC_API_KEY in Vercel environment variables.'
    });
  }

  try {
    const { system, messages } = req.body;

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Messages array is required'
      });
    }

    // Server-controlled configuration (from environment variables)
    const modelName = process.env.CLAUDE_MODEL || DEFAULT_CLAUDE_MODEL;
    const maxTokens = process.env.CLAUDE_MAX_TOKENS
      ? parseInt(process.env.CLAUDE_MAX_TOKENS, 10)
      : 16000; // Increased to handle Express Mode (all 13 steps in one response)

    // Call Claude API with timeout to prevent hanging requests
    // Use timeout with buffer to stay within maxDuration (300s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    let response;
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelName,
          max_tokens: maxTokens,
          temperature: 0.3,  // Lower temperature for scoring consistency
          system: system || '',
          messages: messages,
        }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error(`Claude API request timed out after ${API_TIMEOUT_SECONDS}s`);
        return res.status(504).json({
          error: 'Request timed out. The AI is processing a complex request. Please try again.',
          details: { timeout: true, duration: `${API_TIMEOUT_SECONDS}s` },
        });
      }
      throw fetchError;
    }
    clearTimeout(timeoutId);

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Claude API error:', response.status, errorData);

      // Map common error codes to user-friendly messages
      const errorMessages = {
        401: 'Invalid API key. Please check your ANTHROPIC_API_KEY.',
        403: 'Access forbidden. API key may lack required permissions.',
        429: 'Rate limit exceeded. Please wait a moment and try again.',
        500: 'Claude API service error. Please try again.',
        504: 'Request timed out. The AI is processing a complex request. Please try again.',
        529: 'Claude API is overloaded. Please try again in a few moments.',
      };

      return res.status(response.status).json({
        error: errorMessages[response.status] || `API error: ${response.status}`,
        details: errorData,
      });
    }

    // Return successful response
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
