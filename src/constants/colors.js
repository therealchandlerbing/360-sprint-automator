// ============================================
// Design System: Stripe-inspired palette
// ============================================

export const COLORS = {
  // Primary brand (Stripe-inspired deep blue)
  primary: '#0A2540',
  primaryLight: '#1A365D',
  primaryAccent: '#00A3B5',

  // Phase colors (WCAG AA compliant on white backgrounds)
  phases: {
    'Foundation': { bg: '#0A2540', text: '#FFFFFF', light: '#E8F4F8' },
    'Deep Dive': { bg: '#0D5A66', text: '#FFFFFF', light: '#E0F2F1' },
    'Synthesis': { bg: '#1E6B4F', text: '#FFFFFF', light: '#E8F5E9' },
    'Viability': { bg: '#7C3AED', text: '#FFFFFF', light: '#EDE9FE' },
  },

  // Neutrals
  white: '#FFFFFF',
  background: '#F7FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#EDF2F7',

  // Text (proper contrast ratios)
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.8)',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  error: '#EF4444',
};
