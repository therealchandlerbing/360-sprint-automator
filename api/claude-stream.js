/**
 * Vercel Serverless Function: Claude API Streaming Proxy
 *
 * This endpoint provides streaming responses from the Anthropic Claude API
 * using the Vercel AI SDK for improved UX (token-by-token display).
 *
 * Endpoint: POST /api/claude-stream
 */

import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

export const config = {
  maxDuration: 300, // Allow up to 5 minutes for Claude API responses
};

const DEFAULT_CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const API_TIMEOUT_SECONDS = 270; // Buffer before maxDuration (300s)
const API_TIMEOUT_MS = API_TIMEOUT_SECONDS * 1000;

/**
 * Classify error type from Anthropic/AI SDK errors
 * Uses error codes and status when available, falls back to message patterns
 * @param {Error} error - The error to classify
 * @returns {{ type: string, status: number, message: string }}
 */
function classifyError(error) {
  // Check for structured error properties first (more reliable)
  const errorCode = error.code || error.error?.type;
  const statusCode = error.status || error.statusCode;

  // Rate limit errors
  if (
    statusCode === 429 ||
    errorCode === 'rate_limit_error' ||
    errorCode === 'rate_limit_exceeded'
  ) {
    return {
      type: 'rate_limit',
      status: 429,
      message: 'Rate limit exceeded. Please wait a moment and try again.',
    };
  }

  // Overloaded/service unavailable errors (use 503, not non-standard 529)
  if (
    statusCode === 529 ||
    statusCode === 503 ||
    errorCode === 'overloaded_error' ||
    errorCode === 'api_error'
  ) {
    return {
      type: 'overloaded',
      status: 503,
      message: 'Claude API is temporarily unavailable. Please try again in a few moments.',
    };
  }

  // Timeout errors
  if (error.name === 'AbortError' || errorCode === 'timeout') {
    return {
      type: 'timeout',
      status: 504,
      message: 'Request timed out. The AI is processing a complex request. Please try again.',
    };
  }

  // Authentication errors
  if (statusCode === 401 || errorCode === 'authentication_error') {
    return {
      type: 'auth',
      status: 401,
      message: 'Authentication error. Please check API configuration.',
    };
  }

  // Default to internal server error - don't expose internal details
  return {
    type: 'internal',
    status: 500,
    message: 'An unexpected error occurred. Please try again.',
  };
}

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

  // Create AbortController for timeout protection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const { system, messages } = req.body;

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      clearTimeout(timeoutId);
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Messages array is required'
      });
    }

    // Server-controlled configuration
    const modelName = process.env.CLAUDE_MODEL || DEFAULT_CLAUDE_MODEL;
    const maxTokens = process.env.CLAUDE_MAX_TOKENS
      ? parseInt(process.env.CLAUDE_MAX_TOKENS, 10)
      : 16000;

    // Create Anthropic provider
    const anthropic = createAnthropic({
      apiKey: apiKey,
    });

    // Stream the response using Vercel AI SDK with timeout
    const result = await streamText({
      model: anthropic(modelName),
      system: system || '',
      messages: messages,
      maxTokens: maxTokens,
      // Temperature 0.3: Balances consistent scoring (lower = more deterministic)
      // with varied analysis text (higher = more creative). Used for all assessment tasks.
      temperature: 0.3,
      abortSignal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Return the stream response
    // The AI SDK handles setting up the proper streaming response headers
    return result.toTextStreamResponse();

  } catch (error) {
    clearTimeout(timeoutId);

    // Log full error details server-side for debugging
    console.error('Streaming proxy error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack,
    });

    // Classify and return user-safe error response
    const classified = classifyError(error);
    return res.status(classified.status).json({
      error: classified.message,
      type: classified.type,
    });
  }
}
