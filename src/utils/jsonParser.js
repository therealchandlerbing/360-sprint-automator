// ============================================
// JSON Parser Utility
// Robust JSON parsing for LLM responses
// ============================================

/**
 * Parse JSON from LLM response text
 * Handles markdown code blocks and recovers from common formatting issues
 *
 * @param {string} responseText - Raw text response from LLM
 * @returns {object} Parsed JSON object
 * @throws {Error} If JSON cannot be parsed
 */
export const parseLLMJson = (responseText) => {
  if (!responseText || typeof responseText !== 'string') {
    throw new Error('Invalid response: empty or non-string input');
  }

  let jsonStr = responseText.trim();

  // Strategy 1: Try to extract JSON from markdown code blocks
  // Handles ```json, ```, and variations with extra whitespace
  const codeBlockPatterns = [
    /```(?:json)?\s*([\s\S]*?)```/,  // Standard markdown code block
    /```\s*\n?([\s\S]*?)\n?```/,     // Code block with newlines
  ];

  for (const pattern of codeBlockPatterns) {
    const match = responseText.match(pattern);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch {
        // Continue to next strategy
      }
    }
  }

  // Strategy 2: Try parsing the entire response as JSON
  try {
    return JSON.parse(jsonStr);
  } catch {
    // Continue to next strategy
  }

  // Strategy 3: Find first { and last } to extract JSON object
  const jsonStart = responseText.indexOf('{');
  const jsonEnd = responseText.lastIndexOf('}');

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    try {
      const extracted = responseText.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(extracted);
    } catch {
      // Continue to next strategy
    }
  }

  // Strategy 4: Find first [ and last ] to extract JSON array
  const arrayStart = responseText.indexOf('[');
  const arrayEnd = responseText.lastIndexOf(']');

  if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
    // Only use array extraction if there's no object, or array comes first
    if (jsonStart === -1 || arrayStart < jsonStart) {
      try {
        const extracted = responseText.substring(arrayStart, arrayEnd + 1);
        return JSON.parse(extracted);
      } catch {
        // Continue to error
      }
    }
  }

  // Strategy 5: Attempt basic repairs
  try {
    // Remove common prefixes LLMs add
    const prefixPatterns = [
      /^Here(?:'s| is) the (?:JSON|response|output)[:\s]*/i,
      /^The (?:JSON|response|output) is[:\s]*/i,
      /^```(?:json)?\s*/,
    ];

    let cleanedText = responseText;
    for (const pattern of prefixPatterns) {
      cleanedText = cleanedText.replace(pattern, '');
    }

    // Remove trailing markdown if present
    cleanedText = cleanedText.replace(/```\s*$/, '').trim();

    if (cleanedText.startsWith('{') || cleanedText.startsWith('[')) {
      return JSON.parse(cleanedText);
    }
  } catch {
    // Fall through to error
  }

  throw new Error('Failed to parse JSON from LLM response. The response was not in the expected JSON format.');
};

/**
 * Extract text content from Claude API response
 * @param {object} data - Claude API response object
 * @returns {string} Concatenated text content
 */
export const extractResponseText = (data) => {
  if (!data?.content || !Array.isArray(data.content)) {
    throw new Error('Invalid API response structure');
  }

  return data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n');
};
