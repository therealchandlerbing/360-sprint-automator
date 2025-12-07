// ============================================
// Dashboard Generator Utility
// Generates HTML dashboard from assessment data
// ============================================

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeHtml = (text) => {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Safe JSON serialization for script context
 * @param {object} obj - Object to serialize
 * @returns {string} Safely serialized JSON
 */
const safeJsonStringify = (obj) => {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
};

/**
 * Generate HTML dashboard from assessment data
 * @param {object} assessmentData - The assessment data object
 * @param {string} projectNameOverride - Optional project name override
 * @returns {Blob} HTML blob ready for download or display
 */
export const generateDashboardHTML = (assessmentData, projectNameOverride) => {
  if (!assessmentData) {
    throw new Error('No assessment data available');
  }

  // Extract raw values
  const rawProjectName = projectNameOverride || assessmentData.metadata?.projectName || 'Assessment';
  const rawAssessmentDate = assessmentData.metadata?.assessmentDate || new Date().toISOString().split('T')[0];

  // Sanitize for HTML output (distinct names prevent confusion between raw/escaped)
  const escapedProjectName = escapeHtml(rawProjectName);
  const escapedAssessmentDate = escapeHtml(rawAssessmentDate);
  const recommendation = assessmentData.executiveSummary?.recommendation || 'N/A';
  const recommendationDisplay = escapeHtml(recommendation.replace('_', ' '));
  const investmentScore = assessmentData.executiveSummary?.investmentReadinessScore || '--';
  const overallScore = assessmentData.marketMaturity?.weightedOverall?.toFixed(1) || '--';

  // Determine recommendation color class (safe - no user input)
  const recommendationColorClass = recommendation === 'GO' ? 'text-green-600' :
    recommendation === 'CONDITIONAL_GO' ? 'text-yellow-600' : 'text-red-600';

  // Sanitize arrays
  const keyStrengths = (assessmentData.executiveSummary?.keyStrengths || [])
    .map(s => `<li class="flex items-center gap-2"><span class="text-green-500">✓</span>${escapeHtml(s)}</li>`)
    .join('');
  const criticalRisks = (assessmentData.executiveSummary?.criticalRisks || [])
    .map(r => `<li class="flex items-center gap-2"><span class="text-red-500">!</span>${escapeHtml(r)}</li>`)
    .join('');

  // Generate HTML dashboard
  const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>360 Business Validation Dashboard - ${escapedProjectName}</title>
  <!-- Note: Tailwind Play CDN used for standalone HTML dashboard. This is acceptable for
       offline/downloaded reports. For production web apps, use build-time Tailwind CSS. -->
  <script src="https://cdn.tailwindcss.com/3.4.1" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" integrity="sha384-BgkHqOx+R5MZaH4g/KbELKXhQCQM0HZ2u+V1r8q5OvfR6pT8HxL9V0FbHLn6Mj35" crossorigin="anonymous"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  </style>
</head>
<body class="bg-gray-100 min-h-screen">
  <header class="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
    <h1 class="text-2xl font-bold">360 Business Validation Dashboard</h1>
    <p class="text-gray-300">${escapedProjectName} | ${escapedAssessmentDate}</p>
  </header>

  <main class="container mx-auto p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold ${recommendationColorClass}">
          ${recommendationDisplay}
        </div>
        <div class="text-gray-500 uppercase text-sm mt-2">Recommendation</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold text-slate-800">${escapeHtml(investmentScore)}</div>
        <div class="text-gray-500 uppercase text-sm mt-2">Investment Readiness Score</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold text-slate-800">${escapeHtml(overallScore)}</div>
        <div class="text-gray-500 uppercase text-sm mt-2">Overall VIANEO Score</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">Diagnostic Scores</h2>
        <canvas id="diagnosticChart"></canvas>
      </div>
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">VIANEO Dimensions</h2>
        <canvas id="vianeoChart"></canvas>
      </div>
    </div>

    <div class="card p-6 mt-6">
      <h2 class="text-lg font-semibold mb-4">Key Strengths</h2>
      <ul class="space-y-2">
        ${keyStrengths}
      </ul>
    </div>

    <div class="card p-6 mt-6">
      <h2 class="text-lg font-semibold mb-4">Critical Risks</h2>
      <ul class="space-y-2">
        ${criticalRisks}
      </ul>
    </div>
  </main>

  <script>
    const data = ${safeJsonStringify(assessmentData)};

    // Diagnostic Chart
    const diagCtx = document.getElementById('diagnosticChart').getContext('2d');
    new Chart(diagCtx, {
      type: 'bar',
      data: {
        labels: ['Team', 'Technology', 'Management', 'Commercial'],
        datasets: [{
          label: 'Score',
          data: [
            data.diagnosticAssessment?.team?.score || 0,
            data.diagnosticAssessment?.technology?.score || 0,
            data.diagnosticAssessment?.management?.score || 0,
            data.diagnosticAssessment?.commercial?.score || 0
          ],
          backgroundColor: ['#0A2540', '#0D5A66', '#1E6B4F', '#7C3AED']
        }]
      },
      options: {
        scales: { y: { beginAtZero: true, max: 5 } },
        plugins: { legend: { display: false } }
      }
    });

    // VIANEO Radar Chart
    const vianeoCtx = document.getElementById('vianeoChart').getContext('2d');
    new Chart(vianeoCtx, {
      type: 'radar',
      data: {
        labels: ['Legitimacy', 'Desirability', 'Acceptability', 'Feasibility', 'Viability'],
        datasets: [{
          label: 'Score',
          data: [
            data.marketMaturity?.legitimacy?.score || 0,
            data.marketMaturity?.desirability?.score || 0,
            data.marketMaturity?.acceptability?.score || 0,
            data.marketMaturity?.feasibility?.score || 0,
            data.marketMaturity?.viability?.score || 0
          ],
          borderColor: '#00A3B5',
          backgroundColor: 'rgba(0, 163, 181, 0.2)'
        }, {
          label: 'Threshold',
          data: [3.0, 3.5, 3.0, 3.0, 3.0],
          borderColor: '#F59E0B',
          borderDash: [5, 5],
          backgroundColor: 'transparent'
        }]
      },
      options: {
        scales: { r: { beginAtZero: true, max: 5 } }
      }
    });
  </script>
</body>
</html>`;

  return new Blob([dashboardHTML], { type: 'text/html' });
};

/**
 * Format date as dd.mm.yy
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDateForFilename = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};

/**
 * Generate dashboard filename
 * Format: [ProjectName]_Dashboard_[dd.mm.yy].html
 * @param {string} projectName - Project name
 * @returns {string} Filename for dashboard
 */
export const generateDashboardFilename = (projectName) => {
  const safeName = (projectName || 'Assessment')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_');
  const dateStr = formatDateForFilename();
  return `${safeName}_Dashboard_${dateStr}.html`;
};
