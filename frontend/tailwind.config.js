/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#475DB2",
        success: "#3FB170",
        ink: "#1B2D49",
        mist: "#EEF3FF",
        sand: "#F5F3EA",
      },
      boxShadow: {
        halo: "0 20px 80px rgba(71, 93, 178, 0.22)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        mesh: "radial-gradient(ellipse at 15% 15%, rgba(71,93,178,0.14) 0%, transparent 40%), radial-gradient(ellipse at 85% 10%, rgba(63,177,112,0.12) 0%, transparent 30%), linear-gradient(175deg, #f5f3ea 0%, #eef3ff 60%, #ffffff 100%)",
      },
    },
  },
  plugins: [],
};
