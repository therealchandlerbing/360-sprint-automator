// ============================================
// Report Generator - Main Module
// 360 Business Validation Report Template
// Generates professional DOCX from assessment data
// ============================================

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  TableOfContents,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  WidthType,
  LevelFormat,
  convertInchesToTwip,
} from 'docx';

import {
  REPORT_COLORS,
  RECOMMENDATION_STYLES,
  TYPOGRAPHY,
  SPACING,
  TABLE_WIDTHS,
  DIMENSION_CONFIG,
  getPhaseColor,
  getStatusBadge,
  getThresholdStatus,
} from './reportStyles.js';

import {
  createTextRun,
  createParagraph,
  createDocumentTitle,
  createSectionHeader,
  createSubsectionHeader,
  createH3Header,
  createPageBreak,
  createSpacer,
  createEvidenceMarker,
  createParagraphWithEvidence,
  createScoreBadgeRun,
  createStatusBadgeRun,
  createThresholdIndicator,
  createRecommendationBadge,
  createScoreTable,
  createInfoTable,
  createTableCell,
  createHeaderCell,
  createBulletItem,
  createNumberedItem,
  createChartImage,
  generateReportFilename,
  generateReportId,
  formatScore,
  formatPercentage,
  truncateText,
  TABLE_BORDERS,
} from './reportHelpers.js';

import { generateAllCharts } from './reportCharts.js';

// ============================================
// Cover Page Section
// ============================================

function createCoverPage(data, reportId) {
  const metadata = data.metadata || {};
  const projectName = data.projectName || metadata.projectName || 'Project Assessment';
  const date = data.date || metadata.assessmentDate || new Date().toISOString().split('T')[0];
  const recommendation = data.recommendation || data.executiveSummary?.recommendation || 'PENDING';
  const investmentScore = data.investmentScore ?? data.executiveSummary?.investmentReadinessScore ?? null;

  return [
    // Top spacer
    createSpacer(2400, 0),

    // Logo placeholder text
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: '360 SOCIAL IMPACT STUDIOS',
          bold: true,
          size: 24,
          color: REPORT_COLORS.textMuted,
          font: 'Arial',
        }),
      ],
    }),

    // Main title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: '360 Business Validation',
          bold: true,
          size: 56,
          color: REPORT_COLORS.primary,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: 'Report',
          bold: true,
          size: 56,
          color: REPORT_COLORS.primary,
          font: 'Arial',
        }),
      ],
    }),

    // Project name box
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 600 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 8, color: REPORT_COLORS.primaryLight },
        bottom: { style: BorderStyle.SINGLE, size: 8, color: REPORT_COLORS.primaryLight },
      },
      children: [
        new TextRun({
          text: `  ${projectName}  `,
          bold: true,
          size: 40,
          color: REPORT_COLORS.primary,
          font: 'Arial',
        }),
      ],
    }),

    // Recommendation badge
    createSpacer(400, 200),
    createRecommendationBadge(recommendation, investmentScore),
    createSpacer(600, 0),

    // Metadata
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `Prepared: ${date}`,
          size: 22,
          color: REPORT_COLORS.textMuted,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `Report ID: ${reportId}`,
          size: 22,
          color: REPORT_COLORS.textMuted,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'Framework: VIANEO v3.0',
          size: 22,
          color: REPORT_COLORS.textMuted,
          font: 'Arial',
        }),
      ],
    }),

    // Confidential footer
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: REPORT_COLORS.border },
      },
      children: [
        new TextRun({
          text: 'CONFIDENTIAL',
          bold: true,
          size: 20,
          color: REPORT_COLORS.textMuted,
          font: 'Arial',
        }),
      ],
    }),

    createPageBreak(),
  ];
}

// ============================================
// Table of Contents Section
// ============================================

function createTableOfContentsPage() {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'Table of Contents',
          bold: true,
          size: TYPOGRAPHY.sectionHeader.size,
          color: REPORT_COLORS.primary,
          font: 'Arial',
        }),
      ],
    }),

    new TableOfContents('Table of Contents', {
      hyperlink: true,
      headingStyleRange: '1-3',
      stylesWithLevels: [
        { styleName: 'Heading1', level: 1 },
        { styleName: 'Heading2', level: 2 },
        { styleName: 'Heading3', level: 3 },
      ],
    }),

    createPageBreak(),
  ];
}

// ============================================
// Executive Summary Section
// ============================================

