// ============================================
// Markdown to HTML Converter
// Uses marked library for robust parsing
// ============================================

import { marked } from 'marked';

// Configure marked for secure HTML output
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  headerIds: false, // Disable header IDs for cleaner output
  mangle: false, // Don't escape autolinked email addresses
});

/**
 * Post-process HTML to add custom badges and status indicators
 * @param {string} html - The HTML string to process
 * @returns {string} Processed HTML with custom elements
 */
const addCustomElements = (html) => {
  return html
    // Evidence badges
    .replace(/\[VALIDATED\]/g, '<span class="badge badge-validated">VALIDATED</span>')
    .replace(/\[ASSUMED\]/g, '<span class="badge badge-assumed">ASSUMED</span>')
    .replace(/\[INSUFFICIENT DATA\]/g, '<span class="badge badge-insufficient">INSUFFICIENT DATA</span>')

    // Status indicators
    .replace(/🟢/g, '<span class="status-favorable">🟢</span>')
    .replace(/🟡/g, '<span class="status-neutral">🟡</span>')
    .replace(/🔴/g, '<span class="status-unfavorable">🔴</span>');
};

/**
 * Converts markdown text to HTML
 * Uses marked library for robust parsing with custom post-processing
 * @param {string} markdown - The markdown text to convert
 * @returns {string} HTML string
 */
export const markdownToHtml = (markdown) => {
  if (!markdown) return '';

  try {
    // Parse markdown with marked
    const html = marked.parse(markdown);

    // Add custom elements (badges, status indicators)
    return addCustomElements(html);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    // Fallback: return escaped text
    return `<pre>${markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
  }
};
