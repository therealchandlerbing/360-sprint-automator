// ============================================
// DOCX Generator for Express Assessment Mode
// Generates professional 360 Business Validation Report
// ============================================

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
} from 'docx';

// Design constants matching VIANEO brand
const COLORS = {
  primary: '0A2540',
  foundation: '0A2540',
  deepDive: '0D5A66',
  synthesis: '1E6B4F',
  viability: '7C3AED',
  accent: '00A3B5',
  success: '10B981',
  warning: 'F59E0B',
  danger: 'EF4444',
  text: '1A202C',
  textMuted: '718096',
  border: 'E2E8F0',
  white: 'FFFFFF',
};

// Helper function to create styled paragraph
function createStyledParagraph(text, options = {}) {
  const {
    bold = false,
    size = 22, // 11pt
    color = COLORS.text,
    alignment = AlignmentType.LEFT,
    spacing = { after: 200 },
    heading,
  } = options;

  return new Paragraph({
    heading,
    alignment,
    spacing,
    children: [
      new TextRun({
        text,
        bold,
        size,
        color,
      }),
    ],
  });
}

// Helper to create section header
function createSectionHeader(text, phaseColor = COLORS.primary) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: {
      bottom: { color: phaseColor, size: 6, style: BorderStyle.SINGLE },
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32,
        color: phaseColor,
      }),
    ],
  });
}

// Helper to create subsection header
function createSubsectionHeader(text, level = HeadingLevel.HEADING_2) {
  return new Paragraph({
    heading: level,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: COLORS.primary,
      }),
    ],
  });
}

// Helper to create table cell
function createTableCell(text, options = {}) {
  const {
    bold = false,
    size = 20,
    color = COLORS.text,
    shading,
    alignment = AlignmentType.LEFT,
    width,
  } = options;

  return new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment,
        children: [
          new TextRun({
            text: text || '',
            bold,
            size,
            color,
          }),
        ],
      }),
    ],
  });
}

// Helper to create table row
function createTableRow(cells, isHeader = false) {
  return new TableRow({
    children: cells.map((cell) =>
      createTableCell(
        typeof cell === 'string' ? cell : cell.text,
        {
          bold: isHeader || cell.bold,
          shading: isHeader ? COLORS.primary : (cell.shading || undefined),
          color: isHeader ? COLORS.white : (cell.color || COLORS.text),
          width: cell.width,
          alignment: cell.alignment,
        }
      )
    ),
  });
}

