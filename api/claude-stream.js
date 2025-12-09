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

    // Server-controlled configuration
    const modelName = process.env.CLAUDE_MODEL || DEFAULT_CLAUDE_MODEL;
    const maxTokens = process.env.CLAUDE_MAX_TOKENS
      ? parseInt(process.env.CLAUDE_MAX_TOKENS, 10)
      : 16000;

    // Create Anthropic provider
    const anthropic = createAnthropic({
      apiKey: apiKey,
    });

    // Stream the response using Vercel AI SDK
    const result = await streamText({
      model: anthropic(modelName),
      system: system || '',
      messages: messages,
      maxTokens: maxTokens,
    });

    // Return the stream response
    // The AI SDK handles setting up the proper streaming response headers
    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Streaming proxy error:', error);

    // Handle specific Anthropic API errors
    if (error.message?.includes('rate_limit')) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a moment and try again.',
        details: { message: error.message },
      });
    }

    if (error.message?.includes('overloaded')) {
      return res.status(529).json({
        error: 'Claude API is overloaded. Please try again in a few moments.',
        details: { message: error.message },
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