function createExecutiveSummary(data, charts) {
  const summary = data.executiveSummary || {};
  const marketMaturity = data.marketMaturity || {};
  const recommendation = data.recommendation || summary.recommendation || 'PENDING';
  const investmentScore = data.investmentScore ?? summary.investmentReadinessScore ?? null;
  const sections = [];

  sections.push(createSectionHeader('Executive Summary', 'Foundation', false));

  // Recommendation and Score row
  sections.push(createSubsectionHeader('Assessment Overview'));

  const recStyle = RECOMMENDATION_STYLES[recommendation] || RECOMMENDATION_STYLES.MAYBE;

  // Summary metrics table
  const overviewTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [TABLE_WIDTHS.half, TABLE_WIDTHS.half],
    rows: [
      new TableRow({
        children: [
          createTableCell([
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: 'RECOMMENDATION',
                  bold: true,
                  size: 18,
                  color: REPORT_COLORS.textMuted,
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: ` ${recStyle.label} `,
                  bold: true,
                  size: 32,
                  color: recStyle.text,
                  shading: { type: ShadingType.CLEAR, fill: recStyle.background },
                  font: 'Arial',
                }),
              ],
            }),
          ], { width: TABLE_WIDTHS.half }),
          createTableCell([
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: 'INVESTMENT READINESS',
                  bold: true,
                  size: 18,
                  color: REPORT_COLORS.textMuted,
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${investmentScore ?? '--'}/100`,
                  bold: true,
                  size: 32,
                  color: REPORT_COLORS.primary,
                  font: 'Arial',
                }),
              ],
            }),
          ], { width: TABLE_WIDTHS.half }),
        ],
      }),
    ],
  });
  sections.push(overviewTable);
  sections.push(createSpacer(200, 300));

  // Venture Snapshot
  sections.push(createSubsectionHeader('Venture Snapshot'));
  const brief = data.executiveBrief || data.companyOverview || {};

  const snapshotData = [
    { label: 'Company', value: brief.b1_overview?.companyName || brief.b1?.companyName || data.projectName || 'N/A' },
    { label: 'Stage', value: brief.maturityStage || brief.b6_traction?.developmentStage || 'N/A' },
    { label: 'Problem', value: truncateText(brief.b2_problem?.text || brief.b2 || 'N/A', 100) },
    { label: 'Solution', value: truncateText(brief.b3_solution?.text || brief.b3 || 'N/A', 100) },
    { label: 'Market', value: truncateText(brief.b4_market?.text || brief.b4 || 'N/A', 80) },
    { label: 'Model', value: truncateText(brief.b5_businessModel?.text || brief.b5 || 'N/A', 80) },
  ];

  sections.push(createInfoTable(snapshotData));
  sections.push(createSpacer(200, 300));

  // Scorecard Overview with chart
  sections.push(createSubsectionHeader('Scorecard Overview'));

  // Add radar chart if available
  if (charts?.radarChart) {
    sections.push(createChartImage(charts.radarChart, 350, 350, 'Market Maturity Radar Chart'));
  }

  // Dimension scores table
  const dimensions = ['legitimacy', 'desirability', 'acceptability', 'feasibility', 'viability'];
  const dimScores = dimensions.map((dim) => {
    const score = marketMaturity[dim]?.score ?? marketMaturity[dim] ?? 0;
    return `${dim.charAt(0).toUpperCase() + dim.slice(1)}: ${formatScore(score)}`;
  });

  sections.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: dimScores.join(' | '),
        size: 20,
        color: REPORT_COLORS.textSecondary,
        font: 'Arial',
      }),
    ],
  }));

  const weightedAvg = marketMaturity.weightedOverall ?? marketMaturity.weightedAverage ?? 0;
  sections.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({
        text: `Weighted Average: ${formatScore(weightedAvg, 2)} (Threshold: ≥3.2)`,
        bold: true,
        size: 22,
        color: weightedAvg >= 3.2 ? REPORT_COLORS.success : REPORT_COLORS.error,
        font: 'Arial',
      }),
    ],
  }));

  // Key Strengths
  const strengths = summary.keyStrengths || [];
  if (strengths.length > 0) {
    sections.push(createSubsectionHeader('Key Strengths'));
    strengths.slice(0, 3).forEach((strength) => {
      sections.push(createBulletItem(strength));
    });
    sections.push(createSpacer(100, 200));
  }

  // Critical Concerns
  const concerns = summary.criticalRisks || summary.criticalConcerns || [];
  if (concerns.length > 0) {
    sections.push(createSubsectionHeader('Critical Concerns'));
    concerns.slice(0, 3).forEach((concern) => {
      sections.push(createBulletItem(`⚠ ${concern}`, { color: REPORT_COLORS.error }));
    });
    sections.push(createSpacer(100, 200));
  }

  // Gate Decision
  sections.push(createSubsectionHeader('Gate Decision'));
  const decisionText = summary.synthesisNarrative || summary.gateDecision ||
    'Assessment complete. See detailed sections for full analysis.';
  sections.push(createParagraph(decisionText));

  sections.push(createPageBreak());

  return sections;
}

// ============================================
// Section 1: Executive Brief (Step 0)
// ============================================

function createExecutiveBriefSection(data) {
  const brief = data.executiveBrief || data.companyOverview || {};
  const sections = [];

  sections.push(createSectionHeader('1. Executive Brief', 'Foundation'));

  // Project Information Table
  sections.push(createSubsectionHeader('Project Information'));
  const projectInfo = [
    { label: 'Project', value: brief.b1_overview?.companyName || data.projectName || 'N/A' },
    { label: 'Date', value: data.date || new Date().toISOString().split('T')[0] },
    { label: 'Brief ID', value: `EB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}` },
    { label: 'Evaluator', value: 'VIANEO Sprint Automator' },
  ];
  sections.push(createInfoTable(projectInfo));
  sections.push(createSpacer(200, 300));

  // B1: Company Overview
  sections.push(createH3Header('B1: Company Overview'));
  const b1 = brief.b1_overview || {};
  if (b1.companyName || b1.text) {
    const b1Text = b1.text || `${b1.companyName || ''} | Founded ${b1.founded || 'N/A'} | ${b1.location || 'N/A'} | ${b1.legalStructure || 'N/A'}`;
    sections.push(createParagraph(truncateText(b1Text, 150)));
  }

  // B2: Problem Statement
  sections.push(createH3Header('B2: Problem Statement'));
  const b2 = brief.b2_problem || {};
  sections.push(createParagraphWithEvidence(
    truncateText(b2.text || brief.b2 || 'N/A', 300),
    b2.evidenceLevel || 'ASSUMED'
  ));

  // B3: Solution Description
  sections.push(createH3Header('B3: Solution Description'));
  const b3 = brief.b3_solution || {};
  sections.push(createParagraph(truncateText(b3.text || brief.b3 || 'N/A', 300)));

  // B4: Target Market
  sections.push(createH3Header('B4: Target Market'));
  const b4 = brief.b4_market || {};
  const b4Text = b4.text || `Users: ${b4.primaryUsers || 'N/A'}. Buyers: ${b4.primaryBuyers || 'N/A'}.`;
  sections.push(createParagraph(truncateText(b4Text, 300)));

  // B5: Business Model
  sections.push(createH3Header('B5: Business Model'));
  const b5 = brief.b5_businessModel || {};
  sections.push(createParagraph(truncateText(b5.text || brief.b5 || 'N/A', 300)));

  // B6: Traction & Status
  sections.push(createH3Header('B6: Traction & Status'));
  const b6 = brief.b6_traction || {};
  sections.push(createParagraphWithEvidence(
    truncateText(b6.text || brief.b6 || 'N/A', 300),
    b6.evidenceLevel || 'ASSUMED'
  ));

  // B7: Team Summary
  sections.push(createH3Header('B7: Team Summary'));
  const b7 = brief.b7_team || {};
  sections.push(createParagraph(truncateText(b7.text || brief.b7 || 'N/A', 200)));

  // Maturity Classification
  sections.push(createSubsectionHeader('Maturity Classification'));
  const maturityTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell('Stage', { width: TABLE_WIDTHS.third }),
          createHeaderCell('TRL Rating', { width: TABLE_WIDTHS.third }),
          createHeaderCell('Justification', { width: TABLE_WIDTHS.third }),
        ],
      }),
      new TableRow({
        children: [
          createTableCell(brief.maturityStage || 'N/A', { width: TABLE_WIDTHS.third, alignment: AlignmentType.CENTER }),
          createTableCell(String(brief.trlLevel || brief.trl || 'N/A'), { width: TABLE_WIDTHS.third, alignment: AlignmentType.CENTER }),
          createTableCell(brief.trlJustification || 'N/A', { width: TABLE_WIDTHS.third }),
        ],
      }),
    ],
  });
  sections.push(maturityTable);

  sections.push(createPageBreak());

  return sections;
}

// ============================================
// Section 2: 40-Question Diagnostic (Step 2)
// ============================================

function createDiagnosticSection(data, charts) {
  const diagnostic = data.diagnostic40Q || data.diagnosticAssessment || {};
  const sections = [];

  sections.push(createSectionHeader('2. 40-Question Diagnostic', 'Foundation'));

  // Dimension Summary with chart
  sections.push(createSubsectionHeader('Dimension Summary'));

  if (charts?.dimensionBarChart) {
    sections.push(createChartImage(charts.dimensionBarChart, 400, 180, '40Q Diagnostic Dimension Scores'));
  }

  // Summary table
  const dimensions = ['team', 'technology', 'management', 'commercial'];
  const summaryRows = dimensions.map((dim) => {
    const d = diagnostic[dim] || {};
    const score = d.score ?? d.average ?? 0;
    const statusBadge = getStatusBadge(score);
    const redFlags = d.redFlags ?? d.criticalCount ?? 0;

    return [
      { content: dim.charAt(0).toUpperCase() + dim.slice(1), bold: true },
      formatScore(score),
      { content: statusBadge.label, shading: statusBadge.background, color: statusBadge.text },
      `${redFlags} critical`,
    ];
  });

  // Add overall row
  const overallScore = diagnostic.overallScore ?? diagnostic.overall ?? 0;
  const overallStatus = getStatusBadge(overallScore);
  summaryRows.push([
    { content: 'OVERALL', bold: true },
    { content: formatScore(overallScore), bold: true },
    { content: overallStatus.label, shading: overallStatus.background, color: overallStatus.text, bold: true },
    '',
  ]);

  sections.push(createScoreTable(
    ['Dimension', 'Avg Score', 'Status', 'Red Flags'],
    summaryRows,
    { phase: 'Foundation', columnWidths: [2500, 1500, 1500, 2000] }
  ));
  sections.push(createSpacer(200, 300));

  // Individual dimension details
  dimensions.forEach((dim) => {
    const d = diagnostic[dim] || {};
    const questions = d.questions || d.items || [];

    if (questions.length > 0) {
      sections.push(createH3Header(`${dim.charAt(0).toUpperCase() + dim.slice(1)} Dimension`));

      const questionRows = questions.map((q, i) => {
        const qScore = q.score ?? q.rating ?? 0;
        const badge = getStatusBadge(qScore);
        return [
          `${dim.charAt(0).toUpperCase()}${i + 1}`,
          q.question || q.text || `Question ${i + 1}`,
          { content: formatScore(qScore), shading: badge.background, color: badge.text },
          q.evidence || q.notes || '',
        ];
      });

      sections.push(createScoreTable(
        ['ID', 'Question', 'Score', 'Evidence'],
        questionRows.slice(0, 10), // Limit to 10 questions per dimension
        { phase: 'Foundation', columnWidths: [600, 4000, 1000, 3000] }
      ));
      sections.push(createSpacer(100, 200));
    }
  });

  // Red Flag Register
  const totalRedFlags = diagnostic.totalRedFlags ?? 0;
  if (totalRedFlags > 0) {
    sections.push(createSubsectionHeader('Red Flag Register'));
    sections.push(new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Total Red Flags Identified: ${totalRedFlags}`,
          bold: true,
          size: 22,
          color: REPORT_COLORS.error,
          font: 'Arial',
        }),
      ],
    }));

    const redFlagList = diagnostic.redFlagList || [];
    redFlagList.slice(0, 5).forEach((flag) => {
      sections.push(createBulletItem(`⚠ ${flag.question || flag}: Score ${flag.score || 'N/A'}`, { color: REPORT_COLORS.error }));
    });
  }

  sections.push(createPageBreak());

  return sections;
}

