// ============================================
// Markdown to HTML Converter
// Lightweight, no dependencies
// ============================================

/**
 * Converts markdown text to HTML
 * Handles: headers, bold, italic, code blocks, tables, lists, blockquotes
 * @param {string} markdown - The markdown text to convert
 * @returns {string} HTML string
 */
export const markdownToHtml = (markdown) => {
  if (!markdown) return '';

  let html = markdown
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Code blocks (must be before other processing)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')

    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')

    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    .replace(/^\*\*\*$/gm, '<hr>')

    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

    // Evidence badges
    .replace(/\[VALIDATED\]/g, '<span class="badge badge-validated">VALIDATED</span>')
    .replace(/\[ASSUMED\]/g, '<span class="badge badge-assumed">ASSUMED</span>')
    .replace(/\[INSUFFICIENT DATA\]/g, '<span class="badge badge-insufficient">INSUFFICIENT DATA</span>')

    // Status indicators
    .replace(/🟢/g, '<span class="status-favorable">🟢</span>')
    .replace(/🟡/g, '<span class="status-neutral">🟡</span>')
    .replace(/🔴/g, '<span class="status-unfavorable">🔴</span>')

    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Tables (simplified parser)
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, headerRow, bodyRows) => {
    const headers = headerRow.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
    const rows = bodyRows.trim().split('<br>').filter(r => r.includes('|')).map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Unordered lists
  html = html.replace(/(?:^|<br>)- (.+?)(?=<br>-|<br><br>|<\/p>|$)/g, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/(?:^|<br>)\d+\. (.+?)(?=<br>\d+\.|<br><br>|<\/p>|$)/g, '<li>$1</li>');

  // Wrap in paragraphs
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-4]>)/g, '$1');
  html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');

  return html;
};
