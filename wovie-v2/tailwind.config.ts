import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        logo: ['var(--font-patua)', 'cursive'],
      },
      colors: {
        background: '#121212',
        card: '#1a1c20',
        accent: '#e0cdc0',
        'accent-yellow': '#ffcc00',
        text: '#FFFFFF',
        muted: '#A3A3A3',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
