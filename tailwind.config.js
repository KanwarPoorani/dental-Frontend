export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { teal: { 50: '#f0fdfa', 100: '#ccfbf1', 600: '#0d9488', 700: '#0f766e', 900: '#134e4a' }, gold: '#e0a82e', ink: '#0f2a2e', paper: '#f7faf9' },
      fontFamily: { display: ['Fraunces', 'Georgia', 'serif'], sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
    }
  },
};