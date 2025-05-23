import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		alias: {
			'@core': resolve(__dirname, 'src', 'core'),
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html', 'json'],
		},
		setupFiles: ['./test/setups/reflect-metadata.ts'],
	},
})
