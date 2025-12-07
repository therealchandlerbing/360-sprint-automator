// ============================================
// Document Extraction API Endpoint
// Extracts business information from uploaded documents
// ============================================

import Anthropic from '@anthropic-ai/sdk';

export const config = {
  maxDuration: 120, // 2 minutes for document extraction
};

const DEFAULT_CLAUDE_MODEL = 'claude-sonnet-4-20250514';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { file, fileName, fileType } = req.body;

  // Validate required fields
  if (!file || !fileName || !fileType) {
    return res.status(400).json({ error: 'Missing required fields: file, fileName, fileType' });
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.ms-powerpoint',
    'text/plain',
    'text/markdown',
    'text/x-markdown'
  ];

  if (!allowedTypes.includes(fileType) && !fileName.match(/\.(pdf|docx|doc|pptx|ppt|md|markdown|txt)$/i)) {
    return res.status(400).json({
      error: 'Unsupported file type. Please upload PDF, DOCX, PPTX, or Markdown files.'
    });
  }

  // Validate file size (10MB max)
  try {
    const fileSize = Buffer.from(file, 'base64').length;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (fileSize > maxSize) {
      return res.status(400).json({
        error: `File too large (${(fileSize / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB.`
      });
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid file data' });
  }

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Determine if file is text-based (markdown/txt) or binary (pdf/docx/pptx)
    const isTextBased = fileType.includes('text') || fileType.includes('markdown') ||
                        fileName.match(/\.(md|markdown|txt)$/i);

    let messageContent;

    if (isTextBased) {
      // For text-based files, decode and send as text
      const textContent = Buffer.from(file, 'base64').toString('utf-8');

      messageContent = [
        {
          type: "text",
          text: `Here is a markdown/text document containing business information:

---
${textContent}
---

Extract all relevant business information from this document for a VIANEO Framework assessment. Structure the extracted information into these categories:

1. **Company Name**: The name of the company/venture
2. **Tagline**: Brief description of what they do
3. **Problem Statement**: What problem are they solving and for whom
4. **Solution**: Their proposed solution and what makes it unique
5. **Target Market**: Customer segments, market size, geography
6. **Business Model**: How they make money, pricing, revenue streams
7. **Traction & Validation**: Users, revenue, partnerships, pilots, testimonials
8. **Team**: Key team members and their experience
9. **Competition**: Competitors and competitive advantages
10. **Additional Context**: Any other relevant information

Format your response as a JSON object with these fields: companyName, tagline, problem, solution, targetMarket, businessModel, traction, team, competition, additionalContext

If information for a field is not found, include the field with an empty string. Be thorough in extracting all available information.`
        }
      ];
    } else {
      // For binary files (PDF, DOCX, PPTX, DOC, PPT), send as document
      const mediaType = fileType === 'application/pdf' ? 'application/pdf' :
                        fileName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                        fileName.endsWith('.doc') ? 'application/msword' :
                        fileName.endsWith('.pptx') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' :
                        fileName.endsWith('.ppt') ? 'application/vnd.ms-powerpoint' :
                        'application/octet-stream';

      messageContent = [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: mediaType,
            data: file
          }
        },
        {
          type: "text",
          text: `Extract all relevant business information from this document for a VIANEO Framework assessment. Structure the extracted information into these categories:

1. **Company Name**: The name of the company/venture
2. **Tagline**: Brief description of what they do
3. **Problem Statement**: What problem are they solving and for whom
4. **Solution**: Their proposed solution and what makes it unique
5. **Target Market**: Customer segments, market size, geography
6. **Business Model**: How they make money, pricing, revenue streams
7. **Traction & Validation**: Users, revenue, partnerships, pilots, testimonials
8. **Team**: Key team members and their experience
9. **Competition**: Competitors and competitive advantages
10. **Additional Context**: Any other relevant information

Format your response as a JSON object with these fields: companyName, tagline, problem, solution, targetMarket, businessModel, traction, team, competition, additionalContext

If information for a field is not found, include the field with an empty string. Be thorough in extracting all available information.`
        }
      ];
    }

    // Call Claude API
    const modelName = process.env.CLAUDE_MODEL || DEFAULT_CLAUDE_MODEL;
    const response = await client.messages.create({
      model: modelName,
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: messageContent
        }
      ]
    });

    // Extract text from response
    const extractedText = response.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

    // Parse JSON from response
    const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', extractedText);
      throw new Error('Failed to extract structured data from document');
    }

    const extractedData = JSON.parse(jsonMatch[0]);

    // Validate extracted data has required fields
    const requiredFields = ['companyName', 'problem', 'solution', 'targetMarket', 'businessModel', 'team'];
    const hasMinimalData = requiredFields.some(field => extractedData[field] && extractedData[field].length > 0);

    if (!hasMinimalData) {
      return res.status(200).json({
        success: true,
        data: extractedData,
        warning: 'Limited information could be extracted from the document. You may need to fill in additional details manually.'
      });
    }

    return res.status(200).json({
      success: true,
      data: extractedData
    });

  } catch (error) {
    console.error('Document extraction error:', error);

    // Handle specific error types
    if (error.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed. Please check server configuration.',
        details: 'Invalid API key'
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again in a few moments.',
        details: 'Too many requests'
      });
    }

    if (error.message && error.message.includes('JSON')) {
      return res.status(500).json({
        error: 'Failed to parse document content. The document may not contain structured business information.',
        details: error.message
      });
    }

    return res.status(500).json({
      error: 'Failed to process document. Please try again or use manual entry.',
      details: error.message || 'Unknown error'
    });
  }
}
