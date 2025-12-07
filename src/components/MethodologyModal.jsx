// ============================================
// MethodologyModal Component
// Explains the VIANEO Business Model assessment framework
// ============================================

import React, { useEffect, useRef, useCallback, memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

// Dimension data
const DIMENSIONS = [
  {
    id: 'legitimacy',
    name: 'Legitimacy',
    weight: 15,
    threshold: 3.0,
    question: 'Is there a real, validated problem worth solving?',
    details: [
      'Problem validation and evidence',
      'Market need documentation',
      'Pain point quantification',
    ],
  },
  {
    id: 'desirability',
    name: 'Desirability',
    weight: 25,
    threshold: 3.5,
    question: 'Do specific people want YOUR solution?',
    details: [
      'Requester identification (people, not organizations)',
      'Needs validation with specific evidence',
      'Willingness to pay or adopt',
    ],
    isEmphasis: true,
  },
  {
    id: 'acceptability',
    name: 'Acceptability',
    weight: 20,
    threshold: 3.0,
    question: 'Will the ecosystem support you?',
    details: [
      'Ecosystem player mapping',
      'Influencer and blocker identification',
      'Regulatory and compliance landscape',
    ],
  },
  {
    id: 'feasibility',
    name: 'Feasibility',
    weight: 20,
    threshold: 3.0,
    question: 'Can you actually build and deliver it?',
    details: [
      'Technical capability assessment',
      'Team composition and expertise',
      'Development status and roadmap',
    ],
  },
  {
    id: 'viability',
    name: 'Viability',
    weight: 20,
    threshold: 3.0,
    question: 'Is the business model economically sustainable?',
    details: [
      'Business model clarity',
      'Revenue model validation',
      'Unit economics and sustainability',
    ],
  },
];

// Evidence markers with their colors
const EVIDENCE_MARKERS = [
  { tag: 'VALIDATED', desc: 'Direct evidence from primary sources', color: '#10B981', bg: '#D1FAE5' },
  { tag: 'LIKELY', desc: 'Strong indirect evidence or logical inference', color: '#0D9488', bg: '#CCFBF1' },
  { tag: 'ASSUMED', desc: 'Reasonable assumption without direct evidence', color: '#F59E0B', bg: '#FEF3C7' },
  { tag: 'UNVALIDATED', desc: 'Claim made without supporting evidence', color: '#EF4444', bg: '#FEE2E2' },
  { tag: 'DISPUTED', desc: 'Conflicting evidence or questionable claims', color: '#8B5CF6', bg: '#EDE9FE' },
];

// Process phases
const PROCESS_PHASES = [
  {
    name: 'Foundation (Steps 0-3)',
    items: [
      'Extract and structure core business information',
      'Initial scoring across all 5 VIANEO dimensions',
    ],
  },
  {
    name: 'Deep Dive (Steps 4-9)',
    items: [
      'Validate the problem (Legitimacy)',
      'Map stakeholders and their needs (Desirability)',
      'Assess ecosystem players (Acceptability)',
    ],
  },
  {
    name: 'Synthesis (Steps 10-11)',
    items: [
      'Connect findings into executive decision brief',
      'Align features to validated needs',
    ],
  },
  {
    name: 'Final Assessment (Step 12)',
    items: [
      'Final viability scoring and gate recommendation',
      'GO / CONDITIONAL / NO-GO decision',
    ],
  },
];

/**
 * DimensionCard - Renders a single dimension card
 */
const DimensionCard = memo(({ dimension }) => {
  const dimColor = COLORS.dimensions[dimension.id];
  const cardStyle = dimension.isEmphasis ? styles.dimensionCardEmphasis : styles.dimensionCard;

  return (
    <div
      style={{
        ...cardStyle,
        borderLeftColor: dimColor.bg,
        backgroundColor: dimColor.light,
      }}
    >
      <div style={styles.dimensionHeader}>
        <span style={styles.dimensionName}>{dimension.name}</span>
        <span style={{ ...styles.dimensionBadge, backgroundColor: dimColor.bg }}>
          {dimension.weight}%
        </span>
      </div>
      <div style={styles.dimensionThreshold}>
        Threshold: ≥{dimension.threshold.toFixed(1)}
        {dimension.isEmphasis && <span style={{ marginLeft: '8px', color: COLORS.warning, fontWeight: '600' }}>← Highest Bar</span>}
      </div>
      <div style={styles.dimensionQuestion}>"{dimension.question}"</div>
      <div style={styles.dimensionDetails}>
        {dimension.details.map((detail, idx) => (
          <div key={idx} style={{ marginBottom: idx < dimension.details.length - 1 ? '4px' : 0 }}>
            • {detail}
          </div>
        ))}
      </div>
    </div>
  );
});

DimensionCard.displayName = 'DimensionCard';

/**
 * MethodologyModal - Full modal component with methodology content
 */
const MethodologyModalComponent = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const closeButtonRef = useRef(null);

  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // Focus trap
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Manage focus and body scroll
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      // Focus close button after a brief delay for animation
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        ...styles.modalOverlay,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        style={{
          ...styles.modalContainer,
          animation: 'scaleIn 0.2s ease-out',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-modal-title"
      >
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 id="methodology-modal-title" style={styles.modalTitle}>
            VIANEO Business Model
          </h2>
          <button
            ref={closeButtonRef}
            style={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Close methodology modal"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={styles.modalContent}>
          {/* Hero Statement */}
          <div style={styles.modalSection}>
            <p style={styles.modalHeroText}>
              The VIANEO Business Model is a structured methodology for evidence-based business validation,
              developed through years of startup assessment experience across accelerators, investment committees,
              and corporate innovation programs.
            </p>
            <p style={styles.modalHeroEmphasis}>
              This tool automates the complete 13-step assessment process, evaluating ventures across 5 critical
              dimensions to produce committee-ready, investor-presentable outputs.
            </p>
          </div>

          {/* The 5 VIANEO Dimensions */}
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionHeader}>The 5 VIANEO Dimensions</h3>
            {DIMENSIONS.map((dimension) => (
              <DimensionCard key={dimension.id} dimension={dimension} />
            ))}
            <div style={styles.modalCalloutEmphasis}>
              The weighted average must reach ≥3.2 AND each individual dimension must meet its threshold.
              A single weak dimension can derail an otherwise strong venture.
            </div>
          </div>

          {/* The 13-Step Process */}
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionHeader}>The 13-Step Process</h3>
            <p style={{ ...styles.modalHeroText, marginBottom: '20px' }}>
              The 13 steps are organized into workflow phases that systematically validate each dimension:
            </p>
            {PROCESS_PHASES.map((phase, idx) => (
              <div key={idx} style={styles.processPhase}>
                <div style={styles.processPhaseName}>{phase.name}</div>
                <ul style={styles.processPhaseList}>
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div style={styles.modalCallout}>
              <strong>Note:</strong> Core steps (0, 2, 3) are required. Others selected based on project needs.
            </div>
          </div>

          {/* Evidence Standards */}
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionHeader}>Evidence Standards</h3>
            <div style={{ ...styles.modalCalloutEmphasis, marginBottom: '20px', marginTop: 0 }}>
              AI is an acceleration tool, not a validation tool. Every claim must be supported by evidence.
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '12px' }}>
                Evidence Markers:
              </div>
              <ul style={styles.evidenceList}>
                {EVIDENCE_MARKERS.map((marker) => (
                  <li key={marker.tag} style={styles.evidenceItem}>
                    <span
                      style={{
                        ...styles.evidenceMarker,
                        backgroundColor: marker.bg,
                        color: marker.color,
                      }}
                    >
                      {marker.tag}
                    </span>
                    <span>{marker.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.scoreRequirements}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '12px' }}>
                Scoring Requirements (1-5 scale):
              </div>
              {[
                { score: 5, desc: 'External validation, documented evidence, multiple sources' },
                { score: 4, desc: 'Some external validation, clear capability demonstrated' },
                { score: 3, desc: 'Internal validation only, reasonable assumptions' },
                { score: 2, desc: 'Significant gaps, acknowledged but unaddressed' },
                { score: 1, desc: 'Critical gap requiring immediate attention (RED FLAG)' },
              ].map((item) => (
                <div key={item.score} style={styles.scoreItem}>
                  <span style={styles.scoreNumber}>{item.score}</span>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>

            <div style={styles.modalCallout}>
              <strong>Key principle:</strong> When uncertain, score lower. Conservative scoring protects decision quality.
            </div>
          </div>

          {/* Output & Decision Framework */}
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionHeader}>Output & Decision Framework</h3>

            <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '12px' }}>
              Assessment Outputs:
            </div>
            <ul style={styles.outputList}>
              <li>Diagnostic scorecard across all 5 dimensions</li>
              <li>Weighted market maturity rating</li>
              <li>Stakeholder and ecosystem mapping</li>
              <li>Final viability recommendation with risk register</li>
            </ul>

            <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '12px' }}>
              Decision Framework:
            </div>
            <div style={styles.decisionGrid}>
              <div style={{ ...styles.decisionCard, backgroundColor: '#D1FAE5' }}>
                <div style={{ ...styles.decisionLabel, color: '#059669' }}>GO</div>
                <div style={{ ...styles.decisionDesc, color: '#065F46' }}>
                  Meets all thresholds (overall ≥3.2, dimensions at threshold)
                </div>
              </div>
              <div style={{ ...styles.decisionCard, backgroundColor: '#FEF3C7' }}>
                <div style={{ ...styles.decisionLabel, color: '#D97706' }}>CONDITIONAL</div>
                <div style={{ ...styles.decisionDesc, color: '#92400E' }}>
                  Near thresholds with addressable gaps
                </div>
              </div>
              <div style={{ ...styles.decisionCard, backgroundColor: '#FEE2E2' }}>
                <div style={{ ...styles.decisionLabel, color: '#DC2626' }}>NO-GO</div>
                <div style={{ ...styles.decisionDesc, color: '#991B1B' }}>
                  Below thresholds with fundamental concerns
                </div>
              </div>
            </div>

            <div style={styles.maturityStages}>
              <span style={styles.maturityStage}>IDEA</span>
              <span style={styles.maturityArrow}>→</span>
              <span style={styles.maturityStage}>PROOF</span>
              <span style={styles.maturityArrow}>→</span>
              <span style={styles.maturityStage}>PROMISING</span>
              <span style={styles.maturityArrow}>→</span>
              <span style={styles.maturityStage}>LAUNCH</span>
              <span style={styles.maturityArrow}>→</span>
              <span style={styles.maturityStage}>GROWTH</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          VIANEO Business Model methodology. Assessment automation by 360 Social Impact Studios.
        </div>
      </div>

      {/* Animation styles injected via style tag */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export const MethodologyModal = memo(MethodologyModalComponent);
