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
        primary: "#4A90E2",
        "light-grey": "#F5F5F5",
        white: "#FFFFFF",
      },
      backgroundColor: {
        primary: "#4A90E2",
        "light-grey": "#F5F5F5",
      },
      borderColor: {
        primary: "#4A90E2",
      },
      textColor: {
        primary: "#4A90E2",
      },
    },
  },
  plugins: [],
};
export default config;
