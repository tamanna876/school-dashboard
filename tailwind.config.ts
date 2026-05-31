import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(148, 163, 184, 0.15), 0 20px 60px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 35%), radial-gradient(circle at top right, rgba(168, 85, 247, 0.18), transparent 28%), linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 1))',
      },
      colors: {
        surface: {
          1: '#0b1220',
          2: '#11192c',
          3: '#182235',
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;