module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#1dc962",
        "background-light": "#f6f8f7",
        "background-dark": "#112117",
      },
      fontFamily: {
        display: ["Work Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
};
