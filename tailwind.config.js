/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          base: '#080808',
        },
        surface: {
          card: '#111111',
          elevated: '#181818',
        },
        border: {
          default: '#222222',
          hover: '#FAFF00',
        },
        accent: {
          primary: '#FAFF00',
          glow: 'rgba(250, 255, 0, 0.12)',
        },
        text: {
          primary: '#F2F2F2',
          secondary: '#888888',
          muted: '#444444',
        },
        status: {
          green: '#39FF6A',
          red: '#FF4444',
          yellow: '#FAFF00',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
    },
  },
  plugins: [],
}
