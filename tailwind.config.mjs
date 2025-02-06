/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "separate":"#f8f8fb",
        background: "var(--background)",
        foreground: "var(--foreground)",
        bdr:"#f2f2f2",
        border:"#4b5966",
        formborder:"#d4d3d3",
        button_color:"#5caf90",
        primary: {
					"100": "#E8FFF0",
					DEFAULT: "#24BF55",
				},
      },
      screens: {
        "wide": "1440px"
      }
    },
  },
  plugins: [],
};
