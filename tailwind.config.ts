import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue": "hsl(238, 40%, 52%)",
        "background": " hsl(228, 33%, 97%)",
        "light-gray": " hsl(223, 19%, 93%)",
        "gray-blue": "hsl(239, 57%, 85%)",
        "dark-blue": "hsl(212, 24%, 26%)",
        "contents": " hsl(211, 10%, 45%)",
        "pale-red": "hsl(357, 100%, 86%)",
        "red": "hsl(358, 79%, 66%)"
      },
      fontFamily: {
        primary: "Rubik",
      },
      screens: {
        "xs": "490px"
      },
      width: {
        "95%": "95%",
        "98%": "98%",
      },
    },
  },
  plugins: [],
};
export default config;
