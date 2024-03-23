import { Task } from '@marble-seeds/task'
import path from 'path'
import fs from 'fs/promises'

// Remove this comment once you add the params options that that the task allow
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TastArgv {}

export const listTasks = new Task(async function (argv: TastArgv) {
  const seedsPath = path.join(process.cwd(), 'seeds.json')
  const raw = await fs.readFile(seedsPath, 'utf-8')
  const conf = JSON.parse(raw)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const tasks: string[] = Object.keys(conf.tasks) ?? []

  console.log('Available tasks:')
  tasks.forEach(taskName => {
    console.log(`- ${taskName}`)
  })

  return tasks
}, {
  boundaries: {}
})

listTasks.setSchema({})
