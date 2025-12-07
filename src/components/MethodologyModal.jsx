// ============================================
// MethodologyModal Component
// Explains the VIANEO Business Model assessment framework
// ============================================

import React, { useEffect, useRef, useCallback, memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';
import {
  DIMENSIONS,
  EVIDENCE_MARKERS,
  PROCESS_PHASES,
  SCORING_REQUIREMENTS,
} from '../constants/methodology.js';

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

  // Manage focus and body scroll - improved cleanup handling
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousActiveElement.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    const timerId = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousActiveElement.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="methodology-modal-overlay"
      style={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="methodology-modal-container"
        style={styles.modalContainer}
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
              {SCORING_REQUIREMENTS.map((item) => (
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
    </div>
  );
};

export const MethodologyModal = memo(MethodologyModalComponent);
