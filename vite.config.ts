import { sveltekit } from "@sveltejs/kit/vite";
import commonjs from "@rollup/plugin-commonjs";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), commonjs()],
});
