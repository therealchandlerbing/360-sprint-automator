// ============================================
// Report Helpers - Utility Functions
// 360 Business Validation Report Template
// ============================================

import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  HeadingLevel,
  PageBreak,
  ImageRun,
  convertInchesToTwip,
} from 'docx';

import {
  REPORT_COLORS,
  EVIDENCE_MARKERS,
  RECOMMENDATION_STYLES,
  TYPOGRAPHY,
  SPACING,
  TABLE_WIDTHS,
  getPhaseColor,
  getStatusBadge,
  getScoreBadge,
  getThresholdStatus,
} from './reportStyles.js';

// ============================================
// Text & Paragraph Helpers
// ============================================

/**
 * Create a styled text run
 */
export function createTextRun(text, options = {}) {
  const {
    bold = false,
    italic = false,
    size = TYPOGRAPHY.bodyText.size,
    color = REPORT_COLORS.textPrimary,
    highlight,
    underline,
    font = 'Arial',
  } = options;

  return new TextRun({
    text: text || '',
    bold,
    italics: italic,
    size,
    color,
    highlight,
    underline,
    font,
  });
}

/**
 * Create a styled paragraph with optional heading level
 */
export function createParagraph(text, options = {}) {
  const {
    bold = false,
    italic = false,
    size = TYPOGRAPHY.bodyText.size,
    color = REPORT_COLORS.textPrimary,
    alignment = AlignmentType.LEFT,
    spacing = { after: SPACING.paragraphAfter },
    heading,
    indent,
    bullet,
    numbering,
  } = options;

  const children = typeof text === 'string'
    ? [createTextRun(text, { bold, italic, size, color })]
    : text;

  return new Paragraph({
    heading,
    alignment,
    spacing,
    indent,
    bullet,
    numbering,
    children,
  });
}

/**
 * Create a document title (centered, large)
 */
export function createDocumentTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: TYPOGRAPHY.documentTitle.size,
        color: REPORT_COLORS.primary,
        font: 'Arial',
      }),
    ],
  });
}

/**
 * Create a section header with phase color and bottom border
 */
export function createSectionHeader(text, phase = 'Foundation', includePhaseLabel = true) {
  const phaseColor = getPhaseColor(phase);
  const labelText = includePhaseLabel ? ` [${phase}]` : '';

  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 240 },
    border: {
      bottom: { color: phaseColor, size: 12, style: BorderStyle.SINGLE },
    },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: TYPOGRAPHY.sectionHeader.size,
        color: phaseColor,
        font: 'Arial',
      }),
      new TextRun({
        text: labelText,
        bold: false,
        size: TYPOGRAPHY.caption.size,
        color: REPORT_COLORS.textMuted,
        font: 'Arial',
      }),
    ],
  });
}

/**
 * Create a subsection header
 */
export function createSubsectionHeader(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 180 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: TYPOGRAPHY.subsectionHeader.size,
        color: REPORT_COLORS.textPrimary,
        font: 'Arial',
      }),
    ],
  });
}

/**
 * Create a sub-subsection header (H3)
 */
export function createH3Header(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: TYPOGRAPHY.subSubsectionHeader.size,
        color: REPORT_COLORS.textPrimary,
        font: 'Arial',
      }),
    ],
  });
}

/**
 * Create a page break wrapped in a paragraph
 */
export function createPageBreak() {
  return new Paragraph({
    children: [new PageBreak()],
  });
}

/**
 * Create a spacer paragraph
 */
export function createSpacer(before = 0, after = 200) {
  return new Paragraph({
    spacing: { before, after },
    children: [],
  });
}

// ============================================
// Evidence Marker Helpers
// ============================================

/**
 * Create an evidence marker with colored highlighting
 */
export function createEvidenceMarker(type, includeSpace = true) {
  const marker = EVIDENCE_MARKERS[type] || EVIDENCE_MARKERS.ASSUMED;
  const space = includeSpace ? ' ' : '';

  return new TextRun({
    text: `${space}[${type}]`,
    size: TYPOGRAPHY.caption.size,
    color: marker.text,
    shading: {
      type: ShadingType.CLEAR,
      fill: marker.background,
    },
    font: 'Arial',
  });
}

/**
 * Create text with evidence marker appended
 */
export function createTextWithEvidence(text, evidenceType) {
  return [
    createTextRun(text, { size: TYPOGRAPHY.bodyText.size }),
    createEvidenceMarker(evidenceType),
  ];
}

/**
 * Create a paragraph with evidence marker
 */
