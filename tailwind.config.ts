import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kivo: {
          blue: "#1F3A8A",
          purple: "#7C3AED",
          orange: "#F97316",
          ink: "#111827"
        }
      },
      borderRadius: {
        xl2: "1rem"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17,24,39,0.08)"
      },
      backgroundImage: {
        "kivo-gradient": "linear-gradient(135deg, #1F3A8A 0%, #7C3AED 55%, #F97316 100%)"
      }
    }
  },
  plugins: []
} satisfies Config;