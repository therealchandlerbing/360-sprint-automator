// ============================================
// Report Charts - Chart.js Chart Generators
// 360 Business Validation Report Template
// Generates static PNG images for DOCX embedding
// ============================================

import Chart from 'chart.js/auto';
import { CHART_COLORS, DIMENSION_CONFIG, GAUGE_ZONES } from './reportStyles.js';

// ============================================
// Chart Generation Utilities
// ============================================

/**
 * Create an off-screen canvas for chart rendering
 */
function createCanvas(width, height, scaleFactor = 2) {
  const canvas = document.createElement('canvas');
  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  return canvas;
}

/**
 * Extract base64 PNG data from canvas
 */
function extractBase64(canvas) {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  // Remove the data:image/png;base64, prefix
  return dataUrl.split(',')[1];
}

/**
 * Clean up canvas after chart generation
 */
function cleanupCanvas(canvas, chart) {
  if (chart) {
    chart.destroy();
  }
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
  }
}

/**
 * Wait for chart animation to complete (or skip if disabled)
 */
function waitForChart(chart) {
  return new Promise((resolve) => {
    // Give a small delay for any remaining rendering
    setTimeout(resolve, 100);
  });
}

// ============================================
// Radar Chart - 5-Dimension Market Maturity
// ============================================

/**
 * Generate a 5-dimension radar chart for market maturity assessment
 * @param {Object} data - Market maturity scores { legitimacy, desirability, acceptability, feasibility, viability }
 * @param {Object} options - Chart options
 * @returns {Promise<string>} - Base64 encoded PNG
 */
export async function generateRadarChart(data, options = {}) {
  const {
    width = 400,
    height = 400,
    showThreshold = true,
  } = options;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Scale context for retina rendering
  ctx.scale(2, 2);

  const labels = ['Legitimacy', 'Desirability', 'Acceptability', 'Feasibility', 'Viability'];
  const scores = [
    data.legitimacy?.score ?? data.legitimacy ?? 0,
    data.desirability?.score ?? data.desirability ?? 0,
    data.acceptability?.score ?? data.acceptability ?? 0,
    data.feasibility?.score ?? data.feasibility ?? 0,
    data.viability?.score ?? data.viability ?? 0,
  ];

  // Threshold line data (dimension-specific thresholds)
  const thresholds = [
    DIMENSION_CONFIG.legitimacy.threshold,
    DIMENSION_CONFIG.desirability.threshold,
    DIMENSION_CONFIG.acceptability.threshold,
    DIMENSION_CONFIG.feasibility.threshold,
    DIMENSION_CONFIG.viability.threshold,
  ];

  const datasets = [
    {
      label: 'Assessment Score',
      data: scores,
      backgroundColor: CHART_COLORS.primaryFill,
      borderColor: CHART_COLORS.primary,
      borderWidth: 2,
      pointBackgroundColor: CHART_COLORS.primary,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5,
    },
  ];

  if (showThreshold) {
    datasets.push({
      label: 'Threshold',
      data: thresholds,
      backgroundColor: 'transparent',
      borderColor: CHART_COLORS.threshold,
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false,
    });
  }

  const chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      animation: false,
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            font: { size: 10, family: 'Arial' },
            color: CHART_COLORS.labels,
            backdropColor: 'transparent',
          },
          grid: {
            color: CHART_COLORS.gridLines,
          },
          angleLines: {
            color: CHART_COLORS.gridLines,
          },
          pointLabels: {
            font: { size: 12, family: 'Arial', weight: 'bold' },
            color: CHART_COLORS.labels,
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 10, family: 'Arial' },
            color: CHART_COLORS.labels,
            usePointStyle: true,
            padding: 15,
          },
        },
        title: {
          display: false,
        },
      },
    },
  });

  await waitForChart(chart);
  const base64 = extractBase64(canvas);
  cleanupCanvas(canvas, chart);

  return base64;
}

// ============================================
// Bar Chart - 40Q Diagnostic Dimensions
// ============================================

/**
 * Generate a horizontal bar chart for 40Q diagnostic dimensions
 * @param {Object} data - Dimension scores { team, technology, management, commercial }
 * @param {Object} options - Chart options
 * @returns {Promise<string>} - Base64 encoded PNG
 */
