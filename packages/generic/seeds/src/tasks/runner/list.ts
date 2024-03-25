// TASK: list
// Run this task with: seeds task:run runner:list
import path from 'path'
import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'

import { load } from '../conf/load'
import { type SeedsConf } from '../types'
import { bundle as bundleRuner } from '../bundle/create'
import { loadBundle } from '../bundle/load'

export interface TastArgv {
  descriptorName: string
}

export const list = new Task(async function ({ descriptorName }: TastArgv, { loadConf }) {
  const seeds: SeedsConf = await loadConf({})
  const runnerDescriptor = seeds.runners[descriptorName]

  const entryPoint = path.join(process.cwd(), runnerDescriptor.path)
  const outputFile = path.resolve(__dirname, '../.builds', `${descriptorName}.js`)

  await bundleRuner.run({
    entryPoint,
    outputFile
  })

  const bundle = await loadBundle.run({ bundlePath: outputFile })

  const tasks = bundle.runner.getTasks()

  // ToDo have correct types
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const taskList = Object.keys(tasks)

  console.log('Task list:')
  taskList.forEach(taskName => {
    console.log('-', taskName)
  })

  return { totalTasks: taskList.length }
}, {
  boundaries: {
    loadConf: load.asBoundary()
  }
})

// Add argument: Schema.types.string
list.setSchema({
  descriptorName: Schema.types.string
})
