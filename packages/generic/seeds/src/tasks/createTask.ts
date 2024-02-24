import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import Handlebars from 'handlebars'
import path from 'path'
import fs from 'fs/promises'

const p = path
const templatePath = p.resolve(__dirname, '../templates/task.hbs')

interface TastArgv {
  taskName: string
  path: string
}

export const createTask = new Task(async function ({ taskName, path }: TastArgv, {
  loadTemplate,
  persisTask
}) {
  const fileName = `${taskName}.ts`
  console.log(`
  ==================================================
  Starting task creation!
  Creating: ${taskName}
  Into: ${path}
  ==================================================
  `)

  const template = await loadTemplate()
  const comp = Handlebars.compile(template)
  const content = comp({
    taskName
  })

  await persisTask(path, fileName, content)

  return { path, fileName }
}, {
  boundaries: {
    loadTemplate: async () => {
      const template = await fs.readFile(templatePath, 'utf-8')

      return template
    },
    persisTask: async (dir: string, fileName: string, content: string) => {
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

createTask.setSchema({
  taskName: Schema.types.string,
  path: Schema.types.string
})
