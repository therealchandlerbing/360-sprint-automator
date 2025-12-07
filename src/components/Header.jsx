// ============================================
// Header Component
// Top header with logo, title, and progress
// Enhanced logo with gradient and hover effect
// ============================================

import React, { memo, useState, useRef, useEffect } from 'react';
import { STEPS } from '../constants/steps.js';
import { styles } from '../styles/appStyles.js';

// Enhanced logo styles
const logoStyles = {
  base: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: '#FFFFFF',
    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)',
    transition: 'all 0.2s ease',
    cursor: 'default',
    flexShrink: 0,
  },
  hover: {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)',
  },
};

/**
 * Application header with branding, waffle menu, and progress indicator
 * Memoized to prevent re-renders when input content changes
 */
const HeaderComponent = ({
  completedSteps,
  onOpenMethodology,
  onToggleMobileMenu,
}) => {
  const [isWaffleMenuOpen, setIsWaffleMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
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

  const handleNavigationClick = () => {
    setIsWaffleMenuOpen(false);
    onToggleMobileMenu();
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
                  className="waffle-dropdown-item mobile-only"
                  onClick={handleNavigationClick}
                  role="menuitem"
                >
                  <span className="waffle-dropdown-icon" aria-hidden="true">☰</span>
                  <span>Navigation</span>
                </button>
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
          <div
            className="logo"
            style={{
              ...logoStyles.base,
              ...(logoHovered ? logoStyles.hover : {}),
            }}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            aria-hidden="true"
          >
            V
          </div>
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
