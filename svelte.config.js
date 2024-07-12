import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		csrf: false,
		adapter: adapter({
			build: {
				outDir: './dist',
			}
		})
	},
};

export default config;