// ============================================
// Section 3: Market Maturity Assessment (Step 3)
// ============================================

function createMarketMaturitySection(data, charts) {
  const mm = data.marketMaturity || {};
  const sections = [];

  sections.push(createSectionHeader('3. Market Maturity Assessment', 'Foundation'));

  // 5-Dimension Scorecard with radar chart
  sections.push(createSubsectionHeader('5-Dimension Scorecard'));

  if (charts?.radarChart) {
    sections.push(createChartImage(charts.radarChart, 350, 350, '5-Dimension Radar Chart'));
  }

  // Dimension scores table
  const dimensions = [
    { key: 'legitimacy', label: 'Legitimacy', weight: 0.15, threshold: 3.0 },
    { key: 'desirability', label: 'Desirability', weight: 0.25, threshold: 3.5, priority: true },
    { key: 'acceptability', label: 'Acceptability', weight: 0.20, threshold: 3.0 },
    { key: 'feasibility', label: 'Feasibility', weight: 0.20, threshold: 3.0 },
    { key: 'viability', label: 'Viability', weight: 0.20, threshold: 3.0 },
  ];

  const dimRows = dimensions.map((dim) => {
    const d = mm[dim.key] || {};
    const score = d.score ?? mm[dim.key] ?? 0;
    const threshold = d.threshold ?? dim.threshold;
    const status = getThresholdStatus(score, threshold);
    const meetsThreshold = score >= threshold;

    return [
      { content: dim.label + (dim.priority ? ' ⭐' : ''), bold: true },
      formatPercentage(dim.weight),
      formatScore(score),
      `≥${threshold.toFixed(1)}`,
      { content: meetsThreshold ? '✓ MEETS' : '✗ BELOW', color: meetsThreshold ? REPORT_COLORS.success : REPORT_COLORS.error },
    ];
  });

  // Add weighted average row
  const weightedAvg = mm.weightedOverall ?? mm.weightedAverage ?? 0;
  const overallMeets = weightedAvg >= 3.2;
  dimRows.push([
    { content: 'WEIGHTED AVG', bold: true },
    { content: '100%', bold: true },
    { content: formatScore(weightedAvg, 2), bold: true },
    { content: '≥3.2', bold: true },
    { content: overallMeets ? '✓ MEETS' : '✗ BELOW', bold: true, color: overallMeets ? REPORT_COLORS.success : REPORT_COLORS.error },
  ]);

  sections.push(createScoreTable(
    ['Dimension', 'Weight', 'Score', 'Threshold', 'Status'],
    dimRows,
    { phase: 'Foundation', columnWidths: [2200, 1200, 1200, 1200, 1500] }
  ));
  sections.push(createSpacer(200, 400));

  // Dimension details
  dimensions.forEach((dim) => {
    const d = mm[dim.key] || {};
    sections.push(createH3Header(`${dim.label} (${formatPercentage(dim.weight)} weight)`));

    const description = d.description || getDimensionDescription(dim.key);
    sections.push(new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: description,
          italic: true,
          size: 20,
          color: REPORT_COLORS.textSecondary,
          font: 'Arial',
        }),
      ],
    }));

    const assessmentPoints = d.assessmentPoints || d.items || [];
    assessmentPoints.slice(0, 4).forEach((point) => {
      sections.push(createBulletItem(typeof point === 'string' ? point : point.text || point.assessment));
    });
    sections.push(createSpacer(100, 200));
  });

  // Gate Decision
  sections.push(createSubsectionHeader('Gate Decision'));
  const decision = mm.decision || mm.gateDecision || (overallMeets ? 'GO' : 'HOLD');
  const decisionStyle = RECOMMENDATION_STYLES[decision] || RECOMMENDATION_STYLES.MAYBE;

  sections.push(new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: `Decision: `,
        bold: true,
        size: 24,
        color: REPORT_COLORS.textPrimary,
        font: 'Arial',
      }),
      new TextRun({
        text: ` ${decisionStyle.label} `,
        bold: true,
        size: 24,
        color: decisionStyle.text,
        shading: { type: ShadingType.CLEAR, fill: decisionStyle.background },
        font: 'Arial',
      }),
    ],
  }));

  const rationale = mm.decisionRationale || mm.rationale || 'Based on weighted dimension scores against thresholds.';
  sections.push(createParagraph(rationale));

  sections.push(createPageBreak());

  return sections;
}

