import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'

interface TastArgv {
  bundlePath: string
}

export const loadBundle = new Task(async function ({ bundlePath }: TastArgv) {
  const bundle = await import(bundlePath)

  return bundle.default
}, {
  boundaries: {}
})

loadBundle.setSchema({
  bundlePath: Schema.types.string
})
