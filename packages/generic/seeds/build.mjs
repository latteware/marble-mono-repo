import { build } from 'esbuild'

build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/bundle.js',
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'node',
  target: 'node18',
  external: ['esbuild']
}).catch(() => process.exit(1))
