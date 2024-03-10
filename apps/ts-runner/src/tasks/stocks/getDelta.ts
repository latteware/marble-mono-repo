import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'

interface TastArgv {
  ticker: string
}

export const getDelta = new Task(async function ({ ticker }: TastArgv) {
  const status = { status: `Woot ${ticker}!` }

  return status
}, {
  boundaries: {}
})

getDelta.setSchema({
  ticker: Schema.types.string.required()
})
