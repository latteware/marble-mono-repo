import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import esbuild from 'esbuild'

interface TastArgv {
  entryPoint: string
  outputFile: string
}

export const bundle = new Task(async function ({ entryPoint, outputFile }: TastArgv) {
  await esbuild.build({
    entryPoints: [entryPoint],
    outfile: outputFile,
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true
  })

  const status = { status: 'Ok' }

  return status
}, {
  boundaries: {}
})

bundle.setSchema({
  entryPoint: Schema.types.string,
  outputFile: Schema.types.string
})
