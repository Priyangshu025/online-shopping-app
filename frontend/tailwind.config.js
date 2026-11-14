/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#ffffff",
          alt: "#f5f5f7",
        },
        ink: {
          DEFAULT: "#1d1d1f",
          muted: "#6e6e73",
        },
        line: "#d2d2d7",
        accent: {
          DEFAULT: "#0a6cff",
          hover: "#0058d6",
          soft: "#eaf2ff",
        },
        success: "#1a7f37",
        danger: "#d92d20",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        lift: "0 8px 28px rgba(0,0,0,0.10)",
      },
      maxWidth: {
        page: "1200px",
      },
    },
  },
  plugins: [],
};
