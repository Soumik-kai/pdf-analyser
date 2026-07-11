// "Solar Flare" theme — deep cosmic violet base with electric violet + molten amber accents.
const theme = {
  colors: {
    bgPrimary: '#0a0614',
    bgPanel: 'rgba(24, 15, 38, 0.65)',
    bgCard: 'rgba(42, 24, 61, 0.4)',
    bgCardHover: 'rgba(42, 24, 61, 0.6)',
    bgInput: 'rgba(20, 12, 32, 0.5)',

    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.16)',
    borderFocus: 'rgba(139, 92, 246, 0.5)',

    accentCyan: '#f59e0b',
    accentIndigo: '#8b5cf6',
    accentPurple: '#d946ef',
    accentPink: '#fb7185',
    accentGreen: '#10b981',
    accentRed: '#ef4444',
    accentTeal: '#2dd4bf',
    accentBlue: '#38bdf8',
    accentLime: '#a3e635',
    accentGold: '#fbbf24',

    textPrimary: '#faf5ff',
    textSecondary: '#c4b5da',
    textMuted: '#8a7ca3',
    textWhite: '#ffffff',

    glowCyan: '0 0 15px rgba(245, 158, 11, 0.5)',
    glowIndigo: '0 0 15px rgba(139, 92, 246, 0.5)',
  },
  glass: {
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
  borderRadius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    round: '9999px',
  },
  fontFamily: {
    sans: "'Plus Jakarta Sans', sans-serif",
    display: "'Syne', sans-serif",
  },
  transitions: {
    default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }
};

export default theme;
