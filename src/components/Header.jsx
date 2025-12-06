// ============================================
// Header Component
// Top header with logo, title, and progress
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors.js';
import { STEPS } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

/**
 * Application header with branding and progress indicator
 */
export const Header = ({
  completedSteps,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const progressPercent = Math.round((completedSteps / STEPS.length) * 100);

  return (
    <header style={styles.header}>
      <div className="header-inner" style={styles.headerInner}>
        <div style={styles.logoSection}>
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="navigation-sidebar"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            <span style={{ color: COLORS.white, fontSize: '20px' }} aria-hidden="true">
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
          <div className="logo" style={styles.logo}>V</div>
          <div>
            <h1 className="header-title" style={styles.headerTitle}>VIANEO Sprint Automator</h1>
            <p className="header-subtitle" style={styles.headerSubtitle}>Evidence-Based Business Validation</p>
          </div>
        </div>
        <div className="progress-section" style={styles.progressSection}>
          <div style={styles.progressLabel}>Sprint Progress</div>
          <div style={styles.progressValue}>{completedSteps} of {STEPS.length} steps</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
};
