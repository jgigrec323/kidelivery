/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/*.{js,jsx,ts,tsx}",
    "./app/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#FF4019",
        grayDark: "#BDBDBD",
        grayLight: "#F2F2F2",
      },
    },
  },
  plugins: [],
};
