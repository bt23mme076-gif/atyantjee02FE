/** @type {import('tailwindcss').Config} */

// Atyant Design Tokens - Shared across all verticals
const colors = {
  // Brand Colors
  primary: '#8B5CF6',      // Purple
  dark: '#0B0F2E',         // Dark navy
  'brand-orange': '#FF6B2B', // Accent orange
  'brand-blue': '#0B72FF',   // Alternative blue
  
  // Neutrals
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
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors,
      borderRadius: {
        full: '9999px',
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(255, 107, 43, 0.25)',
        'purple-glow': '0 0 20px rgba(139, 92, 246, 0.25)',
      },
      backgroundImage: {
        'gradient-purple-orange': 'linear-gradient(to right, #8B5CF6, #FF6B2B)',
        'gradient-dark-purple': 'linear-gradient(135deg, #0B0F2E, #8B5CF6)',
      },
    },
  },
  plugins: [],
};
