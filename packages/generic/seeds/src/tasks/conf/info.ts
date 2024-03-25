// TASK: version
// Run this task with: seeds run-task conf:version

import { Task } from '@marble-seeds/task'

import { version } from '../../../package.json'

// Remove this comment once you add the params options that that the task allow
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TastArgv {}

export const getInfo = new Task(async function (argv: TastArgv) {
  return { version }
}, {
  boundaries: {}
})

getInfo.setSchema({})
