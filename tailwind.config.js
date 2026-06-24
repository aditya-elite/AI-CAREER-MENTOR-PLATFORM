/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./dag/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["var(--ff-head)"],
        body: ["var(--ff-body)"],
      },
      colors: {
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        // Dashboard marketing “neon” palette.
        "neon-blue": "hsl(var(--neon-blue))",
        "neon-cyan": "hsl(var(--neon-cyan))",
        "neon-violet": "hsl(var(--neon-violet))",
        "neon-purple": "hsl(var(--neon-purple))",
        "neon-green": "hsl(var(--neon-green))",
        "neon-amber": "hsl(var(--neon-amber))",

        // Sidebar theme used by shadcn/ui sidebar component.
        sidebar: "hsl(var(--background))",
        "sidebar-foreground": "hsl(var(--foreground))",
        "sidebar-accent": "hsl(var(--accent))",
        "sidebar-accent-foreground": "hsl(var(--accent-foreground))",
        "sidebar-border": "hsl(var(--border))",
        "sidebar-ring": "hsl(var(--ring))",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}

