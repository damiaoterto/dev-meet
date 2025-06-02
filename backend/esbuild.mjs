import { exit } from 'node:process'
import esbuild from 'esbuild'
// import tsPaths from 'esbuild-ts-paths'

async function build() {
	await esbuild.build({
		entryPoints: ['./src/main.ts'],
		outdir: './dist',
		bundle: true,
		minify: true,
		sourcemap: 'linked',
		platform: 'node',
		target: 'node16',
		format: 'cjs',
		packages: 'external',
		// plugins: [tsPaths()],
	})
}
build().catch((error) => {
	console.error('Error on build: ', error)
	exit(1)
})
