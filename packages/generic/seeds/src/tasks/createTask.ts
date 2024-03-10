import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import Handlebars from 'handlebars'
import path from 'path'
import fs from 'fs/promises'
import camelCase from 'camelcase'

const p = path
const templatePath = p.resolve(__dirname, '../templates/task.hbs')

interface TastArgv {
  taskDescriptor: string
  taskPath: string
}

interface TaskName {
  descriptor: string
  taskName: string
  fileName: string
  dir?: string
}

export const createTask = new Task(async function ({ taskDescriptor, taskPath }: TastArgv, {
  loadTemplate,
  persistTask,
  loadConf,
  persistConf,
  parseTaskName
}) {
  const { taskName, fileName, descriptor, dir } = await parseTaskName(taskDescriptor) as TaskName

  if (dir !== undefined) {
    taskPath = path.join(taskPath, dir)
  }

  console.log(`
  ==================================================
  Starting task creation!
  Creating: ${taskName}
  Dir:  ${dir ?? ''}
  Into: ${taskPath}
  ==================================================
  `)

  const seeds = await loadConf()

  const template = await loadTemplate()
  const comp = Handlebars.compile(template)
  const content = comp({
    taskName
  })

  await persistTask(taskPath, fileName, content)

  if (seeds.tasks === undefined) {
    seeds.tasks = {}
  }

  seeds.tasks[descriptor] = {
    path: `${taskPath}/${fileName}`,
    handler: taskName
  }

  await persistConf(seeds)

  return { taskPath, fileName }
}, {
  boundaries: {
    loadTemplate: async () => {
      const template = await fs.readFile(templatePath, 'utf-8')

      return template
    },
    persistTask: async (dir: string, fileName: string, content: string) => {
      const dirPath = p.resolve(process.cwd(), dir)
      const taskPath = p.resolve(dirPath, fileName)

      let err
      try {
        await fs.stat(taskPath)
      } catch (e) {
        err = e
      }

      if (err === undefined) {
        throw new Error(`File '${taskPath}' already exists.`)
      }

      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(taskPath, content, 'utf-8')

      return {
        path: taskPath.toString()
      }
    },
    loadConf: async () => {
      const seedsPath = path.join(process.cwd(), 'seeds.json')
      const raw = await fs.readFile(seedsPath, 'utf-8')
      const conf = JSON.parse(raw)

      return conf
    },
    persistConf: async (seeds) => {
      const seedsPath = path.join(process.cwd(), 'seeds.json')
      await fs.writeFile(seedsPath, JSON.stringify(seeds, null, 2))
    },
    parseTaskName: async (taskDescriptor: string): Promise<TaskName> => {
      const res: string[] = taskDescriptor.split(':')

      if (res.length === 1) {
        return {
          descriptor: `${camelCase(res[0])}`,
          taskName: `${camelCase(res[0])}`,
          fileName: `${camelCase(res[0])}.ts`
        }
      }

      return {
        dir: res[0],
        descriptor: `${res[0]}:${camelCase(res[1])}`,
        taskName: `${camelCase(res[1])}`,
        fileName: `${camelCase(res[1])}.ts`
      }
    }
  }
})

createTask.setSchema({
  taskDescriptor: Schema.types.string,
  taskPath: Schema.types.string
})
