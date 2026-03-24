export const Colors = {
  // Base
  background: '#FFFFFF',
  surface: '#F7F7F7',
  surfaceAlt: '#EEEEEE',
  border: '#E5E5E5',

  // Text
  text: '#1A1A1A',
  textMuted: '#6B6B6B',
  textSubtle: '#ABABAB',
  textInverse: '#FFFFFF',

  // Brand / Primary (Duolingo green)
  primary: '#58CC02',
  primaryDark: '#46A302',
  primaryLight: '#D7F5A0',
  primarySurface: '#F0FBE3',

  // Accent - yellow
  accent: '#FFC800',
  accentDark: '#E6A000',
  accentSurface: '#FFF8E1',

  // Score bands — bright & clear
  scoreClean: '#58CC02',       // green
  scoreLow: '#89E219',         // light green
  scoreModerate: '#FFC800',    // yellow
  scoreAttention: '#FF9600',   // orange
  scoreHigh: '#FF4B4B',        // red

  // Severity
  severityInfo: '#1CB0F6',
  severityCaution: '#FFC800',
  severityWarning: '#FF4B4B',

  // Special UI
  cardShadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.4)',

  // Tab bar
  tabActive: '#58CC02',
  tabInactive: '#ABABAB',
  tabBar: '#FFFFFF',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 38,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },
} as const;