function getDimensionDescription(dimension) {
  const descriptions = {
    legitimacy: 'Is there a real problem worth solving?',
    desirability: 'Do target users want this solution?',
    acceptability: 'Will stakeholders accept and adopt this?',
    feasibility: 'Can the team execute this solution?',
    viability: 'Is the business model sustainable?',
  };
  return descriptions[dimension] || '';
}

// ============================================
// Sections 4-9: Deep Dive Analysis
// ============================================

function createDeepDiveSections(data) {
  const sections = [];

  // Section 4: Legitimacy Worksheet
  sections.push(...createLegitimacySection(data));

  // Section 5: Needs & Requesters
  sections.push(...createNeedsRequestersSection(data));

  // Section 6: Persona Development
  sections.push(...createPersonaSection(data));

  // Section 7: Needs Qualification Matrix
  sections.push(...createNeedsQualificationSection(data));

  // Section 8: Players & Influencers
  sections.push(...createPlayersSection(data));

  // Section 9: Value Network Map
  sections.push(...createValueNetworkSection(data));

  return sections;
}

function createLegitimacySection(data) {
  const legitimacy = data.legitimacyWorksheet || data.legitimacy || {};
  const sections = [];

  sections.push(createSectionHeader('4. Legitimacy Worksheet', 'Deep Dive'));

  sections.push(createSubsectionHeader('Purpose'));
  sections.push(createParagraph('Validates the existence and significance of the problem being addressed.'));

  sections.push(createSubsectionHeader('Problem Validation Matrix'));
  const validationItems = legitimacy.validationItems || legitimacy.problemValidation || [];
  if (validationItems.length > 0) {
    const rows = validationItems.map((item) => [
      item.aspect || item.criterion || 'N/A',
      item.evidence || 'N/A',
      item.status || item.validation || 'N/A',
    ]);
    sections.push(createScoreTable(['Aspect', 'Evidence', 'Status'], rows, { phase: 'Deep Dive' }));
  } else {
    sections.push(createParagraph('No validation data available.'));
  }

  sections.push(createSubsectionHeader('Means Inventory'));
  const means = legitimacy.meansInventory || legitimacy.existingSolutions || [];
  if (means.length > 0) {
    means.slice(0, 5).forEach((m) => {
      sections.push(createBulletItem(`${m.name || m}: ${m.limitations || m.description || ''}`));
    });
  } else {
    sections.push(createParagraph('No existing solutions documented.'));
  }

  sections.push(createPageBreak());
  return sections;
}

