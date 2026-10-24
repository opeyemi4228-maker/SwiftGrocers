/** @type {import('tailwindcss').Config} */

/** Wraps a raw HSL-channel custom property so Tailwind opacity modifiers work. */
const token = (name) => `hsl(var(--${name}) / <alpha-value>)`;

const scale = (prefix, steps) =>
  Object.fromEntries(steps.map((s) => [s, token(`${prefix}-${s}`)]));

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: scale("brand", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        accent: scale("accent", [50, 100, 200, 300, 400, 500, 600, 700]),
        neutral: scale("neutral", [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),

        canvas: token("canvas"),
        surface: {
          DEFAULT: token("surface"),
          raised: token("surface-raised"),
          sunken: token("surface-sunken"),
          inverse: token("surface-inverse"),
        },
        content: {
          DEFAULT: token("content"),
          strong: token("content-strong"),
          muted: token("content-muted"),
          inverse: token("content-inverse"),
        },
        line: {
          DEFAULT: token("line"),
          strong: token("line-strong"),
        },
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          content: token("primary-content"),
        },
        ring: token("ring"),
        overlay: token("overlay"),

        success: { DEFAULT: token("success"), soft: token("success-soft") },
        warning: { DEFAULT: token("warning"), soft: token("warning-soft") },
        danger: { DEFAULT: token("danger"), soft: token("danger-soft") },
        info: { DEFAULT: token("info"), soft: token("info-soft") },
      },

      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1.05rem", letterSpacing: "0.01em" }],
        xs: ["0.8125rem", { lineHeight: "1.2rem" }],
        sm: ["0.875rem", { lineHeight: "1.375rem" }],
        base: ["1rem", { lineHeight: "1.65rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.3125rem", { lineHeight: "1.85rem", letterSpacing: "-0.005em" }],
        "2xl": ["1.625rem", { lineHeight: "2.1rem", letterSpacing: "-0.01em" }],
        "3xl": ["2rem", { lineHeight: "2.4rem", letterSpacing: "-0.015em" }],
        "4xl": ["2.5rem", { lineHeight: "2.85rem", letterSpacing: "-0.02em" }],
        "5xl": ["3.125rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "7xl": ["4.5rem", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
      },

      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.875rem",
        xl: "1.125rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        ring: "var(--shadow-ring)",
        "brand-glow": "0 10px 30px -8px hsl(var(--brand-600) / 0.45)",
        "accent-glow": "0 10px 30px -8px hsl(var(--accent-500) / 0.45)",
      },

      transitionTimingFunction: {
        "out-quart": "var(--ease-out-quart)",
        "out-expo": "var(--ease-out-expo)",
        spring: "var(--ease-spring)",
      },

      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },

      spacing: {
        header: "var(--header-height)",
        tabbar: "var(--tabbar-height)",
      },

      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(min(100%, 15rem), 1fr))",
        "auto-sm": "repeat(auto-fill, minmax(min(100%, 10.5rem), 1fr))",
        "auto-lg": "repeat(auto-fill, minmax(min(100%, 20rem), 1fr))",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(0.75rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--brand-500) / 0.5)" },
          "70%": { boxShadow: "0 0 0 0.6rem hsl(var(--brand-500) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--brand-500) / 0)" },
        },
      },

      animation: {
        "fade-in": "fade-in var(--duration-base) var(--ease-out-quart) both",
        "fade-up": "fade-up var(--duration-slow) var(--ease-out-expo) both",
        "scale-in": "scale-in var(--duration-base) var(--ease-out-expo) both",
        "slide-in-right": "slide-in-right var(--duration-slow) var(--ease-out-expo) both",
        "slide-in-left": "slide-in-left var(--duration-slow) var(--ease-out-expo) both",
        marquee: "marquee 32s linear infinite",
        "pulse-ring": "pulse-ring 2s var(--ease-out-quart) infinite",
      },

      backgroundImage: {
        "brand-mesh":
          "radial-gradient(60% 80% at 12% 8%, hsl(var(--brand-500) / 0.18), transparent 60%), radial-gradient(50% 70% at 92% 22%, hsl(var(--accent-400) / 0.16), transparent 62%)",
      },

      aspectRatio: {
        product: "4 / 5",
        card: "3 / 2",
      },

      zIndex: {
        header: "50",
        overlay: "70",
        drawer: "80",
        toast: "90",
      },
    },
  },
  plugins: [],
};
