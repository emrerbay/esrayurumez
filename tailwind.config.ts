import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1C8D8A",
        secondary: "#5EC5C0",
        "light-blue": "#A7D9F5",
        accent: "#FFB74D",
        "bg-accent": "#F0F4F8",
        "text-main": "#2C3E50",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-figtree)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
