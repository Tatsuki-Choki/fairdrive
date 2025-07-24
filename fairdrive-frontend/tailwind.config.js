/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gray': {
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
        sand: "#F7F5F2",
        soot: "#1C1C1C",
        sage: "#707060",
        stone: "#E5E5E0",
        // 2025 Design System Colors
        dark: {
          base: '#111111',
          surface: '#1A1A1A',
          border: '#2A2A2A',
        },
        light: {
          primary: '#F5F5F5',
          secondary: '#FFFFFF',
        }
      },
      backgroundImage: {
        'aurora-gradient': 'radial-gradient(circle at center, #1A1A1A 0%, #111111 100%)',
      },
      boxShadow: {
        'glass': '0 1px 4px rgba(0,0,0,0.4)',
        'glass-hover': '0 4px 16px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
};
