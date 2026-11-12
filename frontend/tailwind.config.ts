import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0f2c56",
          secondary: "#ce2731",
          third: "#fefefd",
        },
        primary: {
          DEFAULT: "#0f2c56",
          50: "#f0f4f9",
          100: "#dbe5f2",
          200: "#bad0e6",
          300: "#8eb3d6",
          400: "#5c91c2",
          500: "#3873ae",
          600: "#275992",
          700: "#1d4576",
          800: "#163861",
          900: "#0f2c56",
          950: "#081b37",
        },
        secondary: {
          DEFAULT: "#ce2731",
          50: "#fdf2f2",
          100: "#fde6e6",
          200: "#fcd0d1",
          300: "#faa9ab",
          400: "#f57579",
          500: "#eb484d",
          600: "#ce2731",
          700: "#b01e27",
          800: "#911d24",
          900: "#791d23",
          950: "#440a0e",
        },
        surface: {
          0: "#fefefd",
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
        },
        match: {
          high: "#10B981",    // 80 - 100%
          medium: "#F59E0B",  // 60 - 79%
          low: "#ce2731",     // < 60% (using secondary brand crimson)
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
        jakarta: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
