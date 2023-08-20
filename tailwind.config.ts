import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    // Initialize with default values (see options below)
    require("tailwindcss-radix")({
      variantPrefix: "radix",
    }),
  ],
};
export default config;
