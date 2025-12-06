// ============================================
// HTML Template for Document Export
// Professional styling with print support
// ============================================

/**
 * Generates a complete HTML document with professional styling
 * @param {string} content - The HTML content for the body
 * @param {string} title - The document title
 * @param {string} projectName - The project name
 * @param {string} stepName - The step name
 * @param {string} date - The generation date
 * @returns {string} Complete HTML document
 */
export const HTML_TEMPLATE = (content, title, projectName, stepName, date) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --primary: #0A2540;
      --primary-light: #1A365D;
      --accent: #00A3B5;
      --text: #1A202C;
      --text-secondary: #4A5568;
      --text-muted: #718096;
      --border: #E2E8F0;
      --bg: #F7FAFC;
      --success: #10B981;
      --warning: #F59E0B;
      --error: #EF4444;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: var(--text);
      background: white;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px;
    }

    /* Header */
    .doc-header {
      border-bottom: 3px solid var(--accent);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }

    .doc-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .doc-meta {
      display: flex;
      gap: 24px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .doc-meta span { display: flex; align-items: center; gap: 6px; }

    /* Typography */
    h1 { font-size: 24px; font-weight: 700; color: var(--primary); margin: 32px 0 16px; border-bottom: 2px solid var(--border); padding-bottom: 8px; }
    h2 { font-size: 20px; font-weight: 600; color: var(--primary-light); margin: 28px 0 12px; }
    h3 { font-size: 16px; font-weight: 600; color: var(--text); margin: 24px 0 10px; }
    h4 { font-size: 14px; font-weight: 600; color: var(--text-secondary); margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 0.05em; }

    p { margin: 12px 0; color: var(--text); }

    strong { font-weight: 600; color: var(--primary); }

    /* Lists */
    ul, ol { margin: 12px 0; padding-left: 24px; }
    li { margin: 6px 0; }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 14px;
    }

    th {
      background: var(--primary);
      color: white;
      font-weight: 600;
      text-align: left;
      padding: 12px 16px;
    }

    td {
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }

    tr:nth-child(even) td { background: var(--bg); }
    tr:hover td { background: #EDF2F7; }

    /* Code blocks */
    code {
      font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
      font-size: 13px;
      background: var(--bg);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--primary);
    }

    pre {
      background: #1E293B;
      color: #E2E8F0;
      padding: 16px 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
    }

    pre code {
      background: none;
      padding: 0;
      color: inherit;
    }

    /* Badges and Tags */
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-validated { background: #D1FAE5; color: #059669; }
    .badge-assumed { background: #FEF3C7; color: #D97706; }
    .badge-insufficient { background: #FEE2E2; color: #DC2626; }

    /* Status indicators */
    .status-favorable { color: var(--success); }
    .status-neutral { color: var(--warning); }
    .status-unfavorable { color: var(--error); }

    /* Score displays */
    .score-box {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
    }

    .score-exceptional { background: #D1FAE5; color: #059669; }
    .score-strong { background: #D1FAE5; color: #047857; }
    .score-adequate { background: #FEF3C7; color: #D97706; }
    .score-concern { background: #FFEDD5; color: #EA580C; }
    .score-critical { background: #FEE2E2; color: #DC2626; }

    /* Blockquotes */
    blockquote {
      border-left: 4px solid var(--accent);
      padding-left: 16px;
      margin: 16px 0;
      color: var(--text-secondary);
      font-style: italic;
    }

    /* Horizontal rules */
    hr {
      border: none;
      border-top: 2px solid var(--border);
      margin: 32px 0;
    }

    /* Print styles */
    @media print {
      body { padding: 20px; max-width: none; }
      .doc-header { page-break-after: avoid; }
      h1, h2, h3 { page-break-after: avoid; }
      table, pre { page-break-inside: avoid; }
    }

    /* Footer */
    .doc-footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 2px solid var(--border);
      font-size: 12px;
      color: var(--text-muted);
      text-align: center;
    }
  </style>
</head>
<body>
  <header class="doc-header">
    <h1>${projectName}: ${stepName}</h1>
    <div class="doc-meta">
      <span>${date}</span>
      <span>VIANEO Framework</span>
      <span>Sprint Automator</span>
    </div>
  </header>

  <main class="doc-content">
    ${content}
  </main>

  <footer class="doc-footer">
    Generated by VIANEO Sprint Automator | ${new Date().toISOString().split('T')[0]}
  </footer>
</body>
</html>`;
