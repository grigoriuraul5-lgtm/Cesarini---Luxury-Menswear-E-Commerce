/**
 * CESARINI — Design System "Dark & Gold"
 * Surfaces obsidian → graphite · aur periat (champagne → bronze) · ivory/silk
 * Tipografie: EB Garamond (display + italic editorial, aceeași familie ca logoul) · Manrope (UI)
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
    extend: {
      colors: {
        obsidian: { DEFAULT: '#0A0A0A', 950: '#070707' },
        charcoal: '#121212',
        graphite: '#1A1A18',
        smoke: '#24231F',
        gold: {
          50: '#FBF6E6',
          100: '#F4E9C4',
          200: '#EDD891',
          300: '#E6CA65', // highlight
          400: '#D4AF37', // aur periat
          500: '#C5A059', // champagne — accent principal
          600: '#A8843F', // warm bronze
          700: '#86672F',
          800: '#5C4720',
          900: '#3A2D14',
        },
        ivory: '#F5F5F0',
        silk: '#E5E5E0',
        stone: { 400: '#A8A59C', 500: '#8C887E', 600: '#6E6B64' }, // 400/500 ≥ 4.5:1 pe obsidian
        line: 'rgba(197,160,89,0.22)',
      },
      fontFamily: {
        // Numele de familie care conțin cifre TREBUIE puse între ghilimele, altfel CSS invalidează toată declarația
        // EB Garamond: literele logoului (garalde, contrast moderat, serife înclinate). Fallback-uri din aceeași familie.
        display: ['var(--font-garamond)', '"EB Garamond"', 'Garamond', '"Times New Roman"', 'serif'],
        serif: ['var(--font-garamond)', '"EB Garamond"', 'Garamond', '"Times New Roman"', 'serif'],
        sans: ['var(--font-manrope)', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.32em' }],
        // Garamond are ochiul literei mai mic decât Bodoni: tracking negativ mai blând, ca literele să respire ca în logo
        'display-sm': ['clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(3rem, 1.6rem + 5.6vw, 6.5rem)', { lineHeight: '1', letterSpacing: '-0.015em' }],
        'display-lg': ['clamp(3.2rem, 1rem + 6.6vw, 8.25rem)', { lineHeight: '0.95', letterSpacing: '-0.018em' }],
      },
      letterSpacing: { luxe: '0.32em', wide2: '0.18em' },
      maxWidth: { site: '1440px', prose: '64ch' },
      spacing: { section: 'clamp(6rem, 12vw, 11rem)', gutter: 'clamp(1.25rem, 4vw, 3.5rem)' },
      backgroundImage: {
        'gold-brushed': 'linear-gradient(115deg, #86672F 0%, #C5A059 28%, #E6CA65 48%, #C5A059 64%, #A8843F 100%)',
        'gold-hairline': 'linear-gradient(90deg, transparent, rgba(197,160,89,.55) 20%, rgba(230,202,101,.8) 50%, rgba(197,160,89,.55) 80%, transparent)',
        'obsidian-fade': 'linear-gradient(180deg, rgba(10,10,10,0) 0%, #0A0A0A 100%)',
        'gold-radial': 'radial-gradient(60% 60% at 50% 40%, rgba(212,175,55,.14) 0%, rgba(10,10,10,0) 70%)',
      },
      boxShadow: {
        'gold-sm': '0 0 0 1px rgba(197,160,89,.35), 0 0 18px -4px rgba(212,175,55,.25)',
        'gold-md': '0 0 0 1px rgba(197,160,89,.5), 0 10px 40px -10px rgba(212,175,55,.35)',
        'gold-inset': 'inset 0 1px 0 0 rgba(230,202,101,.18)',
        noir: '0 30px 80px -20px rgba(0,0,0,.9)',
        // glow-ul de hover pentru carduri și CTA-uri
        'gold-soft': '0 0 20px rgba(212,175,55,0.15)',
        'gold-card': '0 0 0 1px rgba(212,175,55,.35), 0 24px 60px -24px rgba(212,175,55,.28)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        silk: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: { 400: '400ms', 700: '700ms', 1200: '1200ms' },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -3%, 0) scale(1.08)' },
        },
        'fade-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        drift: 'drift 18s ease-in-out infinite',
        'fade-up': 'fade-up .9s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
