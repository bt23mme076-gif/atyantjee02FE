/**
 * Atyant Design Tokens
 * Shared design system for main site (atyant.in) and launchpad vertical
 *
 * These tokens ensure visual consistency across all verticals and should be
 * updated in this centralized location, then referenced in tailwind.config.js
 */

export const designTokens = {
  // Primary Brand Colors
  colors: {
    // Core Brand
    primary: {
      dark: '#0B0F2E', // Dark navy background (main site header)
      darkAlt: '#1a1f3a', // Alternative dark navy
      purple: '#8B5CF6', // Main purple accent
      purpleAlt: '#7C3AED', // Alternative purple
      orange: '#FF6B2B', // Accent orange
      orangeAlt: '#ff8a57', // Alternative orange
    },

    // Neutrals
    neutral: {
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
    },

    // Semantic Colors
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      blue: '#0B72FF', // Alternative blue
    },

    // Gradients (for Tailwind via arbitrary values)
    gradients: {
      purpleToOrange: 'linear-gradient(to right, #8B5CF6, #FF6B2B)',
      darkToPurple: 'linear-gradient(135deg, #0B0F2E, #8B5CF6)',
      orangeGlow: 'linear-gradient(to bottom right, #FF6B2B, #ff8a57)',
    },
  },

  // Typography System
  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
    },

    fontSizes: {
      xs: ['12px', { lineHeight: '1.5rem' }],
      sm: ['14px', { lineHeight: '1.5rem' }],
      base: ['16px', { lineHeight: '1.5rem' }],
      lg: ['18px', { lineHeight: '1.75rem' }],
      xl: ['20px', { lineHeight: '1.75rem' }],
      '2xl': ['24px', { lineHeight: '2rem' }],
      '3xl': ['30px', { lineHeight: '2.25rem' }],
      '4xl': ['36px', { lineHeight: '2.5rem' }],
      '5xl': ['48px', { lineHeight: '3rem' }],
      '6xl': ['60px', { lineHeight: '3.5rem' }],
    },

    fontWeights: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    lineHeights: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing Scale
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    // Brand shadows
    orangeGlow: '0 0 20px rgba(255, 107, 43, 0.25)',
    purpleGlow: '0 0 20px rgba(139, 92, 246, 0.25)',
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index Scale
  zIndex: {
    hide: '-1',
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    sticky: '20',
    dropdown: '1000',
    fixed: '1020',
    backdrop: '1040',
    offcanvas: '1050',
    modal: '1060',
    popover: '1070',
    tooltip: '1080',
  },
};

// Export individual token categories for easier consumption
export const { colors, typography, spacing, borderRadius, shadows, breakpoints, zIndex } =
  designTokens;

export default designTokens;
