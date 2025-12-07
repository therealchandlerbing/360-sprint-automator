// ============================================
// PDF Generator V2 - HTML→Print Approach
// Zero dependencies, browser-native PDF generation
// ============================================

import { DIMENSIONS, getGateRecommendation, calculateOverallScore } from '../constants/expressPromptV2.js';

/**
 * Generate mini radar chart SVG for cover page
 */
function generateMiniRadar(scores, size = 120) {
  const center = size / 2;
  const maxRadius = size / 2 - 20;
  const angleStep = (2 * Math.PI) / DIMENSIONS.length;
  const startAngle = -Math.PI / 2;

  const getPoint = (index, value) => {
    const angle = startAngle + index * angleStep;
    const radius = (value / 5) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  const dataPoints = DIMENSIONS.map((dim, i) => {
    const point = getPoint(i, scores[dim.id] || 0);
    return `${point.x},${point.y}`;
  }).join(' ');

  return `
    <svg width="${size}" height="${size}">
      <polygon points="${dataPoints}" fill="rgba(59, 130, 246, 0.2)" stroke="#3B82F6" stroke-width="2" />
      ${DIMENSIONS.map((dim, i) => {
        const point = getPoint(i, scores[dim.id] || 0);
        return `<circle cx="${point.x}" cy="${point.y}" r="4" fill="${dim.color}" />`;
      }).join('')}
    </svg>
  `;
}

/**
 * Generate dimension page HTML
 */
function generateDimensionPage(dimension, data, pageNumber, totalPages) {
  const score = data.scores[dimension.id] || 0;
  const subScores = data.subScores?.[dimension.id] || {};
  const analysis = data.analysis?.[dimension.id] || {};
  const confidence = data.confidence?.[dimension.id];
  const dataQuality = data.dataQuality?.[dimension.id];
  const trend = data.trends?.[dimension.id];
  const meetsThreshold = score >= dimension.threshold;

  return `
    <div class="page dimension-page">
      <div class="page-header">
        <div class="page-header-left">
          <div class="logo-small">🎯</div>
          <span class="company-name">${data.companyName || 'Assessment'}</span>
        </div>
        <div class="page-header-right">
          <span class="page-number">Page ${pageNumber} of ${totalPages}</span>
        </div>
      </div>

      <div class="dimension-hero" style="background: linear-gradient(135deg, ${dimension.lightBg}, white);">
        <div class="dimension-hero-content">
          <div class="dimension-number" style="color: ${dimension.color};">0${DIMENSIONS.findIndex(d => d.id === dimension.id) + 1}</div>
          <div class="dimension-title-block">
            <h2 class="dimension-title" style="color: ${dimension.color};">${dimension.name}</h2>
            <p class="dimension-question">${dimension.question}</p>
          </div>
        </div>
        <div class="dimension-score-badge" style="background: ${meetsThreshold ? '#D1FAE5' : '#FEE2E2'}; border-color: ${meetsThreshold ? '#10B981' : '#EF4444'};">
          <div class="score-value" style="color: ${meetsThreshold ? '#059669' : '#DC2626'};">${score.toFixed(1)}</div>
          <div class="score-label">/5.0</div>
          <div class="threshold-status ${meetsThreshold ? 'passing' : 'failing'}">
            ${meetsThreshold ? '✓ Passing' : `✗ Below ${dimension.threshold}`}
          </div>
        </div>
      </div>

      <div class="meta-row">
        <div class="meta-item">
          <span class="meta-label">Weight</span>
          <span class="meta-value">${(dimension.weight * 100).toFixed(0)}%</span>
        </div>
        ${confidence ? `
        <div class="meta-item">
          <span class="meta-label">Confidence</span>
          <span class="meta-value">${confidence}/10</span>
        </div>
        ` : ''}
        ${dataQuality ? `
        <div class="meta-item">
          <span class="meta-label">Data Quality</span>
          <span class="meta-value">${dataQuality}/10</span>
        </div>
        ` : ''}
        ${trend ? `
        <div class="meta-item">
          <span class="meta-label">Trend</span>
          <span class="meta-value trend-${trend}">${trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️'} ${trend}</span>
        </div>
        ` : ''}
      </div>

      <div class="sub-scores-section">
        <h3 class="section-title">Component Scores</h3>
        <div class="sub-scores-grid">
          ${dimension.subDimensions.map(subDim => {
            const subScore = subScores[subDim.id] || 0;
            return `
              <div class="sub-score-item">
                <div class="sub-score-header">
                  <span class="sub-score-name">${subDim.name}</span>
                  <span class="sub-score-value" style="color: ${dimension.color};">${subScore.toFixed(1)}</span>
                </div>
                <div class="sub-score-bar">
                  <div class="sub-score-fill" style="width: ${(subScore / 5) * 100}%; background: ${dimension.color};"></div>
                </div>
                <div class="sub-score-description">${subDim.description}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="analysis-grid">
        <div class="analysis-column strengths">
          <h4 class="column-title"><span class="column-icon">✓</span> Strengths</h4>
          <ul class="analysis-list">
            ${(analysis.strengths || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="analysis-column risks">
          <h4 class="column-title"><span class="column-icon">⚠</span> Risks</h4>
          <ul class="analysis-list">
            ${(analysis.risks || []).map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
        <div class="analysis-column recommendations">
          <h4 class="column-title"><span class="column-icon">→</span> Actions</h4>
          <ul class="analysis-list">
            ${(analysis.recommendations || []).map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${analysis.timeline ? `
      <div class="timeline-section">
        <h3 class="section-title">Action Timeline</h3>
        <div class="timeline-grid">
          <div class="timeline-item t30">
            <div class="timeline-label">30 Days</div>
            <p class="timeline-content">${analysis.timeline['30day'] || ''}</p>
          </div>
          <div class="timeline-item t60">
            <div class="timeline-label">60 Days</div>
            <p class="timeline-content">${analysis.timeline['60day'] || ''}</p>
          </div>
          <div class="timeline-item t90">
            <div class="timeline-label">90 Days</div>
            <p class="timeline-content">${analysis.timeline['90day'] || ''}</p>
          </div>
        </div>
      </div>
      ` : ''}

      <div class="bottom-row">
        ${analysis.keyMetrics ? `
        <div class="metrics-section">
          <h4 class="mini-title">📊 Key Metrics to Track</h4>
          <ul class="metrics-list">
            ${(analysis.keyMetrics || []).map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        ${analysis.competitivePosition ? `
        <div class="competitive-section">
          <h4 class="mini-title">🎯 Competitive Position</h4>
          <p class="competitive-text">${analysis.competitivePosition}</p>
        </div>
        ` : ''}
      </div>

      <div class="page-footer">
        <span>360 Validation Sprint • VIANEO Framework Assessment</span>
        <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  `;
}

/**
 * Generate cross-dimensional analysis page
 */
function generateCrossDimensionalPage(data, pageNumber, totalPages) {
  const crossAnalysis = data.crossDimensionalAnalysis || {};

  return `
    <div class="page cross-dimensional-page">
      <div class="page-header">
        <div class="page-header-left">
          <div class="logo-small">🎯</div>
          <span class="company-name">${data.companyName || 'Assessment'}</span>
        </div>
        <div class="page-header-right">
          <span class="page-number">Page ${pageNumber} of ${totalPages}</span>
        </div>
      </div>

      <div class="cross-hero">
        <div class="cross-hero-content">
          <div class="cross-number">06</div>
          <div class="cross-title-block">
            <h2 class="cross-title">Cross-Dimensional Analysis</h2>
            <p class="cross-question">How do dimensions interact and influence each other?</p>
          </div>
        </div>
      </div>

      ${crossAnalysis.bottleneck ? `
      <div class="bottleneck-section">
        <h3 class="section-title-alert">⚠ Critical Bottleneck: ${DIMENSIONS.find(d => d.id === crossAnalysis.bottleneck.dimension)?.name || crossAnalysis.bottleneck.dimension}</h3>
        <div class="bottleneck-content">
          <div class="bottleneck-reason">
            <span class="bottleneck-label">Why:</span>
            <p>${crossAnalysis.bottleneck.reason || ''}</p>
          </div>
          <div class="bottleneck-impact">
            <span class="bottleneck-label">Impact:</span>
            <p>${crossAnalysis.bottleneck.impact || ''}</p>
          </div>
        </div>
      </div>
      ` : ''}

      <div class="cross-grid">
        <div class="cross-column synergies">
          <h3 class="cross-column-title"><span class="cross-icon synergy-icon">⚡</span> Synergies</h3>
          <p class="cross-column-subtitle">Dimensions that reinforce each other</p>
          <ul class="cross-list">
            ${(crossAnalysis.synergies || []).map(item => `<li class="synergy-item">${item}</li>`).join('')}
          </ul>
        </div>
        <div class="cross-column tradeoffs">
          <h3 class="cross-column-title"><span class="cross-icon tradeoff-icon">⚖</span> Tradeoffs</h3>
          <p class="cross-column-subtitle">Dimensions in tension</p>
          <ul class="cross-list">
            ${(crossAnalysis.tradeoffs || []).map(item => `<li class="tradeoff-item">${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="dependencies-section">
        <h3 class="section-title"><span class="dep-icon">🔗</span> Critical Dependencies</h3>
        <div class="dependencies-grid">
          ${(crossAnalysis.criticalDependencies || []).map(dep => `
            <div class="dependency-card">
              <p>${dep}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="page-footer">
        <span>360 Validation Sprint • VIANEO Framework Assessment</span>
        <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  `;
}

/**
 * Generate complete HTML report
 */
export function generateHTMLReport(assessmentData) {
  const overallScore = calculateOverallScore(assessmentData.scores);
  const gate = getGateRecommendation(overallScore);
  const assessmentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const confidenceLevel = assessmentData.confidenceLevel || 'Medium';

  const totalPages = DIMENSIONS.length + 2; // Cover + 5 dimensions + Cross-analysis

  // Generate all dimension pages
  const dimensionPages = DIMENSIONS.map((dim, index) =>
    generateDimensionPage(dim, assessmentData, index + 2, totalPages)
  ).join('');

  // Generate cross-dimensional page
  const crossPage = generateCrossDimensionalPage(assessmentData, totalPages, totalPages);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>360 Business Validation Report - ${assessmentData.companyName || 'Assessment'}</title>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 10px;
      line-height: 1.4;
      color: #1E293B;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm 18mm;
      page-break-after: always;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Cover Page */
    .cover-page {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .cover-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 40px;
    }

    .cover-logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .cover-brand {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .cover-title {
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 8px;
      line-height: 1.1;
    }

    .cover-subtitle {
      font-size: 16px;
      color: #94A3B8;
      margin-bottom: 40px;
    }

    .cover-company {
      font-size: 28px;
      font-weight: 700;
      color: #3B82F6;
      margin-bottom: 8px;
    }

    .cover-date {
      font-size: 14px;
      color: #64748B;
    }

    .cover-score-section {
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 24px;
      margin-top: 40px;
    }

    .cover-score-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 24px;
      align-items: center;
    }

    .cover-overall-score {
      text-align: center;
    }

    .cover-score-number {
      font-size: 64px;
      font-weight: 800;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-score-label {
      font-size: 12px;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cover-gate {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      margin-top: 8px;
    }

    .cover-gate-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .cover-confidence {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(16, 185, 129, 0.2);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .cover-dimensions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .cover-dim-item {
      text-align: center;
      padding: 8px 12px;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
    }

    .cover-dim-score {
      font-size: 24px;
      font-weight: 700;
    }

    .cover-dim-name {
      font-size: 10px;
      color: #94A3B8;
    }

    .cover-summary {
      margin-top: 16px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      border-left: 3px solid #3B82F6;
    }

    .cover-summary-text {
      font-size: 11px;
      color: #CBD5E1;
      line-height: 1.6;
    }

    .cover-actions-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }

    .cover-actions {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 14px 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cover-actions-title {
      font-size: 11px;
      font-weight: 700;
      color: #E2E8F0;
      margin-bottom: 10px;
    }

    .cover-actions-list {
      list-style: none;
      padding: 0;
      margin: 0;
      counter-reset: action-counter;
    }

    .cover-actions-list li {
      font-size: 10px;
      color: #CBD5E1;
      padding: 6px 0;
      padding-left: 20px;
      position: relative;
      line-height: 1.4;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      counter-increment: action-counter;
    }

    .cover-actions-list li:last-child {
      border-bottom: none;
    }

    .cover-actions-list li::before {
      content: counter(action-counter);
      position: absolute;
      left: 0;
      top: 6px;
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      border-radius: 50%;
      font-size: 9px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .cover-footer {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #64748B;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #E2E8F0;
    }

    .page-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-small {
      font-size: 18px;
    }

    .company-name {
      font-size: 12px;
      font-weight: 600;
      color: #1E293B;
    }

    .page-number {
      font-size: 10px;
      color: #64748B;
    }

    /* Dimension Page */
    .dimension-hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .dimension-hero-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .dimension-number {
      font-size: 48px;
      font-weight: 800;
      opacity: 0.3;
    }

    .dimension-title {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 4px;
    }

    .dimension-question {
      font-size: 12px;
      color: #64748B;
    }

    .dimension-score-badge {
      text-align: center;
      padding: 16px 24px;
      border-radius: 12px;
      border: 2px solid;
    }

    .score-value {
      font-size: 36px;
      font-weight: 800;
    }

    .score-label {
      font-size: 14px;
      color: #64748B;
    }

    .threshold-status {
      font-size: 10px;
      font-weight: 700;
      margin-top: 6px;
      padding: 4px 10px;
      border-radius: 4px;
    }

    .threshold-status.passing {
      background: #D1FAE5;
      color: #059669;
    }

    .threshold-status.failing {
      background: #FEE2E2;
      color: #DC2626;
    }

    /* Meta Row */
    .meta-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #F8FAFC;
      border-radius: 6px;
      border: 1px solid #E2E8F0;
    }

    .meta-label {
      font-size: 9px;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meta-value {
      font-size: 11px;
      font-weight: 700;
      color: #1E293B;
    }

    .trend-improving { color: #059669; }
    .trend-declining { color: #DC2626; }
    .trend-stable { color: #64748B; }

    /* Sub-Scores */
    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 12px;
    }

    .sub-scores-section {
      margin-bottom: 16px;
    }

    .sub-scores-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .sub-score-item {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 12px;
    }

    .sub-score-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .sub-score-name {
      font-size: 10px;
      font-weight: 600;
      color: #475569;
    }

    .sub-score-value {
      font-size: 14px;
      font-weight: 700;
    }

    .sub-score-bar {
      height: 4px;
      background: #E5E7EB;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 6px;
    }

    .sub-score-fill {
      height: 100%;
      border-radius: 2px;
    }

    .sub-score-description {
      font-size: 9px;
      color: #64748B;
    }

    /* Analysis Grid */
    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .analysis-column {
      padding: 14px;
      border-radius: 8px;
    }

    .analysis-column.strengths {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
    }

    .analysis-column.risks {
      background: #FEF2F2;
      border: 1px solid #FECACA;
    }

    .analysis-column.recommendations {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
    }

    .column-title {
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .strengths .column-title { color: #059669; }
    .risks .column-title { color: #DC2626; }
    .recommendations .column-title { color: #2563EB; }

    .analysis-list {
      list-style: none;
      padding: 0;
    }

    .analysis-list li {
      font-size: 9px;
      padding: 5px 0;
      padding-left: 12px;
      position: relative;
      line-height: 1.4;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .analysis-list li:last-child {
      border-bottom: none;
    }

    .analysis-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      font-size: 10px;
    }

    .strengths .analysis-list li { color: #065F46; }
    .strengths .analysis-list li::before { color: #10B981; }

    .risks .analysis-list li { color: #991B1B; }
    .risks .analysis-list li::before { color: #EF4444; }

    .recommendations .analysis-list li { color: #1E40AF; }
    .recommendations .analysis-list li::before { color: #3B82F6; }

    /* Timeline */
    .timeline-section {
      margin-bottom: 16px;
    }

    .timeline-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .timeline-item {
      padding: 12px;
      border-radius: 8px;
    }

    .timeline-item.t30 {
      background: linear-gradient(135deg, #FEF3C7, #FFFBEB);
      border: 1px solid #FDE68A;
    }

    .timeline-item.t60 {
      background: linear-gradient(135deg, #DBEAFE, #EFF6FF);
      border: 1px solid #BFDBFE;
    }

    .timeline-item.t90 {
      background: linear-gradient(135deg, #DCFCE7, #F0FDF4);
      border: 1px solid #BBF7D0;
    }

    .timeline-label {
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .t30 .timeline-label { color: #92400E; }
    .t60 .timeline-label { color: #1E40AF; }
    .t90 .timeline-label { color: #166534; }

    .timeline-content {
      font-size: 9px;
      line-height: 1.5;
    }

    .t30 .timeline-content { color: #78350F; }
    .t60 .timeline-content { color: #1E3A8A; }
    .t90 .timeline-content { color: #14532D; }

    /* Bottom Row */
    .bottom-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: auto;
    }

    .metrics-section, .competitive-section {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 12px;
    }

    .mini-title {
      font-size: 10px;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 8px;
    }

    .metrics-list {
      list-style: none;
      padding: 0;
    }

    .metrics-list li {
      font-size: 9px;
      color: #475569;
      padding: 4px 0;
      padding-left: 12px;
      position: relative;
    }

    .metrics-list li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #3B82F6;
    }

    .competitive-text {
      font-size: 9px;
      color: #475569;
      line-height: 1.5;
    }

    /* Page Footer */
    .page-footer {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94A3B8;
      padding-top: 12px;
      margin-top: 16px;
      border-top: 1px solid #E2E8F0;
    }

    /* Cross-Dimensional Page */
    .cross-dimensional-page {
      background: #F8FAFC;
    }

    .cross-hero {
      background: linear-gradient(135deg, #1E293B, #334155);
      color: white;
      padding: 20px 24px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .cross-hero-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .cross-number {
      font-size: 48px;
      font-weight: 800;
      opacity: 0.3;
      color: #3B82F6;
    }

    .cross-title {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 4px;
    }

    .cross-question {
      font-size: 12px;
      color: #94A3B8;
    }

    .bottleneck-section {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .section-title-alert {
      font-size: 12px;
      font-weight: 700;
      color: #991B1B;
      margin-bottom: 12px;
    }

    .bottleneck-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .bottleneck-reason, .bottleneck-impact {
      background: white;
      border-radius: 6px;
      padding: 10px 12px;
    }

    .bottleneck-label {
      font-size: 9px;
      font-weight: 700;
      color: #991B1B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 4px;
    }

    .bottleneck-reason p, .bottleneck-impact p {
      font-size: 10px;
      color: #7F1D1D;
      line-height: 1.5;
    }

    .cross-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .cross-column {
      border-radius: 10px;
      padding: 14px 16px;
    }

    .cross-column.synergies {
      background: linear-gradient(135deg, #ECFDF5, #F0FDF4);
      border: 1px solid #A7F3D0;
    }

    .cross-column.tradeoffs {
      background: linear-gradient(135deg, #FEF3C7, #FFFBEB);
      border: 1px solid #FDE68A;
    }

    .cross-column-title {
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .synergies .cross-column-title { color: #059669; }
    .tradeoffs .cross-column-title { color: #D97706; }

    .cross-column-subtitle {
      font-size: 9px;
      color: #64748B;
      margin-bottom: 10px;
    }

    .cross-list {
      list-style: none;
      padding: 0;
    }

    .cross-list li {
      font-size: 9px;
      padding: 6px 0;
      padding-left: 14px;
      position: relative;
      line-height: 1.4;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .cross-list li:last-child {
      border-bottom: none;
    }

    .cross-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      font-size: 10px;
    }

    .synergy-item { color: #065F46; }
    .synergy-item::before { color: #10B981; }

    .tradeoff-item { color: #92400E; }
    .tradeoff-item::before { color: #F59E0B; }

    .dependencies-section {
      margin-bottom: 16px;
    }

    .dependencies-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .dependency-card {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 10px 12px;
    }

    .dependency-card p {
      font-size: 9px;
      color: #475569;
      line-height: 1.5;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { page-break-after: always; }
      .page:last-child { page-break-after: avoid; }
      .print-banner { display: none !important; }
    }

    .print-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      color: white;
      padding: 16px 24px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .print-banner button {
      background: white;
      color: #2563EB;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      margin-left: 16px;
    }
  </style>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</head>
<body>
  <div class="print-banner">
    📄 Save as PDF: In the print dialog, select "Save as PDF" as the destination, then click Save.
    <button onclick="window.print()">Print Again</button>
  </div>

  <!-- Cover Page -->
  <div class="page cover-page">
    <div class="cover-header">
      <div class="cover-logo">🎯</div>
      <span class="cover-brand">360 Validation Sprint</span>
    </div>

    <div class="cover-main">
      <h1 class="cover-title">VIANEO Framework<br/>Assessment Report</h1>
      <p class="cover-subtitle">Comprehensive Venture Evaluation</p>

      <div class="cover-company">${assessmentData.companyName || 'Company Assessment'}</div>
      <div class="cover-date">${assessmentDate}</div>

      <div class="cover-score-section">
        <div class="cover-score-grid">
          <div class="cover-overall-score">
            <div class="cover-score-number">${overallScore.toFixed(0)}</div>
            <div class="cover-score-label">Overall Score</div>
            <div class="cover-gate-row">
              <div class="cover-gate" style="background: ${gate.bg}; color: ${gate.color};">
                ${gate.label}
              </div>
              <div class="cover-confidence">
                ${confidenceLevel} Confidence
              </div>
            </div>
          </div>
          <div>
            <div class="cover-dimensions">
              ${DIMENSIONS.map(dim => `
                <div class="cover-dim-item">
                  <div class="cover-dim-score" style="color: ${dim.color};">${(assessmentData.scores[dim.id] || 0).toFixed(1)}</div>
                  <div class="cover-dim-name">${dim.name}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        ${assessmentData.executiveSummary ? `
        <div class="cover-summary">
          <p class="cover-summary-text">${assessmentData.executiveSummary}</p>
        </div>
        ` : ''}

        ${(assessmentData.immediateActions && assessmentData.immediateActions.length > 0) || (assessmentData.topStrengths && assessmentData.topStrengths.length > 0) ? `
        <div class="cover-actions-section">
          ${assessmentData.immediateActions && assessmentData.immediateActions.length > 0 ? `
          <div class="cover-actions">
            <h4 class="cover-actions-title">⚡ Immediate Actions (30 Days)</h4>
            <ol class="cover-actions-list">
              ${assessmentData.immediateActions.slice(0, 3).map(action => `<li>${action}</li>`).join('')}
            </ol>
          </div>
          ` : ''}
          ${assessmentData.topStrengths && assessmentData.topStrengths.length > 0 ? `
          <div class="cover-actions">
            <h4 class="cover-actions-title">✓ Top Strengths</h4>
            <ol class="cover-actions-list">
              ${assessmentData.topStrengths.slice(0, 3).map(strength => `<li>${strength}</li>`).join('')}
            </ol>
          </div>
          ` : ''}
        </div>
        ` : ''}
      </div>
    </div>

    <div class="cover-footer">
      <span>Generated by 360 Social Impact Studios</span>
      <span>Powered by The Vianeo Methodology</span>
    </div>
  </div>

  ${dimensionPages}

  ${crossPage}
</body>
</html>
  `;

  return html;
}

/**
 * Download HTML report as file
 */
export function downloadHTMLReport(assessmentData) {
  const html = generateHTMLReport(assessmentData);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `360-Business-Validation-Report-${assessmentData.companyName || 'Assessment'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Open HTML report in print dialog
 */
export function printHTMLReport(assessmentData) {
  const html = generateHTMLReport(assessmentData);
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(html);
  printWindow.document.close();
}