export function createParagraphWithEvidence(text, evidenceType, options = {}) {
  return new Paragraph({
    spacing: { after: SPACING.paragraphAfter },
    ...options,
    children: [
      createTextRun(text, { size: TYPOGRAPHY.bodyText.size }),
      createEvidenceMarker(evidenceType),
    ],
  });
}

// ============================================
// Score & Badge Helpers
// ============================================

/**
 * Create a score badge text run
 */
export function createScoreBadgeRun(score) {
  const badge = getScoreBadge(score);
  return new TextRun({
    text: ` ${score.toFixed(1)} `,
    size: TYPOGRAPHY.tableBody.size,
    color: badge.text,
    shading: {
      type: ShadingType.CLEAR,
      fill: badge.background,
    },
    font: 'Arial',
  });
}

/**
 * Create a status badge text run
 */
export function createStatusBadgeRun(score) {
  const badge = getStatusBadge(score);
  return new TextRun({
    text: ` ${badge.label} `,
    size: TYPOGRAPHY.tableBody.size,
    bold: true,
    color: badge.text,
    shading: {
      type: ShadingType.CLEAR,
      fill: badge.background,
    },
    font: 'Arial',
  });
}

/**
 * Create threshold status indicator
 */
export function createThresholdIndicator(score, threshold) {
  const status = getThresholdStatus(score, threshold);
  return new TextRun({
    text: ` ${status.symbol} `,
    size: TYPOGRAPHY.tableBody.size,
    color: status.color,
    font: 'Arial',
  });
}

// ============================================
// Recommendation Badge Helpers
// ============================================

/**
 * Create a recommendation badge for cover page
 */
