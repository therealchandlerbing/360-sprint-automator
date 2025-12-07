// ============================================
// Header Component
// Top header with logo, title, and progress
// ============================================

import React, { memo, useState, useRef, useEffect } from 'react';
import { STEPS } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

/**
 * Application header with branding, waffle menu, and progress indicator
 * Memoized to prevent re-renders when input content changes
 */
const HeaderComponent = ({
  completedSteps,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onOpenMethodology,
}) => {
  const [isWaffleMenuOpen, setIsWaffleMenuOpen] = useState(false);
  const waffleMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (waffleMenuRef.current && !waffleMenuRef.current.contains(event.target)) {
        setIsWaffleMenuOpen(false);
      }
    };

    if (isWaffleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWaffleMenuOpen]);

  const handleMethodologyClick = () => {
    setIsWaffleMenuOpen(false);
    onOpenMethodology();
  };
  const progressPercent = Math.round((completedSteps / STEPS.length) * 100);

  return (
    <header style={styles.header} role="banner">
      <div className="header-inner" style={styles.headerInner}>
        <div style={styles.logoSection}>
          {/* Waffle Menu Button with Dropdown */}
          <div className="waffle-menu-container" ref={waffleMenuRef} style={{ position: 'relative' }}>
            <button
              className="waffle-menu-btn"
              onClick={() => setIsWaffleMenuOpen(!isWaffleMenuOpen)}
              aria-label={isWaffleMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isWaffleMenuOpen}
              aria-haspopup="true"
            >
              <span style={{ fontSize: '20px', color: '#FFFFFF' }} aria-hidden="true">
                {isWaffleMenuOpen ? '✕' : '☰'}
              </span>
            </button>
            {/* Waffle Dropdown Menu */}
            {isWaffleMenuOpen && (
              <div
                className="waffle-dropdown"
                role="menu"
                aria-label="Application menu"
              >
                <button
                  className="waffle-dropdown-item"
                  onClick={handleMethodologyClick}
                  role="menuitem"
                >
                  <span className="waffle-dropdown-icon" aria-hidden="true">ⓘ</span>
                  <span>Methodology</span>
                </button>
              </div>
            )}
          </div>
          {/* Mobile Menu Button (for sidebar toggle on mobile) */}
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
          {/* Progress Section */}
          <div className="progress-section" style={styles.progressSection} role="status" aria-live="polite">
            <div style={styles.progressLabel}>Sprint Progress</div>
            <div style={styles.progressValue}>{completedSteps} of {STEPS.length} completed</div>
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
