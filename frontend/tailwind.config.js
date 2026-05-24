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
        slate: "#DCE4F6",
        aurum: "#D7B56D",
      },
      boxShadow: {
        halo: "0 20px 80px rgba(71, 93, 178, 0.22)",
        luxe: "0 30px 120px rgba(27, 45, 73, 0.16)",
        insetGlow: "inset 0 1px 0 rgba(255,255,255,0.7)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        mesh: "radial-gradient(ellipse at 15% 15%, rgba(71,93,178,0.14) 0%, transparent 40%), radial-gradient(ellipse at 85% 10%, rgba(63,177,112,0.12) 0%, transparent 30%), linear-gradient(175deg, #f5f3ea 0%, #eef3ff 60%, #ffffff 100%)",
        aurora: "radial-gradient(circle at top left, rgba(215,181,109,0.26), transparent 30%), radial-gradient(circle at 85% 15%, rgba(71,93,178,0.18), transparent 28%), linear-gradient(145deg, #fbfaf6 0%, #eef3ff 52%, #f4f8ff 100%)",
        velvet: "linear-gradient(135deg, #18233f 0%, #24345d 46%, #475DB2 100%)",
      },
    },
  },
  plugins: [],
};