function createNeedsRequestersSection(data) {
  const needs = data.needsRequesters || data.needsAnalysis || {};
  const sections = [];

  sections.push(createSectionHeader('5. Needs & Requesters', 'Deep Dive'));

  sections.push(createSubsectionHeader('Purpose'));
  sections.push(createParagraph('Identifies WHO has the need, WHAT the need is, WHY it matters, and HOW they currently address it.'));

  sections.push(createSubsectionHeader('Identified Requesters'));
  const requesters = needs.requesters || [];
  if (requesters.length > 0) {
    const rows = requesters.map((r) => [
      r.id || 'N/A',
      r.role || r.name || 'N/A',
      r.type || 'N/A',
      String(r.interviewCount || r.interviews || 0),
      r.reliability || 'N/A',
    ]);
    sections.push(createScoreTable(['ID', 'Role', 'Type', 'Interviews', 'Reliability'], rows, { phase: 'Deep Dive' }));
  } else {
    sections.push(createParagraph('No requesters documented.'));
  }

  sections.push(createSubsectionHeader('Identified Needs'));
  const needsList = needs.needs || needs.identifiedNeeds || [];
  if (needsList.length > 0) {
    const rows = needsList.slice(0, 10).map((n) => [
      n.id || 'N/A',
      n.statement || n.need || n.text || 'N/A',
      n.category || 'N/A',
      n.evidence || n.evidenceLevel || 'N/A',
    ]);
    sections.push(createScoreTable(['ID', 'Need Statement', 'Category', 'Evidence'], rows, { phase: 'Deep Dive' }));
  } else {
    sections.push(createParagraph('No needs documented.'));
  }

  sections.push(createPageBreak());
  return sections;
}

function createPersonaSection(data) {
  const personas = data.personas || data.personaDevelopment || {};
  const sections = [];

  sections.push(createSectionHeader('6. Persona Development', 'Deep Dive'));

  sections.push(createSubsectionHeader('Purpose'));
  sections.push(createParagraph('Evidence-based user personas derived from requester analysis.'));

  const personaList = personas.personas || personas.list || [];
  if (personaList.length > 0) {
    personaList.slice(0, 4).forEach((p, i) => {
      sections.push(createH3Header(`Persona ${i + 1}: ${p.name || p.title || 'Unnamed'}`));

      const personaInfo = [
        { label: 'Role', value: p.role || 'N/A' },
        { label: 'Demographics', value: p.demographics || 'N/A' },
        { label: 'Goals', value: p.goals || 'N/A' },
        { label: 'Pain Points', value: p.painPoints || 'N/A' },
        { label: 'Behaviors', value: p.behaviors || 'N/A' },
      ];
      sections.push(createInfoTable(personaInfo, { phase: 'Deep Dive' }));
      sections.push(createSpacer(100, 200));
    });
  } else {
    sections.push(createParagraph('No personas developed.'));
  }

  sections.push(createPageBreak());
  return sections;
}

function createNeedsQualificationSection(data) {
  const matrix = data.needsQualification || data.needsMatrix || {};
  const sections = [];

  sections.push(createSectionHeader('7. Needs Qualification Matrix', 'Deep Dive'));

  sections.push(createSubsectionHeader('Purpose'));
  sections.push(createParagraph('Prioritizes needs based on impact and frequency to identify focus areas.'));

  sections.push(createSubsectionHeader('Priority Zone Classification'));
  const zones = matrix.priorityZones || matrix.zones || [];
  if (zones.length > 0) {
    const rows = zones.map((z) => [
      z.zone || z.name || 'N/A',
      z.needs ? z.needs.join(', ') : (z.items || 'N/A'),
      z.recommendation || z.action || 'N/A',
    ]);
    sections.push(createScoreTable(['Zone', 'Needs', 'Recommendation'], rows, { phase: 'Deep Dive' }));
  } else {
    sections.push(createParagraph('No priority zones defined.'));
  }

  sections.push(createPageBreak());
  return sections;
}

function createPlayersSection(data) {
  const players = data.playersInfluencers || data.players || {};
  const sections = [];

  sections.push(createSectionHeader('8. Players & Influencers', 'Deep Dive'));

  sections.push(createSubsectionHeader('Purpose'));
  sections.push(createParagraph('Maps ecosystem stakeholders and their influence on solution adoption.'));

  sections.push(createSubsectionHeader('Stakeholder Analysis'));
  const stakeholders = players.stakeholders || players.list || [];
  if (stakeholders.length > 0) {
    const rows = stakeholders.slice(0, 10).map((s) => [
      s.name || s.player || 'N/A',
      s.type || s.category || 'N/A',
      s.power || s.influence || 'N/A',
      s.interest || 'N/A',
      s.stance || s.acceptability || 'N/A',
    ]);
    sections.push(createScoreTable(['Player', 'Type', 'Power', 'Interest', 'Stance'], rows, { phase: 'Deep Dive' }));
  } else {
    sections.push(createParagraph('No stakeholders documented.'));
  }

  sections.push(createPageBreak());
  return sections;
}

function createValueNetworkSection(data) {
  const network = data.valueNetwork || data.valueNetworkMap || {};
  const sections = [];

  sections.push(createSectionHeader('9. Value Network Map', 'Deep Dive'));

  sections.push(createSubsectionHeader('Purpose'));
  sections.push(createParagraph('Visualizes value flows and relationships between ecosystem participants.'));

  sections.push(createSubsectionHeader('Key Relationships'));
  const relationships = network.relationships || network.flows || [];
  if (relationships.length > 0) {
    const rows = relationships.slice(0, 10).map((r) => [
      r.from || r.source || 'N/A',
      r.to || r.target || 'N/A',
      r.value || r.exchange || 'N/A',
      r.strength || r.importance || 'N/A',
    ]);
    sections.push(createScoreTable(['From', 'To', 'Value Exchange', 'Strength'], rows, { phase: 'Deep Dive' }));
  } else {
    sections.push(createParagraph('No value flows documented.'));
  }

  sections.push(createPageBreak());
  return sections;
}

