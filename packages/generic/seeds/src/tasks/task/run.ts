import path from 'path'
import { Task } from '@marble-seeds/task'
import { RecordTape } from '@marble-seeds/record-tape'
import Schema from '@marble-seeds/schema'

import { bundle as bundleTask } from '../bundle/create'
import { loadBundle } from '../bundle/load'
import { load as loadConf } from '../conf/load'
import { type SeedsConf } from '../types'

interface TastArgv {
  descriptorName: string
  args: any
}

export const run = new Task(async function ({ descriptorName, args }: TastArgv, {
  loadConf
}) {
  const seeds: SeedsConf = await loadConf()
  const taskDescriptor = seeds.tasks[descriptorName]

  if (taskDescriptor === undefined) {
    throw new Error('Task is not defined on seeds.json')
  }

  const logsPath = path.join(process.cwd(), seeds.paths.logs, descriptorName)
  const entryPoint = path.join(process.cwd(), taskDescriptor.path)
  const outputFile = path.resolve(__dirname, '../.builds', `${descriptorName}.js`)

  await bundleTask.run({
    entryPoint,
    outputFile
  })

  const bundle = await loadBundle.run({ bundlePath: outputFile })
  const task = bundle[taskDescriptor.handler]

  const tape = new RecordTape({
    path: logsPath
  })
  tape.recordFrom(descriptorName, task)

  let res
  try {
    res = await task.run(args)
  } catch (error) {
    await tape.save()
    throw error
  }

  await tape.save()

  return res
}, {
  boundaries: {
    loadConf: loadConf.asBoundary()
  }
})

run.setSchema({
  descriptorName: Schema.types.string,
  args: Schema.types.any
})
