/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4F46E5",
          secondary: "#06B6D4",
          surface: "#0B1220",
          card: "#111827"
        }
      },
      boxShadow: {
        glow: "0 0 30px rgba(79, 70, 229, 0.35)",
        glass: "0 8px 30px rgba(2, 6, 23, 0.35)"
      },
      backdropBlur: {
        xs: "2px"
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
        pulsebar: "pulsebar 1.2s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        pulsebar: {
          "0%,100%": { opacity: ".4" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
