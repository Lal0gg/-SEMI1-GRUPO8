module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
<<<<<<< Updated upstream
        softblu:'#778beb',
        squeaky:'#63cdda',
        purplecorallite:'#574b90',
        applevalley:'#ea8685',
        nasupurple:'#5f27cd',
        aquavelvet:'#01a3a4',
        holyhock: '#833471',
        forgottenpurple: '#9980FA',
        bluebell: '#3B3B98'
=======
        softblu:'#778beb', 
        colorcito: '#4BCD36'
>>>>>>> Stashed changes
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};