export async function generateDimensionBarChart(data, options = {}) {
  const {
    width = 450,
    height = 200,
    showThreshold = true,
    threshold = 3.0,
  } = options;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  const labels = ['Team', 'Technology', 'Management', 'Commercial'];
  const scores = [
    data.team?.score ?? data.team ?? 0,
    data.technology?.score ?? data.technology ?? 0,
    data.management?.score ?? data.management ?? 0,
    data.commercial?.score ?? data.commercial ?? 0,
  ];

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Average Score',
          data: scores,
          backgroundColor: CHART_COLORS.dimensions.slice(0, 4),
          borderColor: CHART_COLORS.dimensions.slice(0, 4),
          borderWidth: 1,
          barThickness: 30,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: false,
      maintainAspectRatio: true,
      animation: false,
      scales: {
        x: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            font: { size: 10, family: 'Arial' },
            color: CHART_COLORS.labels,
          },
          grid: {
            color: CHART_COLORS.gridLines,
          },
        },
        y: {
          ticks: {
            font: { size: 11, family: 'Arial', weight: 'bold' },
            color: CHART_COLORS.labels,
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        annotation: showThreshold ? {
          annotations: {
            thresholdLine: {
              type: 'line',
              xMin: threshold,
              xMax: threshold,
              borderColor: '#10B981',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                display: true,
                content: `Threshold: ${threshold}`,
                position: 'end',
              },
            },
          },
        } : undefined,
      },
    },
  });

  await waitForChart(chart);
  const base64 = extractBase64(canvas);
  cleanupCanvas(canvas, chart);

  return base64;
}

// ============================================
// Gauge Chart - Investment Readiness Score
// ============================================

/**
 * Generate a semi-circular gauge chart for investment readiness
 * @param {number} score - Investment readiness score (0-100)
 * @param {Object} options - Chart options
 * @returns {Promise<string>} - Base64 encoded PNG
 */
export async function generateGaugeChart(score, options = {}) {
  const {
    width = 300,
    height = 180,
  } = options;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  const safeScore = Math.max(0, Math.min(100, score ?? 0));

  // Calculate gauge segments
  const segments = GAUGE_ZONES.map((zone) => ({
    value: zone.max - zone.min,
    color: `#${zone.color}`,
    label: zone.label,
  }));

  // Create doughnut chart with half rotation
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: segments.map((s) => s.label),
      datasets: [
        {
          data: segments.map((s) => s.value),
          backgroundColor: segments.map((s) => s.color),
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      animation: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
    plugins: [
      {
        id: 'gaugeNeedle',
        afterDraw: (chart) => {
          const { ctx, chartArea } = chart;
          const { width, height } = chartArea;
          const centerX = width / 2;
          const centerY = height;

          // Calculate needle angle (0-100 maps to 180-0 degrees)
          const angle = Math.PI - (safeScore / 100) * Math.PI;
          const needleLength = height * 0.75;

          // Draw needle
          ctx.save();
          ctx.translate(centerX, centerY);

          // Needle triangle
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(
            Math.cos(angle) * needleLength,
            -Math.sin(angle) * needleLength
          );
          ctx.lineTo(
            Math.cos(angle + 0.1) * (needleLength * 0.1),
            -Math.sin(angle + 0.1) * (needleLength * 0.1)
          );
          ctx.lineTo(
            Math.cos(angle - 0.1) * (needleLength * 0.1),
            -Math.sin(angle - 0.1) * (needleLength * 0.1)
          );
          ctx.closePath();
          ctx.fillStyle = '#0A2540';
          ctx.fill();

          // Center circle
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#0A2540';
          ctx.fill();

          // Score text
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#1A202C';
          ctx.textAlign = 'center';
          ctx.fillText(String(safeScore), 0, -20);

          ctx.restore();
        },
      },
    ],
  });

  await waitForChart(chart);
  const base64 = extractBase64(canvas);
  cleanupCanvas(canvas, chart);

  return base64;
}

// ============================================
// Pie Chart - Evidence Distribution
// ============================================

/**
 * Generate a pie/donut chart for evidence distribution
 * @param {Object} data - Evidence counts { VALIDATED, LIKELY, ASSUMED, UNVALIDATED, DISPUTED }
 * @param {Object} options - Chart options
 * @returns {Promise<string>} - Base64 encoded PNG
 */
export async function generateEvidencePieChart(data, options = {}) {
  const {
    width = 300,
    height = 300,
    donut = true,
  } = options;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  const labels = ['Validated', 'Likely', 'Assumed', 'Unvalidated', 'Disputed'];
  const values = [
    data.VALIDATED ?? data.validated ?? 0,
    data.LIKELY ?? data.likely ?? 0,
    data.ASSUMED ?? data.assumed ?? 0,
    data.UNVALIDATED ?? data.unvalidated ?? 0,
    data.DISPUTED ?? data.disputed ?? 0,
  ];

  const colors = [
    CHART_COLORS.evidence.VALIDATED,
    CHART_COLORS.evidence.LIKELY,
    CHART_COLORS.evidence.ASSUMED,
    CHART_COLORS.evidence.UNVALIDATED,
    CHART_COLORS.evidence.DISPUTED,
  ];

  // Filter out zero values
  const filteredData = labels.reduce(
    (acc, label, i) => {
      if (values[i] > 0) {
        acc.labels.push(label);
        acc.values.push(values[i]);
        acc.colors.push(colors[i]);
      }
      return acc;
    },
    { labels: [], values: [], colors: [] }
  );

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: filteredData.labels,
      datasets: [
        {
          data: filteredData.values,
          backgroundColor: filteredData.colors,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      animation: false,
      cutout: donut ? '50%' : 0,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: { size: 10, family: 'Arial' },
            color: CHART_COLORS.labels,
            usePointStyle: true,
            padding: 10,
            generateLabels: (chart) => {
              const data = chart.data;
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: 1,
                  hidden: false,
                  index: i,
                };
              });
            },
          },
        },
      },
    },
  });

  await waitForChart(chart);
  const base64 = extractBase64(canvas);
  cleanupCanvas(canvas, chart);

  return base64;
}

