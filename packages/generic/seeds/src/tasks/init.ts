import { Task } from '@marble-seeds/task'
import path from 'path'
import fs from 'fs/promises'

// Remove this comment once you add the params options that that the task allow
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TastArgv {}

export const init = new Task(async function (argv: TastArgv) {
  const seedsPath = path.join(process.cwd(), 'seeds.json')
  const config = {
    paths: {
      tasks: 'src/tasks/',
      runners: 'src/runners/'
    }
  }

  console.log('Should init a project on', seedsPath)
  console.log('Init config', config)

  await fs.writeFile(seedsPath, JSON.stringify(config, null, 2))
  console.log('seeds.json has been created')

  return config
}, {
  boundaries: {}
})

init.setSchema({})
