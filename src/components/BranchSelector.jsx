// ============================================
// Branch Selector Component
// Selection for application format (Step 1)
// ============================================

import React, { useState, memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

const BRANCHES = [
  { id: '360SIS', name: '360 Social Impact Studios', icon: '🌍', desc: 'Social impact metrics, SDG alignment' },
  { id: 'CNEN', name: 'CNEN', icon: '🇧🇷', desc: 'Brazil Nuclear Commission format' }
];

/**
 * Individual branch button with hover state management
 * Manages its own hover state to avoid direct style manipulation
 */
const BranchButton = memo(({ branch, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    ...styles.branchButton,
    ...(isHovered && {
      borderColor: COLORS.primaryAccent,
      backgroundColor: COLORS.phases['Foundation'].light,
    })
  };

  return (
    <button
      onClick={() => onSelect(branch.id)}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={`Select ${branch.name}: ${branch.desc}`}
    >
      <div style={styles.branchIcon} aria-hidden="true">{branch.icon}</div>
      <div style={styles.branchName}>{branch.name}</div>
      <div style={styles.branchDesc}>{branch.desc}</div>
    </button>
  );
});

BranchButton.displayName = 'BranchButton';

/**
 * Branch selection modal for Step 1
 * Memoized to prevent unnecessary re-renders
 */
const BranchSelectorComponent = ({ onSelect }) => {
  return (
    <section style={styles.card} aria-label="Application format selection">
      <div className="card-header" style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Select Application Format</h3>
      </div>
      <div className="card-body" style={styles.cardBody}>
        <p id="branch-selector-description" style={{ margin: '0 0 16px', color: COLORS.textSecondary }}>
          Choose the program format for the application form:
        </p>
        <div
          className="branch-grid"
          style={styles.branchGrid}
          role="group"
          aria-labelledby="branch-selector-description"
        >
          {BRANCHES.map(branch => (
            <BranchButton
              key={branch.id}
              branch={branch}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const BranchSelector = memo(BranchSelectorComponent);
