import * as path from 'node:path';
import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		minify: 'terser',
	},
	resolve: {
		alias: {
			'~': path.join(__dirname, './src'),
		},
	},
});
