import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F2EEE6",
        paper2: "#EAE4D8",
        ink: "#1C1F22",
        inkfaint: "#5B5B54",
        blueprint: "#1F3A5F",
        blueprint2: "#16293F",
        rebar: "#C1571C",
        rebarlight: "#E0895A",
        line: "#C9C2B2",
        // Ported from the community Concrete Tracker's light theme (fixed
        // hex, not the Tracker's CSS-variable dark/light toggle) so its
        // components render correctly under /tracker without needing its
        // own theme system. `ink` above already matches the Tracker's own
        // light-theme ink closely enough to reuse as-is.
        base: "#F5F3EF",
        surface: "#EDEAE4",
        surfaceRaised: "#E4E0D8",
        slab: "#D6D0C5",
        concrete: "#6F6B64",
        concreteMuted: "#A8A29A",
        inkMuted: "#5A564F",
        steel: "#3A5A73",
        steelBright: "#2A475E",
        brass: "#8A6D14",
        rust: "#8C3F2C",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        blueprintgrid:
          "linear-gradient(rgba(31,58,95,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,58,95,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
      maxWidth: {
        prose: "72ch",
      },
      borderRadius: {
        slab: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
