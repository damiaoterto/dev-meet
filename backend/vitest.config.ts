import { resolve } from 'node:path'
import { defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		alias: {
			'@application': resolve(__dirname, 'src', 'application'),
			'@bootstrap': resolve(__dirname, 'src', 'bootstrap'),
			'@core': resolve(__dirname, 'src', 'core'),
			'@infrastructure': resolve(__dirname, 'src', 'infrastructure'),
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html', 'json'],
			exclude: [
				...defaultExclude,
				'**/enums/*.enum.ts',
				'**/app-module.ts',
				'**/bootstrap/di.ts',
				'**/main.ts',
				'**/esbuild.mjs',
				'**/dev-meet.ts',
				'**/interfaces/*',
				'**/ports/*',
				'**/types/*',
			],
		},
		setupFiles: ['./test/setups/reflect-metadata.ts'],
	},
})