// ============================================
// Combined Score Comparison Chart
// ============================================

/**
 * Generate a combined bar chart comparing all major scores
 * @param {Object} data - Score data { viability, team, technology, etc. }
 * @param {Object} options - Chart options
 * @returns {Promise<string>} - Base64 encoded PNG
 */
export async function generateScoreComparisonChart(data, options = {}) {
  const {
    width = 500,
    height = 250,
  } = options;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  // Group scores by category
  const categories = [
    { label: 'Legitimacy', score: data.legitimacy ?? 0, color: CHART_COLORS.dimensions[0] },
    { label: 'Desirability', score: data.desirability ?? 0, color: CHART_COLORS.dimensions[1] },
    { label: 'Acceptability', score: data.acceptability ?? 0, color: CHART_COLORS.dimensions[2] },
    { label: 'Feasibility', score: data.feasibility ?? 0, color: CHART_COLORS.dimensions[3] },
    { label: 'Viability', score: data.viability ?? 0, color: CHART_COLORS.dimensions[4] },
  ];

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories.map((c) => c.label),
      datasets: [
        {
          label: 'Score',
          data: categories.map((c) => c.score),
          backgroundColor: categories.map((c) => c.color),
          borderColor: categories.map((c) => c.color),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      animation: false,
      scales: {
        y: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            font: { size: 10, family: 'Arial' },
            color: CHART_COLORS.labels,
          },
          grid: {
            color: CHART_COLORS.gridLines,
          },
        },
        x: {
          ticks: {
            font: { size: 10, family: 'Arial' },
            color: CHART_COLORS.labels,
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  await waitForChart(chart);
  const base64 = extractBase64(canvas);
  cleanupCanvas(canvas, chart);

  return base64;
}

// ============================================
// Chart Generation Manager
// ============================================

/**
 * Generate all charts for a report
 * @param {Object} assessmentData - Full assessment data
 * @returns {Promise<Object>} - Object containing all chart base64 data
 */
export async function generateAllCharts(assessmentData) {
  const charts = {};

  try {
    // Market Maturity Radar Chart
    if (assessmentData.marketMaturity) {
      charts.radarChart = await generateRadarChart(assessmentData.marketMaturity);
    }

    // 40Q Diagnostic Bar Chart
    if (assessmentData.diagnosticAssessment || assessmentData.diagnostic40Q) {
      const diagData = assessmentData.diagnosticAssessment || assessmentData.diagnostic40Q;
      charts.dimensionBarChart = await generateDimensionBarChart(diagData);
    }

    // Investment Readiness Gauge
    const investmentScore =
      assessmentData.investmentScore ??
      assessmentData.executiveSummary?.investmentReadinessScore ??
      assessmentData.viabilityAssessment?.investmentReadinessScore;
    if (investmentScore != null) {
      charts.gaugeChart = await generateGaugeChart(investmentScore);
    }

    // Evidence Distribution Pie Chart
    if (assessmentData.evidenceDistribution || assessmentData.diagnosticCommentary?.evidenceDistribution) {
      const evidenceData = assessmentData.evidenceDistribution ||
        assessmentData.diagnosticCommentary?.evidenceDistribution;
      charts.evidencePieChart = await generateEvidencePieChart(evidenceData);
    }

    // Score Comparison Chart (5 dimensions)
    if (assessmentData.marketMaturity) {
      const mm = assessmentData.marketMaturity;
      charts.scoreComparisonChart = await generateScoreComparisonChart({
        legitimacy: mm.legitimacy?.score ?? mm.legitimacy,
        desirability: mm.desirability?.score ?? mm.desirability,
        acceptability: mm.acceptability?.score ?? mm.acceptability,
        feasibility: mm.feasibility?.score ?? mm.feasibility,
        viability: mm.viability?.score ?? mm.viability,
      });
    }
  } catch (error) {
    console.error('Error generating charts:', error);
    // Continue without charts if generation fails
  }

  return charts;
}
