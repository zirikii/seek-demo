import type { Config } from "tailwindcss";

/**
 * SEEK-inspired (Braid-flavoured) design tokens.
 * Brand colours are intentionally exact: SEEK Pink #E60278 and SEEK Navy #2E3849.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,md,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Brand
        seek: {
          pink: "#E60278",
          "pink-dark": "#C2005F",
          "pink-light": "#FCE5F1",
          navy: "#2E3849",
          "navy-dark": "#1F2733",
          "navy-light": "#3D495C",
        },
        // Neutral text + surfaces (Braid-inspired)
        ink: {
          DEFAULT: "#2E3849",
          secondary: "#505A6E",
          muted: "#6E7891",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8F8F9",
          muted: "#F4F4F6",
        },
        line: {
          DEFAULT: "#E4E5E7",
          strong: "#CBCCD3",
        },
        // Braid-style tones
        tone: {
          positive: "#108043",
          "positive-bg": "#E6F4EC",
          critical: "#D1373B",
          "critical-bg": "#FCE8E8",
          caution: "#B7791F",
          "caution-bg": "#FBF3E2",
          info: "#1C5FCB",
          "info-bg": "#E7F0FD",
        },
        // shadcn semantic mapping (driven by CSS variables in globals.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(46, 56, 73, 0.08), 0 1px 3px rgba(46, 56, 73, 0.06)",
        "card-hover": "0 4px 12px rgba(46, 56, 73, 0.12)",
        panel: "0 2px 8px rgba(46, 56, 73, 0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
