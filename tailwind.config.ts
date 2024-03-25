import type { Config } from "tailwindcss";

export default {
    // darkMode: "class",
    content: ["./src/renderer/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [
        require("tailwindcss-3d"),
        require("@savvywombat/tailwindcss-grid-areas"),
    ],
} satisfies Config;