export function createRecommendationBadge(recommendation, investmentScore) {
  const style = RECOMMENDATION_STYLES[recommendation] || RECOMMENDATION_STYLES.MAYBE;

  return new Table({
    width: { size: 40, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: style.background, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 16, color: style.border },
              bottom: { style: BorderStyle.SINGLE, size: 16, color: style.border },
              left: { style: BorderStyle.SINGLE, size: 16, color: style.border },
              right: { style: BorderStyle.SINGLE, size: 16, color: style.border },
            },
            margins: {
              top: convertInchesToTwip(0.15),
              bottom: convertInchesToTwip(0.15),
              left: convertInchesToTwip(0.3),
              right: convertInchesToTwip(0.3),
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: style.label,
                    bold: true,
                    size: 36, // 18pt
                    color: style.text,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Investment Readiness Score: ${investmentScore ?? '--'}/100`,
                    size: 28, // 14pt
                    color: style.text,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ============================================
// Table Helpers
// ============================================

/**
 * Standard table border configuration
 */
export const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 1, color: REPORT_COLORS.border },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: REPORT_COLORS.border },
  left: { style: BorderStyle.SINGLE, size: 1, color: REPORT_COLORS.border },
  right: { style: BorderStyle.SINGLE, size: 1, color: REPORT_COLORS.border },
};

/**
 * Create a table cell with standard styling
 */
export function createTableCell(content, options = {}) {
  const {
    bold = false,
    size = TYPOGRAPHY.tableBody.size,
    color = REPORT_COLORS.textPrimary,
    shading,
    alignment = AlignmentType.LEFT,
    width,
    verticalAlign = 'center',
    colSpan,
    rowSpan,
  } = options;

  // Handle content that's already an array of TextRuns or Paragraphs
  let children;
  if (Array.isArray(content)) {
    // Check if it's an array of paragraphs or text runs
    if (content.length > 0 && content[0] instanceof Paragraph) {
      children = content;
    } else {
      children = [
        new Paragraph({
          alignment,
          children: content,
        }),
      ];
    }
  } else if (content instanceof Paragraph) {
    children = [content];
  } else {
    children = [
      new Paragraph({
        alignment,
        children: [
          new TextRun({
            text: content != null ? String(content) : '',
            bold,
            size,
            color: bold && !shading ? REPORT_COLORS.white : color,
            font: 'Arial',
          }),
        ],
      }),
    ];
  }

  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
    borders: TABLE_BORDERS,
    margins: {
      top: SPACING.tableCellPadding,
      bottom: SPACING.tableCellPadding,
      left: 120,
      right: 120,
    },
    verticalAlign,
    columnSpan: colSpan,
    rowSpan,
    children,
  });
}

/**
 * Create a header cell with phase-colored background
 */
export function createHeaderCell(text, options = {}) {
  const { phase = 'Foundation', width, alignment = AlignmentType.CENTER, colSpan } = options;
  const phaseColor = getPhaseColor(phase);

  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: { fill: phaseColor, type: ShadingType.CLEAR },
    borders: TABLE_BORDERS,
    margins: {
      top: SPACING.tableCellPadding,
      bottom: SPACING.tableCellPadding,
      left: 120,
      right: 120,
    },
    columnSpan: colSpan,
    children: [
      new Paragraph({
        alignment,
        children: [
          new TextRun({
            text,
            bold: true,
            size: TYPOGRAPHY.tableHeader.size,
            color: REPORT_COLORS.white,
            font: 'Arial',
          }),
        ],
      }),
    ],
  });
}

/**
 * Create a data table with headers and rows
 */
export function createScoreTable(headers, rows, options = {}) {
  const {
    phase = 'Foundation',
    columnWidths,
    alternateRowShading = true,
  } = options;

  const tableRows = [
    // Header row
    new TableRow({
      tableHeader: true,
      children: headers.map((header, i) =>
        createHeaderCell(header, {
          phase,
          width: columnWidths?.[i],
          alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
        })
      ),
    }),
    // Data rows
    ...rows.map((row, rowIndex) =>
      new TableRow({
        children: row.map((cell, cellIndex) => {
          const isFirstColumn = cellIndex === 0;
          const cellContent = typeof cell === 'object' ? cell.content : cell;
          const cellOptions = typeof cell === 'object' ? cell : {};

          return createTableCell(cellContent, {
            width: columnWidths?.[cellIndex],
            alignment: isFirstColumn ? AlignmentType.LEFT : AlignmentType.CENTER,
            shading: alternateRowShading && rowIndex % 2 === 1
              ? REPORT_COLORS.backgroundLight
              : cellOptions.shading,
            bold: cellOptions.bold,
            color: cellOptions.color,
          });
        }),
      })
    ),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: columnWidths,
    rows: tableRows,
  });
}

/**
 * Create a simple key-value info table
 */
export function createInfoTable(data, options = {}) {
  const { phase = 'Foundation', labelWidth = 2500 } = options;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [labelWidth, TABLE_WIDTHS.full - labelWidth],
    rows: data.map((item, index) =>
      new TableRow({
        children: [
          createTableCell(item.label, {
            bold: true,
            width: labelWidth,
            shading: index % 2 === 1 ? REPORT_COLORS.backgroundLight : undefined,
          }),
          createTableCell(item.value, {
            width: TABLE_WIDTHS.full - labelWidth,
            shading: index % 2 === 1 ? REPORT_COLORS.backgroundLight : undefined,
          }),
        ],
      })
    ),
  });
}

// ============================================
// List Helpers
// ============================================

/**
 * Create a bullet list item
 */
export function createBulletItem(text, options = {}) {
  const { level = 0, color = REPORT_COLORS.textPrimary } = options;

  return new Paragraph({
    bullet: { level },
    spacing: { after: 120 },
    children: typeof text === 'string'
      ? [createTextRun(text, { color })]
      : text,
  });
}

/**
 * Create a numbered list item
 */
export function createNumberedItem(text, number, options = {}) {
  const { color = REPORT_COLORS.textPrimary } = options;

  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: SPACING.listItemIndent },
    children: [
      createTextRun(`${number}. `, { bold: true, color }),
      ...(typeof text === 'string'
        ? [createTextRun(text, { color })]
        : text),
    ],
  });
}

// ============================================
// Image Helpers
// ============================================

/**
 * Create an image from base64 data
 */
export function createChartImage(base64Data, width, height, altText = 'Chart') {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [
      new ImageRun({
        type: 'png',
        data: base64Data,
        transformation: { width, height },
        altText: {
          title: altText,
          description: altText,
          name: altText.toLowerCase().replace(/\s+/g, '-'),
        },
      }),
    ],
  });
}

// ============================================
// Filename Helpers
// ============================================

/**
 * Generate a safe filename from project name
 */
export function generateReportFilename(projectName, date) {
  const year = new Date(date || Date.now()).getFullYear();
  const reportNumber = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  const safeName = (projectName || 'Assessment')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
  const dateStr = (date || new Date().toISOString().split('T')[0]).replace(/-/g, '');

  return `360-BVR-${year}-${reportNumber}-${safeName}-${dateStr}.docx`;
}

/**
 * Generate a report ID
 */
export function generateReportId(date) {
  const year = new Date(date || Date.now()).getFullYear();
  const reportNumber = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `360-BVR-${year}-${reportNumber}`;
}

// ============================================
// Data Formatting Helpers
// ============================================

/**
 * Format a score with appropriate precision
 */
export function formatScore(score, decimals = 1) {
  if (score == null || isNaN(score)) return '--';
  return Number(score).toFixed(decimals);
}

/**
 * Format a percentage
 */
export function formatPercentage(value, decimals = 0) {
  if (value == null || isNaN(value)) return '--';
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text, maxLength = 300) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str) {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
