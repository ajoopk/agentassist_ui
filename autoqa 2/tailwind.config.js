/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design System AQA (shadcn / zinc) — the workspace
        ink: '#09090B',
        muted: '#71717A',
        line: '#E4E4E7',
        subtle: '#F4F4F5',
        primary: { DEFAULT: '#18181B', fg: '#FAFAFA' },
        destructive: '#EF4343',
        // App shell — the navy rail from the DS `menu` pattern
        rail: { DEFAULT: '#15203B', active: '#25365F', label: '#B5D2F3', avatar: '#203363' },
      },
      // Page titles and the large metric numerals both use text-3xl.
      fontSize: { '3xl': ['1.475rem', { lineHeight: '1.9rem' }] },
      borderRadius: { DEFAULT: '6px', card: '8px' },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        dialog: '0 4px 6px 0 rgb(0 0 0 / 0.10), 0 2px 4px 0 rgb(0 0 0 / 0.10)',
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
