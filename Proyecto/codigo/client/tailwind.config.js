/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors:{
        naranjita:'#D96F3A ',
        moradito:'#963AB9',
        moradito2: '#9755B0',
        moradito3: '#8B4FF4',
      }
    },
  },
  plugins: [],
}

