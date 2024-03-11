import path from 'path'
import fs from 'fs/promises'
import { Task } from '@marble-seeds/task'
import { RecordTape } from '@marble-seeds/record-tape'
import Schema from '@marble-seeds/schema'

import { bundleTask } from './bundleTask'
import { loadBundle } from './loadBundle'

interface TastArgv {
  descriptorName: string
  args: any
}

interface TaskDescriptor {
  path: string
  handler: string
}

export const runTask = new Task(async function ({ descriptorName, args }: TastArgv, {
  loadConf
}) {
  const seeds = await loadConf()
  const taskDescriptor = seeds.tasks[descriptorName] as TaskDescriptor

  const logsPath = path.join(process.cwd(), 'logs', descriptorName)
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

  const res = await task.run(args)

  await tape.save()

  return res
}, {
  boundaries: {
    loadConf: async () => {
      const seedsPath = path.join(process.cwd(), 'seeds.json')
      const raw = await fs.readFile(seedsPath, 'utf-8')
      const conf = JSON.parse(raw)

      return conf
    }
  }
})

runTask.setSchema({
  descriptorName: Schema.types.string,
  args: Schema.types.any
})