// Create cover page
function createCoverPage(data) {
  const metadata = data.metadata || {};
  const summary = data.executiveSummary || {};
  const recommendation = summary.recommendation || 'PENDING';

  let recColor = COLORS.primary;
  let recText = 'Assessment Complete';

  switch (recommendation) {
    case 'GO':
      recColor = COLORS.success;
      recText = 'GO - Strong Pass';
      break;
    case 'CONDITIONAL_GO':
      recColor = COLORS.warning;
      recText = 'CONDITIONAL GO';
      break;
    case 'HOLD':
      recColor = 'F97316';
      recText = 'HOLD - Needs Work';
      break;
    case 'NO_GO':
      recColor = COLORS.danger;
      recText = 'NO GO - Decline';
      break;
  }

  return [
    // Spacer
    new Paragraph({ spacing: { before: 2000 } }),

    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: '360 BUSINESS VALIDATION REPORT',
          bold: true,
          size: 48,
          color: COLORS.primary,
        }),
      ],
    }),

    // Subtitle
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'VIANEO Framework Assessment',
          size: 28,
          color: COLORS.textMuted,
        }),
      ],
    }),

    // Project name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 400 },
      children: [
        new TextRun({
          text: metadata.projectName || 'Project Assessment',
          bold: true,
          size: 40,
          color: COLORS.primary,
        }),
      ],
    }),

    // Recommendation badge
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 200 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 1, color: recColor },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: recColor },
        left: { style: BorderStyle.SINGLE, size: 1, color: recColor },
        right: { style: BorderStyle.SINGLE, size: 1, color: recColor },
      },
      shading: { fill: recColor, type: ShadingType.CLEAR },
      children: [
        new TextRun({
          text: `   ${recText}   `,
          bold: true,
          size: 28,
          color: COLORS.white,
        }),
      ],
    }),

    // Investment Readiness Score
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: `Investment Readiness Score: ${summary.investmentReadinessScore || '--'}/100`,
          size: 24,
          color: COLORS.text,
        }),
      ],
    }),

    // Date and assessor
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200 },
      children: [
        new TextRun({
          text: `Assessment Date: ${metadata.assessmentDate || new Date().toISOString().split('T')[0]}`,
          size: 22,
          color: COLORS.textMuted,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Generated by: ${metadata.assessor || 'VIANEO Sprint Automator'}`,
          size: 22,
          color: COLORS.textMuted,
        }),
      ],
    }),

    // Page break
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
}

// Create executive summary section
function createExecutiveSummary(data) {
  const summary = data.executiveSummary || {};
  const sections = [];

  sections.push(createSectionHeader('Executive Summary', COLORS.primary));

  // Recommendation and scores
  sections.push(createSubsectionHeader('Assessment Overview'));

  const overviewTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(
        [
          { text: 'Gate Recommendation', bold: true, width: 30 },
          { text: summary.recommendation?.replace('_', ' ') || 'Pending' },
        ]
      ),
      createTableRow([
        { text: 'Confidence Level', bold: true, width: 30 },
        { text: summary.confidenceLevel || 'N/A' },
      ]),
      createTableRow([
        { text: 'Investment Readiness Score', bold: true, width: 30 },
        { text: `${summary.investmentReadinessScore || '--'}/100` },
      ]),
    ],
  });
  sections.push(overviewTable);
  sections.push(new Paragraph({ spacing: { after: 300 } }));

  // Key Strengths
  if (summary.keyStrengths?.length) {
    sections.push(createSubsectionHeader('Key Strengths'));
    summary.keyStrengths.forEach((strength, i) => {
      sections.push(createStyledParagraph(`${i + 1}. ${strength}`, { size: 22 }));
    });
    sections.push(new Paragraph({ spacing: { after: 200 } }));
  }

  // Critical Risks
  if (summary.criticalRisks?.length) {
    sections.push(createSubsectionHeader('Critical Risks'));
    summary.criticalRisks.forEach((risk, i) => {
      sections.push(createStyledParagraph(`${i + 1}. ${risk}`, { size: 22 }));
    });
    sections.push(new Paragraph({ spacing: { after: 200 } }));
  }

  // Synthesis Narrative
  if (summary.synthesisNarrative) {
    sections.push(createSubsectionHeader('Assessment Narrative'));
    sections.push(createStyledParagraph(summary.synthesisNarrative, { size: 22 }));
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));

  return sections;
}

// Create company overview section
function createCompanyOverview(data) {
  const co = data.companyOverview || {};
  const sections = [];

  sections.push(createSectionHeader('Company Overview', COLORS.foundation));

  // B1: Company Overview
  sections.push(createSubsectionHeader('B1: Company Overview'));
  if (co.b1_overview) {
    const b1 = co.b1_overview;
    const infoTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRow([{ text: 'Field', bold: true, width: 25 }, { text: 'Value', bold: true }], true),
        createTableRow([{ text: 'Company Name', width: 25 }, { text: b1.companyName || 'N/A' }]),
        createTableRow([{ text: 'Founded', width: 25 }, { text: b1.founded || 'N/A' }]),
        createTableRow([{ text: 'Location', width: 25 }, { text: b1.location || 'N/A' }]),
        createTableRow([{ text: 'Legal Structure', width: 25 }, { text: b1.legalStructure || 'N/A' }]),
        createTableRow([{ text: 'Team Size', width: 25 }, { text: String(b1.teamSize || 'N/A') }]),
      ],
    });
    sections.push(infoTable);
    sections.push(new Paragraph({ spacing: { after: 150 } }));
    sections.push(createStyledParagraph(`Overview: ${b1.text || 'N/A'}`, { size: 22 }));
  }

  // B2: Problem Statement
  sections.push(createSubsectionHeader('B2: Problem Statement'));
  if (co.b2_problem) {
    sections.push(createStyledParagraph(co.b2_problem.text || 'N/A', { size: 22 }));
    sections.push(createStyledParagraph(
      `Evidence Basis: ${co.b2_problem.evidenceBasis || 'N/A'}`,
      { size: 20, color: COLORS.textMuted }
    ));
  }

  // B3: Solution Description
  sections.push(createSubsectionHeader('B3: Solution Description'));
  if (co.b3_solution) {
    sections.push(createStyledParagraph(co.b3_solution.text || 'N/A', { size: 22 }));
    if (co.b3_solution.technicalApproach?.length) {
      sections.push(createStyledParagraph('Technical Approach:', { bold: true, size: 22 }));
      co.b3_solution.technicalApproach.forEach((approach) => {
        sections.push(createStyledParagraph(`- ${approach}`, { size: 22 }));
      });
    }
  }

  // B4: Target Market
  sections.push(createSubsectionHeader('B4: Target Market'));
  if (co.b4_market) {
    sections.push(createStyledParagraph(
      `Primary Users: ${co.b4_market.primaryUsers || 'N/A'}`,
      { size: 22 }
    ));
    sections.push(createStyledParagraph(
      `Primary Buyers: ${co.b4_market.primaryBuyers || 'N/A'}`,
      { size: 22 }
    ));

    if (co.b4_market.segments?.length) {
      const segmentTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createTableRow([
            { text: 'Segment', bold: true },
            { text: 'Size', bold: true },
            { text: 'Characteristics', bold: true },
          ], true),
          ...co.b4_market.segments.map((seg) =>
            createTableRow([
              { text: seg.name || '' },
              { text: seg.size || '' },
              { text: seg.characteristics || '' },
            ])
          ),
        ],
      });
      sections.push(segmentTable);
    }
  }

  // B5: Business Model
  sections.push(createSubsectionHeader('B5: Business Model'));
  if (co.b5_businessModel) {
    sections.push(createStyledParagraph(co.b5_businessModel.text || 'N/A', { size: 22 }));
    sections.push(createStyledParagraph(
      `Pricing: ${co.b5_businessModel.pricing || 'N/A'} | Unit Economics: ${co.b5_businessModel.unitEconomics || 'N/A'}`,
      { size: 20, color: COLORS.textMuted }
    ));
  }

  // B6: Traction & Status
  sections.push(createSubsectionHeader('B6: Traction & Status'));
  if (co.b6_traction) {
    sections.push(createStyledParagraph(co.b6_traction.text || 'N/A', { size: 22 }));
    const metrics = co.b6_traction.metrics || {};
    const tractionTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRow([{ text: 'Metric', bold: true }, { text: 'Value', bold: true }], true),
        createTableRow([{ text: 'Customer Interviews' }, { text: String(metrics.customerInterviews || 0) }]),
        createTableRow([{ text: 'Paying Customers' }, { text: String(metrics.payingCustomers || 0) }]),
        createTableRow([{ text: 'Pilots/Trials' }, { text: String(metrics.pilots || 0) }]),
        createTableRow([{ text: 'Revenue' }, { text: metrics.revenue || 'N/A' }]),
        createTableRow([{ text: 'LOIs/Commitments' }, { text: String(metrics.lois || 0) }]),
      ],
    });
    sections.push(tractionTable);
    sections.push(createStyledParagraph(
      `Development Stage: ${co.b6_traction.developmentStage || 'N/A'}`,
      { size: 20, color: COLORS.textMuted }
    ));
  }

  // B7: Team Summary
  sections.push(createSubsectionHeader('B7: Team Summary'));
  if (co.b7_team) {
    sections.push(createStyledParagraph(co.b7_team.text || 'N/A', { size: 22 }));

    if (co.b7_team.members?.length) {
      const teamTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createTableRow([
            { text: 'Name', bold: true },
            { text: 'Role', bold: true },
            { text: 'Experience', bold: true },
            { text: 'Commitment', bold: true },
          ], true),
          ...co.b7_team.members.map((member) =>
            createTableRow([
              { text: member.name || '' },
              { text: member.role || '' },
              { text: member.experience || '' },
              { text: member.commitment?.replace('_', ' ') || '' },
            ])
          ),
        ],
      });
      sections.push(teamTable);
    }
  }

  // Maturity Stage
  sections.push(createSubsectionHeader('Maturity Assessment'));
  const maturityTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow([{ text: 'Assessment', bold: true }, { text: 'Value', bold: true }], true),
      createTableRow([{ text: 'Maturity Stage' }, { text: co.maturityStage || 'N/A' }]),
      createTableRow([{ text: 'TRL Level' }, { text: String(co.trlLevel || 'N/A') }]),
      createTableRow([{ text: 'TRL Justification' }, { text: co.trlJustification || 'N/A' }]),
    ],
  });
  sections.push(maturityTable);

  sections.push(new Paragraph({ children: [new PageBreak()] }));

  return sections;
}

// Create diagnostic assessment section
function createDiagnosticAssessment(data) {
  const da = data.diagnosticAssessment || {};
  const sections = [];

  sections.push(createSectionHeader('Diagnostic Assessment (40Q)', COLORS.foundation));

  // Summary scores table
  sections.push(createSubsectionHeader('Dimension Scores Summary'));
  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow([
        { text: 'Dimension', bold: true },
        { text: 'Score', bold: true },
        { text: 'Status', bold: true },
        { text: 'Key Strength', bold: true },
        { text: 'Key Gap', bold: true },
      ], true),
      ...['team', 'technology', 'management', 'commercial'].map((dim) => {
        const d = da[dim] || {};
        return createTableRow([
          { text: dim.charAt(0).toUpperCase() + dim.slice(1) },
          { text: d.score?.toFixed(1) || 'N/A' },
          { text: d.status || 'N/A' },
          { text: d.keyStrength || 'N/A' },
          { text: d.keyGap || 'N/A' },
        ]);
      }),
      createTableRow([
        { text: 'OVERALL', bold: true },
        { text: da.overallScore?.toFixed(1) || 'N/A', bold: true },
        { text: da.overallStatus || 'N/A', bold: true },
        { text: '' },
        { text: '' },
      ]),
    ],
  });
  sections.push(summaryTable);
  sections.push(new Paragraph({ spacing: { after: 300 } }));

  // Red flags
  if (da.totalRedFlags > 0) {
    sections.push(createSubsectionHeader('Red Flags Identified'));
    sections.push(createStyledParagraph(
      `Total Red Flags: ${da.totalRedFlags}`,
      { bold: true, color: COLORS.danger, size: 22 }
    ));
  }

  // Questions for founders
  if (da.questionsForFounders?.length) {
    sections.push(createSubsectionHeader('Questions for Founders'));
    da.questionsForFounders.forEach((q) => {
      sections.push(createStyledParagraph(
        `[${q.priority}] ${q.question}`,
        { size: 22 }
      ));
      sections.push(createStyledParagraph(
        `Rationale: ${q.rationale}`,
        { size: 20, color: COLORS.textMuted }
      ));
    });
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));

  return sections;
}

// Create market maturity section
function createMarketMaturity(data) {
  const mm = data.marketMaturity || {};
  const sections = [];

  sections.push(createSectionHeader('Market Maturity Assessment (29Q)', COLORS.foundation));

  // VIANEO Dimension Scores
  sections.push(createSubsectionHeader('VIANEO Dimension Scores'));

  const dimensions = ['legitimacy', 'desirability', 'acceptability', 'feasibility', 'viability'];
  const dimensionTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow([
        { text: 'Dimension', bold: true },
        { text: 'Weight', bold: true },
        { text: 'Score', bold: true },
        { text: 'Threshold', bold: true },
        { text: 'Status', bold: true },
      ], true),
      ...dimensions.map((dim) => {
        const d = mm[dim] || {};
        const meetsStatus = d.meetsThreshold != null
          ? (d.meetsThreshold ? 'MEETS' : 'BELOW')
          : 'N/A';
        const statusColor = d.meetsThreshold != null
          ? (d.meetsThreshold ? COLORS.success : COLORS.danger)
          : COLORS.textMuted;
        return createTableRow([
          { text: dim.charAt(0).toUpperCase() + dim.slice(1) },
          { text: d.weight != null ? `${(d.weight * 100).toFixed(0)}%` : 'N/A' },
          { text: d.score?.toFixed(1) || 'N/A' },
          { text: d.threshold != null ? `>=${d.threshold.toFixed(1)}` : 'N/A' },
          { text: meetsStatus, color: statusColor },
        ]);
      }),
      createTableRow([
        { text: 'OVERALL', bold: true },
        { text: '100%', bold: true },
        { text: mm.weightedOverall?.toFixed(2) || 'N/A', bold: true },
        { text: '>=3.2', bold: true },
        { text: mm.weightedOverall != null ? (mm.weightedOverall >= 3.2 ? 'MEETS' : 'BELOW') : 'N/A', bold: true },
      ]),
    ],
  });
  sections.push(dimensionTable);
  sections.push(new Paragraph({ spacing: { after: 300 } }));

  // Decision
  sections.push(createSubsectionHeader('Gate Decision'));
  sections.push(createStyledParagraph(
    `Decision: ${mm.decision || 'N/A'}`,
    { bold: true, size: 24 }
  ));
  sections.push(createStyledParagraph(
    mm.decisionRationale || 'No rationale provided.',
    { size: 22 }
  ));

  sections.push(new Paragraph({ children: [new PageBreak()] }));

  return sections;
}

// Create needs analysis section
function createNeedsAnalysis(data) {
  const na = data.needsAnalysis || {};
  const sections = [];

  sections.push(createSectionHeader('Needs & Requesters Analysis', COLORS.deepDive));

  // Requesters
  sections.push(createSubsectionHeader('Identified Requesters'));
  if (na.requesters?.length) {
    const reqTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRow([
          { text: 'ID', bold: true },
          { text: 'Role', bold: true },
          { text: 'Type', bold: true },
          { text: 'Interviews', bold: true },
          { text: 'Reliability', bold: true },
        ], true),
        ...na.requesters.map((r) =>
          createTableRow([
            { text: r.id || '' },
            { text: r.role || '' },
            { text: r.type || '' },
            { text: String(r.interviewCount || 0) },
            { text: r.reliability || 'N/A' },
          ])
        ),
      ],
    });
    sections.push(reqTable);
  }
  sections.push(createStyledParagraph(
    `Total Interviews: ${na.totalInterviews || 0} | Validated Requesters: ${na.validatedRequesters || 0}`,
    { size: 20, color: COLORS.textMuted }
  ));

  // Needs
  sections.push(createSubsectionHeader('Identified Needs'));
  if (na.needs?.length) {
    const needsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRow([
          { text: 'ID', bold: true },
          { text: 'Need Statement', bold: true },
          { text: 'Category', bold: true },
          { text: 'Evidence', bold: true },
        ], true),
        ...na.needs.map((n) =>
          createTableRow([
            { text: n.id || '' },
            { text: n.statement || '' },
            { text: n.category || '' },
            { text: n.evidence || 'N/A' },
          ])
        ),
      ],
    });
    sections.push(needsTable);
  }

  // Existing Solutions
  sections.push(createSubsectionHeader('Existing Solutions'));
  if (na.existingSolutions?.length) {
    na.existingSolutions.forEach((sol) => {
      sections.push(createStyledParagraph(
        `${sol.id}: ${sol.name}`,
        { bold: true, size: 22 }
      ));
      sections.push(createStyledParagraph(sol.description || '', { size: 20 }));
      sections.push(createStyledParagraph(
        `Limitations: ${sol.limitations || 'N/A'}`,
        { size: 20, color: COLORS.textMuted }
      ));
    });
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));

  return sections;
}

// Create viability assessment section
function createViabilityAssessment(data) {
  const va = data.viabilityAssessment || {};
  const sections = [];

  sections.push(createSectionHeader('Final Viability Assessment', COLORS.viability));

  // Gate Recommendation
  sections.push(createSubsectionHeader('Gate Recommendation'));
  const recTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow([
        { text: 'Decision', bold: true, width: 30 },
        { text: va.gateRecommendation?.replace('_', ' ') || 'N/A' },
      ]),
      createTableRow([
        { text: 'Confidence Level', bold: true, width: 30 },
        { text: va.confidenceLevel || 'N/A' },
      ]),
      createTableRow([
        { text: 'Key Factor', bold: true, width: 30 },
        { text: va.keyFactor || 'N/A' },
      ]),
    ],
  });
  sections.push(recTable);
  sections.push(new Paragraph({ spacing: { after: 200 } }));

  // Rationale
  sections.push(createSubsectionHeader('Decision Rationale'));
  sections.push(createStyledParagraph(va.finalRationale || 'No rationale provided.', { size: 22 }));

  // Risk Register
  if (va.riskRegister?.length) {
    sections.push(createSubsectionHeader('Risk Register'));
    const riskTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRow([
          { text: '#', bold: true },
          { text: 'Risk', bold: true },
          { text: 'Impact', bold: true },
          { text: 'Likelihood', bold: true },
          { text: 'Mitigation', bold: true },
        ], true),
        ...va.riskRegister.map((risk) =>
          createTableRow([
            { text: String(risk.id || '') },
            { text: risk.risk || '' },
            { text: risk.impact || '' },
            { text: risk.likelihood || '' },
            { text: risk.mitigation || '' },
          ])
        ),
      ],
    });
    sections.push(riskTable);
  }

  // 90-Day Roadmap
  if (va.ninetyDayRoadmap) {
    sections.push(createSubsectionHeader('90-Day Action Roadmap'));

    // Days 1-30
    sections.push(createStyledParagraph('Days 1-30: Immediate Priorities', { bold: true, size: 22 }));
    if (va.ninetyDayRoadmap.days1to30?.length) {
      va.ninetyDayRoadmap.days1to30.forEach((action) => {
        sections.push(createStyledParagraph(
          `- ${action.action} (Owner: ${action.owner || 'TBD'})`,
          { size: 20 }
        ));
      });
    }

    // Days 31-60
    sections.push(createStyledParagraph('Days 31-60: Building Momentum', { bold: true, size: 22 }));
    if (va.ninetyDayRoadmap.days31to60?.length) {
      va.ninetyDayRoadmap.days31to60.forEach((milestone) => {
        sections.push(createStyledParagraph(
          `- ${milestone.milestone} (Owner: ${milestone.owner || 'TBD'})`,
          { size: 20 }
        ));
      });
    }

    // Days 61-90
    sections.push(createStyledParagraph('Days 61-90: Validation & Scaling', { bold: true, size: 22 }));
    if (va.ninetyDayRoadmap.days61to90?.length) {
      va.ninetyDayRoadmap.days61to90.forEach((obj) => {
        sections.push(createStyledParagraph(
          `- ${obj.objective} (Owner: ${obj.owner || 'TBD'})`,
          { size: 20 }
        ));
      });
    }
  }

  // KPIs
  if (va.kpis?.length) {
    sections.push(createSubsectionHeader('Key Performance Indicators'));
    const kpiTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRow([
          { text: 'KPI', bold: true },
          { text: 'Current', bold: true },
          { text: '30-Day Target', bold: true },
          { text: '90-Day Target', bold: true },
        ], true),
        ...va.kpis.map((kpi) =>
          createTableRow([
            { text: kpi.name || '' },
            { text: kpi.current || '' },
            { text: kpi.target30Day || '' },
            { text: kpi.target90Day || '' },
          ])
        ),
      ],
    });
    sections.push(kpiTable);
  }

  return sections;
}

/**
 * Main function to generate DOCX report from assessment data
 * @param {Object} assessmentData - Structured assessment data from Express mode
 * @returns {Promise<Blob>} - DOCX file as Blob
 */
export async function generateDOCXReport(assessmentData) {
  const data = assessmentData || {};
  const projectName = data.metadata?.projectName || 'Assessment';
  const date = data.metadata?.assessmentDate || new Date().toISOString().split('T')[0];

  // Build document sections
  const sections = [
    ...createCoverPage(data),
    ...createExecutiveSummary(data),
    ...createCompanyOverview(data),
    ...createDiagnosticAssessment(data),
    ...createMarketMaturity(data),
    ...createNeedsAnalysis(data),
    ...createViabilityAssessment(data),
  ];

  // Create the document
  const doc = new Document({
    title: `360 Business Validation Report - ${projectName}`,
    description: 'VIANEO Framework Assessment Report',
    creator: 'VIANEO Sprint Automator',
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
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
            size: 32,
            bold: true,
            color: COLORS.primary,
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 26,
            bold: true,
            color: COLORS.primary,
          },
          paragraph: {
            spacing: { before: 300, after: 150 },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch in twips
              right: 1440,
              bottom: 1440,
              left: 1440,
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
                    text: `360 Business Validation Report - ${projectName}`,
                    size: 18,
                    color: COLORS.textMuted,
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
                    size: 18,
                    color: COLORS.textMuted,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: COLORS.textMuted,
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 18,
                    color: COLORS.textMuted,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: COLORS.textMuted,
                  }),
                  new TextRun({
                    text: ` | Generated: ${date}`,
                    size: 18,
                    color: COLORS.textMuted,
                  }),
                ],
              }),
            ],
          }),
        },
        children: sections,
      },
    ],
  });

  // Generate and return blob
  const blob = await Packer.toBlob(doc);
  return blob;
}

/**
 * Download DOCX report
 * @param {Blob} blob - DOCX file blob
 * @param {string} filename - Desired filename
 */
export function downloadDOCX(blob, filename) {
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
 * Generate safe filename from project name
 * @param {string} projectName - Project name
 * @param {string} date - Date string
 * @returns {string} - Safe filename
 */
export function generateFilename(projectName, date) {
  const safeName = (projectName || 'Assessment')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
  const dateStr = date || new Date().toISOString().split('T')[0];
  return `360_Validation_Report_${safeName}_${dateStr}.docx`;
}
