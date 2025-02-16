/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'primary-light': '#8B5CF6',
        'secondary-light': '#F3F4F6',
        'background-light': '#FFFFFF',
        'text-light': '#1F2937',
        
        // Dark mode colors
        'primary-dark': '#A78BFA',
        'secondary-dark': '#374151',
        'background-dark': '#111827',
        'text-dark': '#F9FAFB',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--tw-prose-body)',
            '--tw-prose-body': 'theme(colors.text-dark)',
            '--tw-prose-headings': 'theme(colors.text-dark)',
            '--tw-prose-links': 'theme(colors.primary-dark)',
            '--tw-prose-bold': 'theme(colors.text-dark)',
            '--tw-prose-code': 'theme(colors.primary-dark)',
            '--tw-prose-quotes': '#94A3B8',
            
            // Light mode overrides
            '.light &': {
              '--tw-prose-body': 'theme(colors.text-light)',
              '--tw-prose-headings': 'theme(colors.text-light)',
              '--tw-prose-links': 'theme(colors.primary-light)',
              '--tw-prose-bold': 'theme(colors.text-light)',
              '--tw-prose-code': 'theme(colors.primary-light)',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-subtle': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};