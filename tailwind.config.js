/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.{svelte,html,js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
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
