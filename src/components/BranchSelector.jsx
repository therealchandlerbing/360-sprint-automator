// ============================================
// Branch Selector Component
// Selection for application format (Step 1)
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

const BRANCHES = [
  { id: '360SIS', name: '360 Social Impact Studios', icon: '🌍', desc: 'Social impact metrics, SDG alignment' },
  { id: 'CNEN', name: 'CNEN', icon: '🇧🇷', desc: 'Brazil Nuclear Commission format' }
];

/**
 * Branch selection modal for Step 1
 */
export const BranchSelector = ({ onSelect }) => {
  return (
    <div style={styles.card}>
      <div className="card-header" style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Select Application Format</h3>
      </div>
      <div className="card-body" style={styles.cardBody}>
        <p style={{ margin: '0 0 16px', color: COLORS.textSecondary }}>
          Choose the program format for the application form:
        </p>
        <div className="branch-grid" style={styles.branchGrid}>
          {BRANCHES.map(branch => (
            <button
              key={branch.id}
              onClick={() => onSelect(branch.id)}
              style={styles.branchButton}
              onMouseEnter={e => { e.target.style.borderColor = COLORS.primaryAccent; e.target.style.backgroundColor = COLORS.phases['Foundation'].light; }}
              onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.backgroundColor = COLORS.background; }}
            >
              <div style={styles.branchIcon}>{branch.icon}</div>
              <div style={styles.branchName}>{branch.name}</div>
              <div style={styles.branchDesc}>{branch.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
