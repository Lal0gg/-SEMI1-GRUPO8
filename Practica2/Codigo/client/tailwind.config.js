module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        softblu:'#778beb',
        squeaky:'#63cdda',
        purplecorallite:'#574b90',
        applevalley:'#ea8685',
        nasupurple:'#5f27cd',
        aquavelvet:'#01a3a4',
        holyhock: '#833471',
        forgottenpurple: '#9980FA',
        bluebell: '#3B3B98',
        azulitomorado:'#a18fff'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};