// ============================================
// Section 10: Diagnostic Commentary (Step 10)
// ============================================

function createDiagnosticCommentarySection(data, charts) {
  const commentary = data.diagnosticCommentary || data.diagnosticComment || {};
  const sections = [];

  sections.push(createSectionHeader('10. Diagnostic Commentary', 'Synthesis'));

  sections.push(createSubsectionHeader('Executive Decision Brief'));
  const narrative = commentary.executiveBrief || commentary.narrative || commentary.synthesis ||
    'Comprehensive analysis synthesizing findings from all prior assessment steps.';
  sections.push(createParagraph(narrative));

  sections.push(createSubsectionHeader('Cross-Dimensional Insights'));
  const insights = commentary.insights || commentary.crossDimensionalInsights || [];
  if (insights.length > 0) {
    insights.slice(0, 5).forEach((insight, i) => {
      sections.push(createNumberedItem(typeof insight === 'string' ? insight : insight.text || insight.insight, i + 1));
    });
  } else {
    sections.push(createParagraph('No cross-dimensional insights documented.'));
  }

  // Evidence Distribution with pie chart
  sections.push(createSubsectionHeader('Validation Status Summary'));

  if (charts?.evidencePieChart) {
    sections.push(createChartImage(charts.evidencePieChart, 280, 280, 'Evidence Distribution Chart'));
  }

  const evidenceDist = commentary.evidenceDistribution || data.evidenceDistribution || {};
  const evidenceRows = [
    ['[VALIDATED]', String(evidenceDist.VALIDATED ?? evidenceDist.validated ?? 0), 'Claims with direct evidence'],
    ['[LIKELY]', String(evidenceDist.LIKELY ?? evidenceDist.likely ?? 0), 'Claims with strong inference'],
    ['[ASSUMED]', String(evidenceDist.ASSUMED ?? evidenceDist.assumed ?? 0), 'Claims requiring validation'],
    ['[UNVALIDATED]', String(evidenceDist.UNVALIDATED ?? evidenceDist.unvalidated ?? 0), 'Claims without evidence'],
  ];
  sections.push(createScoreTable(['Evidence Type', 'Count', 'Description'], evidenceRows, { phase: 'Synthesis' }));

  sections.push(createSubsectionHeader('Preliminary Recommendation'));
  const prelim = commentary.preliminaryRecommendation || commentary.recommendation || 'See final viability assessment.';
  sections.push(createParagraph(prelim));

  sections.push(createPageBreak());
  return sections;
}

// ============================================
// Section 11: Features-Needs Matrix (Step 11)
// ============================================

function createFeaturesNeedsSection(data) {
  const matrix = data.featuresNeeds || data.featuresNeedsMatrix || {};
  const sections = [];

  sections.push(createSectionHeader('11. Features-Needs Matrix', 'Synthesis'));

  sections.push(createSubsectionHeader('MVP Scope Analysis'));
  const features = matrix.features || [];
  const needs = matrix.needs || [];

  if (features.length > 0 && needs.length > 0) {
    sections.push(createParagraph('Matrix shows how proposed features address identified needs.'));
    // Simplified matrix representation
    const featureRows = features.slice(0, 8).map((f) => [
      f.name || f.feature || 'N/A',
      f.priority || 'Medium',
      f.needsCovered ? f.needsCovered.join(', ') : 'N/A',
      f.coverage || 'N/A',
    ]);
    sections.push(createScoreTable(['Feature', 'Priority', 'Needs Addressed', 'Coverage'], featureRows, { phase: 'Synthesis' }));
  } else {
    sections.push(createParagraph('Features-needs mapping not available.'));
  }

  sections.push(createSubsectionHeader('Coverage Analysis'));
  const coverage = matrix.coverageAnalysis || {};
  const coverageInfo = [
    { label: 'Needs Addressed', value: formatPercentage(coverage.addressedPercentage || 0, 0) },
    { label: 'Unaddressed Critical Needs', value: coverage.unaddressedCritical || 'None identified' },
    { label: 'Feature/Need Alignment Score', value: `${formatScore(coverage.alignmentScore || 0)}/5` },
  ];
  sections.push(createInfoTable(coverageInfo, { phase: 'Synthesis' }));

  sections.push(createSubsectionHeader('Prioritized Feature Recommendations'));
  const recommendations = matrix.recommendations || matrix.prioritizedFeatures || [];
  if (recommendations.length > 0) {
    recommendations.slice(0, 5).forEach((rec, i) => {
      const text = typeof rec === 'string' ? rec : `${rec.feature || rec.name}: ${rec.rationale || rec.reason || ''}`;
      sections.push(createNumberedItem(text, i + 1));
    });
  } else {
    sections.push(createParagraph('No prioritized recommendations available.'));
  }

  sections.push(createPageBreak());
  return sections;
}

// ============================================
// Section 12: Viability Assessment (Step 12)
// ============================================

