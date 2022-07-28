/** @format */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/bg.png')",
        // "footer-texture": "url('/img/footer-texture.png')",
      },
    },
  },

  plugins: [],
};
