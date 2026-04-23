/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#50a5f1', hover: '#3a8fd4' },
        success:  '#06d6a0',
        warning:  '#ffd166',
        danger:   '#ef476f',
        dark: {
          bg:      '#262e35',
          card:    '#2a3038',
          sidebar: '#313a43',
          border:  '#3a4149',
          input:   '#313a43',
          text:    '#a6b0cf',
          muted:   '#6c757d',
        },
        light: {
          bg:      '#f5f7fb',
          card:    '#ffffff',
          sidebar: '#ffffff',
          border:  '#e6ebf5',
          input:   '#f5f7fb',
          text:    '#495057',
          muted:   '#7a7f9a',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};