function createViabilitySection(data, charts) {
  const viability = data.viabilityAssessment || data.viability || {};
  const sections = [];

  sections.push(createSectionHeader('12. Viability Assessment', 'Viability'));

  // Final Gate Decision with large badge
  sections.push(createSubsectionHeader('Final Gate Decision'));

  const recommendation = viability.gateRecommendation || data.recommendation || 'PENDING';
  const investmentScore = viability.investmentReadinessScore ?? data.investmentScore ?? 0;

  sections.push(createRecommendationBadge(recommendation, investmentScore));
  sections.push(createSpacer(200, 200));

  // Investment gauge chart
  if (charts?.gaugeChart) {
    sections.push(createChartImage(charts.gaugeChart, 280, 160, 'Investment Readiness Gauge'));
  }

  // Gate Criteria Scorecard
  sections.push(createSubsectionHeader('Gate Criteria Scorecard'));
  const criteria = viability.gateCriteria || viability.criteria || [
    { name: 'Team Readiness', weight: 0.20 },
    { name: 'Technology Maturity', weight: 0.15 },
    { name: 'Market Validation', weight: 0.25 },
    { name: 'Business Model Viability', weight: 0.20 },
    { name: 'Execution Capability', weight: 0.20 },
  ];

  const criteriaRows = criteria.map((c) => {
    const score = c.score ?? 0;
    const pass = score >= 3.0;
    return [
      c.name || c.criterion || 'N/A',
      `${formatScore(score)}/5`,
      formatPercentage(c.weight || 0.20),
      { content: pass ? '✓' : '✗', color: pass ? REPORT_COLORS.success : REPORT_COLORS.error },
    ];
  });

  // Add weighted total
  const weightedTotal = criteria.reduce((sum, c) => sum + (c.score || 0) * (c.weight || 0.20), 0);
  criteriaRows.push([
    { content: 'WEIGHTED TOTAL', bold: true },
    { content: `${Math.round(weightedTotal * 20)}/100`, bold: true },
    { content: '100%', bold: true },
    '',
  ]);

  sections.push(createScoreTable(['Criterion', 'Score', 'Weight', 'Pass'], criteriaRows, { phase: 'Viability' }));
  sections.push(createSpacer(200, 300));

  // Risk Register
  sections.push(createSubsectionHeader('Risk Register'));
  const risks = viability.riskRegister || viability.risks || [];
  if (risks.length > 0) {
    const riskRows = risks.slice(0, 8).map((r, i) => [
      `R-${String(i + 1).padStart(3, '0')}`,
      r.category || r.type || 'N/A',
      r.risk || r.description || 'N/A',
      r.severity || r.impact || 'N/A',
      r.likelihood || 'N/A',
      r.mitigation || 'N/A',
    ]);
    sections.push(createScoreTable(
      ['ID', 'Category', 'Risk', 'Severity', 'Likelihood', 'Mitigation'],
      riskRows,
      { phase: 'Viability', columnWidths: [800, 1200, 2500, 1000, 1000, 2500] }
    ));
  } else {
    sections.push(createParagraph('No risks documented in register.'));
  }
  sections.push(createSpacer(200, 300));

  // Recommendations
  sections.push(createSubsectionHeader('Recommendations'));

  // Immediate Actions
  sections.push(createH3Header('Immediate Actions (Next 30 days)'));
  const immediateActions = viability.ninetyDayRoadmap?.days1to30 || viability.immediateActions || [];
  if (immediateActions.length > 0) {
    immediateActions.slice(0, 5).forEach((action, i) => {
      const text = typeof action === 'string' ? action : `${action.action || action.task} (Owner: ${action.owner || 'TBD'})`;
      sections.push(createNumberedItem(text, i + 1));
    });
  } else {
    sections.push(createParagraph('No immediate actions specified.'));
  }

  // Short-term Goals
  sections.push(createH3Header('Short-Term Goals (30-90 days)'));
  const shortTermGoals = viability.ninetyDayRoadmap?.days31to60 || viability.shortTermGoals || [];
  if (shortTermGoals.length > 0) {
    shortTermGoals.slice(0, 5).forEach((goal, i) => {
      const text = typeof goal === 'string' ? goal : `${goal.milestone || goal.goal} (Owner: ${goal.owner || 'TBD'})`;
      sections.push(createNumberedItem(text, i + 1));
    });
  } else {
    sections.push(createParagraph('No short-term goals specified.'));
  }

  // Validation Requirements
  sections.push(createH3Header('Validation Requirements (Before next gate)'));
  const validationReqs = viability.validationRequirements || viability.ninetyDayRoadmap?.days61to90 || [];
  if (validationReqs.length > 0) {
    validationReqs.slice(0, 5).forEach((req) => {
      const text = typeof req === 'string' ? req : req.requirement || req.objective || req;
      sections.push(createBulletItem(text));
    });
  } else {
    sections.push(createParagraph('No specific validation requirements listed.'));
  }

  sections.push(createPageBreak());
  return sections;
}

// ============================================
// Appendices
// ============================================

function createAppendices(data) {
  const sections = [];

  // Appendix A: Evidence Inventory
  sections.push(createSectionHeader('Appendix A: Evidence Inventory', 'Foundation', false));
  const evidenceInventory = data.evidenceInventory || [];
  if (evidenceInventory.length > 0) {
    const rows = evidenceInventory.slice(0, 20).map((e) => [
      e.id || 'N/A',
      e.claim || e.statement || 'N/A',
      e.source || 'N/A',
      e.type || e.evidenceType || 'N/A',
    ]);
    sections.push(createScoreTable(['ID', 'Claim', 'Source', 'Type'], rows, { phase: 'Foundation' }));
  } else {
    sections.push(createParagraph('Evidence inventory will be compiled from assessment data.'));
  }
  sections.push(createPageBreak());

  // Appendix B: Risk Register (Full)
  sections.push(createSectionHeader('Appendix B: Risk Register', 'Viability', false));
  const risks = data.viabilityAssessment?.riskRegister || data.riskRegister || [];
  if (risks.length > 0) {
    const rows = risks.map((r, i) => [
      `R-${String(i + 1).padStart(3, '0')}`,
      r.risk || r.description || 'N/A',
      r.severity || 'N/A',
      r.likelihood || 'N/A',
      r.mitigation || 'N/A',
    ]);
    sections.push(createScoreTable(['ID', 'Risk Description', 'Severity', 'Likelihood', 'Mitigation'], rows, { phase: 'Viability' }));
  } else {
    sections.push(createParagraph('No risks have been documented.'));
  }
  sections.push(createPageBreak());

  // Appendix C: Questions for Founders
  sections.push(createSectionHeader('Appendix C: Questions for Founders', 'Foundation', false));
  const questions = data.diagnosticAssessment?.questionsForFounders || data.questionsForFounders || [];
  if (questions.length > 0) {
    questions.slice(0, 15).forEach((q, i) => {
      const priority = q.priority || 'Medium';
      const question = q.question || q;
      const rationale = q.rationale || '';

      sections.push(new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: `${i + 1}. [${priority}] `, bold: true, size: 22, font: 'Arial' }),
          new TextRun({ text: question, size: 22, font: 'Arial' }),
        ],
      }));
      if (rationale) {
        sections.push(new Paragraph({
          spacing: { after: 200 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: `Rationale: ${rationale}`, italic: true, size: 20, color: REPORT_COLORS.textMuted, font: 'Arial' }),
          ],
        }));
      }
    });
  } else {
    sections.push(createParagraph('No founder questions generated from assessment.'));
  }

  return sections;
}

