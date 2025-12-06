// ============================================
// Branch Selector Component
// Selection for application format (Step 1)
// ============================================

import React, { memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

const BRANCHES = [
  { id: '360SIS', name: '360 Social Impact Studios', icon: '🌍', desc: 'Social impact metrics, SDG alignment' },
  { id: 'CNEN', name: 'CNEN', icon: '🇧🇷', desc: 'Brazil Nuclear Commission format' }
];

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
            <button
              key={branch.id}
              onClick={() => onSelect(branch.id)}
              style={styles.branchButton}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryAccent; e.currentTarget.style.backgroundColor = COLORS.phases['Foundation'].light; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.backgroundColor = COLORS.background; }}
              aria-label={`Select ${branch.name}: ${branch.desc}`}
            >
              <div style={styles.branchIcon} aria-hidden="true">{branch.icon}</div>
              <div style={styles.branchName}>{branch.name}</div>
              <div style={styles.branchDesc}>{branch.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const BranchSelector = memo(BranchSelectorComponent);
