import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  safelist: [
    {
      pattern: /(bg|text|border|ring|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|brand)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /(bg|text|border|ring|from|to|via)-(slate|gray|red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|brand)-(50|100|200|300|400|500|600|700|800|900)\/(5|10|15|20|25|30|40|50|60|70|80)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-primary-5)',
          100: 'var(--color-primary-10)',
          200: 'var(--color-primary-20)',
          300: 'var(--color-primary-30)',
          400: 'var(--color-primary-40)',
          500: 'var(--color-primary)',
          600: 'var(--color-primary-60)',
          700: 'var(--color-primary-70)',
          800: 'var(--color-primary-80)',
          900: 'var(--color-primary-90)',
        },
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--surface-3) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "Cantarell", "ui-sans-serif", "system-ui"],
        mono: ["Hack", "ui-monospace", "SFMono-Regular", "JetBrains Mono"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        premium: "0 12px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 12px -4px rgba(15, 23, 42, 0.06)",
        glow: "0 0 32px -4px rgba(124, 58, 237, 0.25)",
      },
      animation: {
        "fade-in": "fadeInUp 0.4s ease-out both",
        "scale-in": "scaleIn 0.3s ease-out both",
        "slide-right": "slideInRight 0.3s ease-out both",
        float: "float 4s ease-in-out infinite",
        glow: "glowPulse 2.5s ease-in-out infinite",
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px -4px rgba(124,58,237,0.3)" },
          "50%": { boxShadow: "0 0 30px -2px rgba(124,58,237,0.5)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;