// ============================================
// Main Export Function
// ============================================

/**
 * Generate a complete 360 Business Validation Report as DOCX
 * @param {Object} assessmentData - Full assessment data from Express mode
 * @returns {Promise<Blob>} - DOCX file as Blob
 */
export async function generateValidationReport(assessmentData) {
  const data = assessmentData || {};
  const projectName = data.projectName || data.metadata?.projectName || 'Project Assessment';
  const date = data.date || data.metadata?.assessmentDate || new Date().toISOString().split('T')[0];
  const reportId = generateReportId(date);

  // Generate all charts
  let charts = {};
  try {
    charts = await generateAllCharts(data);
  } catch (error) {
    console.warn('Chart generation failed, proceeding without charts:', error);
  }

  // Build all sections
  const coverPageContent = createCoverPage(data, reportId);
  const tocContent = createTableOfContentsPage();
  const execSummaryContent = createExecutiveSummary(data, charts);
  const execBriefContent = createExecutiveBriefSection(data);
  const diagnosticContent = createDiagnosticSection(data, charts);
  const marketMaturityContent = createMarketMaturitySection(data, charts);
  const deepDiveContent = createDeepDiveSections(data);
  const diagnosticCommentaryContent = createDiagnosticCommentarySection(data, charts);
  const featuresNeedsContent = createFeaturesNeedsSection(data);
  const viabilityContent = createViabilitySection(data, charts);
  const appendicesContent = createAppendices(data);

  // Create the document with two sections: cover (no header/footer) and main content
  const doc = new Document({
    title: `360 Business Validation Report - ${projectName}`,
    subject: 'VIANEO Framework Assessment Report',
    creator: 'VIANEO Sprint Automator',
    description: `360 Business Validation Report for ${projectName}`,

    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: TYPOGRAPHY.bodyText.size,
          },
          paragraph: {
            spacing: { line: 276 },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: TYPOGRAPHY.sectionHeader.size,
            bold: true,
            font: 'Arial',
          },
          paragraph: {
            spacing: { before: 400, after: 240 },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: TYPOGRAPHY.subsectionHeader.size,
            bold: true,
            font: 'Arial',
          },
          paragraph: {
            spacing: { before: 300, after: 180 },
          },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: TYPOGRAPHY.subSubsectionHeader.size,
            bold: true,
            font: 'Arial',
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
          },
        },
      ],
    },

    numbering: {
      config: [
        {
          reference: 'bullet-list',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
          ],
        },
      ],
    },

    sections: [
      // Cover page section (no header/footer)
      {
        properties: {
          page: {
            margin: {
              top: SPACING.pageMargins,
              right: SPACING.pageMargins,
              bottom: SPACING.pageMargins,
              left: SPACING.pageMargins,
            },
          },
        },
        children: coverPageContent,
      },
      // Main content section (with header/footer)
      {
        properties: {
          page: {
            margin: {
              top: SPACING.pageMargins,
              right: SPACING.pageMargins,
              bottom: SPACING.pageMargins,
              left: SPACING.pageMargins,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: '360 Business Validation Report',
                    size: TYPOGRAPHY.footer.size,
                    color: REPORT_COLORS.textMuted,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: ' | ',
                    size: TYPOGRAPHY.footer.size,
                    color: REPORT_COLORS.textMuted,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: projectName,
                    size: TYPOGRAPHY.footer.size,
                    color: REPORT_COLORS.textMuted,
                    italics: true,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: TYPOGRAPHY.footer.size,
                    color: REPORT_COLORS.textMuted,
                    font: 'Arial',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: TYPOGRAPHY.footer.size,
                    color: REPORT_COLORS.textMuted,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: ' of ',
                    size: TYPOGRAPHY.footer.size,
                    color: REPORT_COLORS.textMuted,
                    font: 'Arial',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: TYPOGRAPHY.footer.size,
                    color: REPORT_COLORS.textMuted,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: ' | CONFIDENTIAL',
                    size: TYPOGRAPHY.footer.size,
                    color: REPORT_COLORS.textMuted,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...tocContent,
          ...execSummaryContent,
          ...execBriefContent,
          ...diagnosticContent,
          ...marketMaturityContent,
          ...deepDiveContent,
          ...diagnosticCommentaryContent,
          ...featuresNeedsContent,
          ...viabilityContent,
          ...appendicesContent,
        ],
      },
    ],
  });

  // Generate and return blob
  const blob = await Packer.toBlob(doc);
  return blob;
}

/**
 * Download the generated report
 * @param {Blob} blob - DOCX blob
 * @param {string} projectName - Project name for filename
 * @param {string} date - Date string
 */
export function downloadReport(blob, projectName, date) {
  const filename = generateReportFilename(projectName, date);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate and immediately download the report
 * @param {Object} assessmentData - Assessment data
 */
export async function generateAndDownloadReport(assessmentData) {
  const blob = await generateValidationReport(assessmentData);
  const projectName = assessmentData.projectName || assessmentData.metadata?.projectName || 'Assessment';
  const date = assessmentData.date || assessmentData.metadata?.assessmentDate;
  downloadReport(blob, projectName, date);
  return blob;
}
