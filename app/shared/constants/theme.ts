/**
 * Theme color configuration
 * Change these values to update colors throughout the entire application
 */
export const THEME_COLORS = {
  // Primary colors
  background: '#f8f9fa',
  foreground: '#1a1a1a',
  
  // Secondary colors
  secondary: '#6b7280',
  secondaryForeground: '#ffffff',
  
  // Accent colors
  accent: '#6366f1',
  accentForeground: '#ffffff',
  
  // Navigation colors
  navBackground: 'rgba(15, 23, 42, 0.8)', // slate-900/80
  navBorder: '#1e293b', // slate-800
  navTextActive: '#f1f5f9', // slate-100
  navTextInactive: '#94a3b8', // slate-400
  navTextHover: '#e2e8f0', // slate-200
  
  // Page content colors
  pageBackground: '#e2e8f0', // slate-200
  pageText: '#f1f5f9', // slate-100
  pageTextPrimary: '#0f172a', // slate-900
  pageTextSecondary: 'rgba(15, 23, 42, 0.5)', // slate-900/50
  
  // Font families
  fontPrimary: 'var(--font-geist-sans)',
  fontSecondary: 'var(--font-geist-mono)',
} as const;

/**
 * Helper to convert hex colors to RGB for opacity support
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '';
}

