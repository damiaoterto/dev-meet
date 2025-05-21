import { exit } from 'node:process'
import esbuild from 'esbuild'

async function build() {
  await esbuild.build({
    entryPoints: ['./src/main.ts'],
    outdir: './dist',
    bundle: true,
    minify: true,
    sourcemap: 'inline',
    platform: 'node',
    target: 'node16',
    format: 'cjs',
  })
}
build().catch((error) => {
  console.error('Error on build: ', error)
  exit(1)
})
