import path from 'path'
import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'

import { bundle as bundleRuner } from '../bundle/create'
import { loadBundle } from '../bundle/load'
import { load } from '../conf/load'
import { type SeedsConf } from '../types'

export interface TastArgv {
  runnerName: string
  taskName: string
  params: any
}

export const run = new Task(async function ({ runnerName, taskName, params }: TastArgv, { loadConf, loadConfV2 }) {
  const seeds: SeedsConf = await loadConf({})
  const runnerDescriptor = seeds.runners[runnerName]

  const entryPoint = path.join(process.cwd(), runnerDescriptor.path)
  const outputFile = path.resolve(__dirname, '../.builds', `${runnerName}.js`)

  await bundleRuner.run({
    entryPoint,
    outputFile
  })

  const bundle = await loadBundle.run({ bundlePath: outputFile })
  const task = bundle.runner.getTask(taskName)

  if (task === undefined) {
    throw new Error(`No task found for ${taskName} on runner ${runnerName}`)
  }

  let res, error: Error | undefined
  try {
    res = await task.run(params)
  } catch (e) {
    console.log('Error ->', e.message)
    error = e
  }

  if (error !== undefined) {
    throw new Error(error.message)
  }

  return res
}, {
  boundaries: {
    loadConf: load.asBoundary()
  }
})

// Add argument: Schema.types.string
run.setSchema({
  runnerName: Schema.types.string,
  taskName: Schema.types.string,
  params: Schema.types.any
})
