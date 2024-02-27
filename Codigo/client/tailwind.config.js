module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        softblu:'#778beb'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};