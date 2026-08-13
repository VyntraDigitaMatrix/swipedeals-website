// Single source of truth for the SwipeDeals color system.
// Import colors from this file anywhere instead of hardcoding hex values.
// These values are mirrored in the Tailwind v4 @theme block in src/index.css —
// if you change a value here, update the matching CSS variable there too.

export const colors = {
  primary: '#6E0D25',
  primaryDark: '#4B0819',
  primaryLight: '#8B1E3F',
  secondary: '#B34763',
  accent: '#E9A3B8',

  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  info: '#2563EB',

  background: '#F8F9FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F7',
  border: '#E6E8EC',

  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  shadow: 'rgba(0,0,0,.08)',

  gradientStart: '#6E0D25',
  gradientEnd: '#A5274F',
}

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
  hero: `linear-gradient(120deg, ${colors.primaryDark} 0%, ${colors.primary} 45%, ${colors.secondary} 100%)`,
  radialGlow: `radial-gradient(circle at 30% 20%, ${colors.secondary} 0%, transparent 60%)`,
}

export default colors
