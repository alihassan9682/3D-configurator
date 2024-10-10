module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        "10xl": "10rem", // Add custom font size '10xl'
        "11xl": "12rem", // Add custom font size '11xl'
        "12xl": "14rem", // Add custom font size '12xl'
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden",
          },
          "100%": {
            width: "100%",
          },
        },
        blink: {
          "50%": {
            borderColor: "transparent",
          },
          "100%": {
            borderColor: "white",
          },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        typing:
          "typing 4s steps(40) infinite alternate, blink 45s infinite, break 20s linear",
      },
    },
  },

  plugins: [],
};