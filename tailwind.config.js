/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.{svelte,html,js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          400: '#fb923c',
          500: '#f97316', // Main Orange
          600: '#ea580c',
          900: '#431407',
        },
        // Alias primary to brand for backward compatibility but with new look
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        slate: {
          850: '#1e293b', // Custom surface
          950: '#020617', // Deep background
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#10b981',
              '&:hover': {
                color: '#059669',
              },
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            'h5, h6': {
              color: 'inherit',
            },
            'ul, ol': {
              'padding-left': '1.25em',
            },
            'ul > li': {
              position: 'relative',
              'padding-left': '1.5em'
            },
            'ol > li': {
              'padding-left': '0.5em',
            },
            // Blockquote styling
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#e5e7eb',
              paddingLeft: '1em',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              p: {
                marginTop: '0.8em',
                marginBottom: '0.8em',
              }
            },
            // Code block styling
            'pre, code': {
              backgroundColor: '#f3f4f6',
              borderRadius: '0.375rem',
              padding: '0.2em 0.4em',
              fontSize: '0.875em',
            },
            pre: {
              padding: '1em',
              overflowX: 'auto',
              code: {
                backgroundColor: 'transparent',
                borderWidth: '0',
                borderRadius: '0',
                padding: '0',
                fontWeight: '400',
                fontSize: 'inherit',
                color: 'inherit',
                fontFamily: 'inherit',
              },
            },
            // Table styling
            table: {
              width: '100%',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              borderCollapse: 'collapse',
              'thead, tbody tr': {
                borderBottomWidth: '1px',
                borderBottomColor: '#e5e7eb',
              },
              'thead th': {
                fontWeight: '600',
                textAlign: 'left',
                paddingBottom: '0.5em',
                paddingTop: '0.5em',
                paddingLeft: '0.75em',
                paddingRight: '0.75em',
              },
              'tbody td': {
                paddingTop: '0.5em',
                paddingBottom: '0.5em',
                paddingLeft: '0.75em',
                paddingRight: '0.75em',
              },
            },
            // Horizontal rule
            hr: {
              borderColor: '#e5e7eb',
              marginTop: '3em',
              marginBottom: '3em',
            },
            // Strong and emphasis
            strong: {
              fontWeight: '600',
              color: 'inherit',
            },
            em: {
              fontStyle: 'italic',
              color: 'inherit',
            },
            // Imagea
            img: {
              marginTop: '2em',
              marginBottom: '2em',
              borderRadius: '0.375rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
