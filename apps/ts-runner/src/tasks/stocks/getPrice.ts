import { Task } from '@marble-seeds/task'

// Remove this comment once you add the params options that that the task allow
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TastArgv {}

export const getPrice = new Task(async function (argv: TastArgv) {
  const status = { status: 'Ok' }

  return status
}, {
  boundaries: {}
})

getPrice.setSchema({})
