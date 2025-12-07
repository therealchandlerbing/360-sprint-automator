// ============================================
// Header Component
// Top header with logo, title, and progress
// ============================================

import React, { memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { STEPS } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

/**
 * Application header with branding, methodology link, and progress indicator
 * Memoized to prevent re-renders when input content changes
 */
const HeaderComponent = ({
  completedSteps,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onOpenMethodology,
}) => {
  const progressPercent = Math.round((completedSteps / STEPS.length) * 100);

  return (
    <header style={styles.header} role="banner">
      <div className="header-inner" style={styles.headerInner}>
        <div style={styles.logoSection}>
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="navigation-sidebar"
            style={styles.mobileMenuButton}
          >
            <span style={styles.mobileMenuIcon} aria-hidden="true">
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
          <div className="logo" style={styles.logo} aria-hidden="true">V</div>
          <div>
            <h1 className="header-title" style={styles.headerTitle}>VIANEO Sprint Automator</h1>
            <p className="header-subtitle" style={styles.headerSubtitle}>Evidence-Based Business Validation</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Methodology Trigger */}
          <button
            className="methodology-trigger"
            onClick={onOpenMethodology}
            type="button"
            aria-label="Learn about the VIANEO methodology"
          >
            <span className="methodology-trigger-icon" aria-hidden="true">ⓘ</span>
            <span>Methodology</span>
          </button>
          {/* Progress Section */}
          <div className="progress-section" style={styles.progressSection} role="status" aria-live="polite">
            <div style={styles.progressLabel}>Sprint Progress</div>
            <div style={styles.progressValue}>{completedSteps} of {STEPS.length} steps</div>
            <div
              style={styles.progressBar}
              role="progressbar"
              aria-valuenow={completedSteps}
              aria-valuemin={0}
              aria-valuemax={STEPS.length}
              aria-label={`${completedSteps} of ${STEPS.length} steps completed`}
            >
              <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const Header = memo(HeaderComponent);
