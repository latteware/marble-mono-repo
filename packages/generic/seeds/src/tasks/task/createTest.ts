import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import Handlebars from 'handlebars'
import path from 'path'
import fs from 'fs/promises'
import camelCase from 'camelcase'

const p = path
const templatePath = p.resolve(__dirname, '../templates/test.hbs')

interface TastArgv {
  descriptorName: string
}

interface TaskDescriptor {
  taskName: string
  taskPath: string
  handler: string
  fileName: string
  dir?: string
}

interface ProjectPaths {
  logs: string
  tasks: string
  runners: string
  fixtures: string
  tests: string
}

export const createTest = new Task(async function ({ descriptorName }: TastArgv, {
  loadConf,
  loadTemplate,
  getTaskDescriptor,
  persistFile
}) {
  const seeds = await loadConf()

  const projectPaths: ProjectPaths = seeds.paths
  const taskDescriptor: TaskDescriptor = await getTaskDescriptor(descriptorName, seeds)

  const taskPath = path.resolve(process.cwd(), taskDescriptor.taskPath)
  const testFolder = path.resolve(process.cwd(), projectPaths.tests, taskDescriptor.dir ?? '')
  const testFile = path.resolve(testFolder, taskDescriptor.fileName)

  const relativePath = path.relative(testFolder, taskDescriptor.taskPath)

  const template = await loadTemplate()
  const content = template({
    descriptorName,
    path: relativePath,
    handler: taskDescriptor.handler
  })

  await persistFile(testFolder, testFile, content)

  return { descriptorName, content, testFile, testFolder, relativePath, taskPath }
}, {
  boundaries: {
    loadConf: async () => {
      const seedsPath = path.join(process.cwd(), 'seeds.json')
      const raw = await fs.readFile(seedsPath, 'utf-8')
      const conf = JSON.parse(raw)

      return conf
    },
    loadTemplate: async () => {
      const template = await fs.readFile(templatePath, 'utf-8')
      const comp = Handlebars.compile(template)

      return comp
    },
    getTaskDescriptor: async (taskName: string, conf: any): Promise<TaskDescriptor> => {
      const taskSeed = conf.tasks[taskName]
      const res: string[] = taskName.split(':')

      let fileName = `${camelCase(res[0])}.ts`
      let dir = ''
      if (res.length === 2) {
        dir = res[0]
        fileName = `${camelCase(res[1])}.ts`
      }

      const taskDescriptor: TaskDescriptor = {
        taskName,
        fileName,
        dir,
        handler: taskSeed.handler,
        taskPath: taskSeed.path.replace(/\.ts$/, '')
      }

      return taskDescriptor
    },
    persistFile: async (dir: string, fileName: string, content: string) => {
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
    }
  }
})

createTest.setSchema({
  descriptorName: Schema.types.string
})
