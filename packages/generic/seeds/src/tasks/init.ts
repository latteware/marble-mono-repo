import { Task } from '@marble-seeds/task'
import path from 'path'
import fs from 'fs/promises'

import { type SeedsConf } from './types'

// Remove this comment once you add the params options that that the task allow
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TastArgv {}

export const init = new Task(async function (argv: TastArgv) {
  const seedsPath = path.join(process.cwd(), 'seeds.json')
  const config: SeedsConf = {
    paths: {
      logs: 'logs/',
      tasks: 'src/tasks/',
      runners: 'src/runners/',
      fixtures: 'src/tests/fixtures',
      tests: 'src/tests/'
    },
    tasks: {},
    runners: {}
  }

  await fs.writeFile(seedsPath, JSON.stringify(config, null, 2))
  console.log('seeds.json has been created')

  return config
}, {
  boundaries: {}
})

init.setSchema({})
