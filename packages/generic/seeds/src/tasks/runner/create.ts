import path from 'path'
import fs from 'fs/promises'
import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import camelCase from 'camelcase'
import Handlebars from 'handlebars'

import { load } from '../conf/load'
import { type SeedsConf } from '../types'

export interface TastArgv {
  runnerName: string
}

const templatePath = path.resolve(__dirname, '../templates/runner.hbs')

export const createRunner = new Task(async function (argv: TastArgv, { loadConf, loadTemplate, persistRunner, persistConf }) {
  const seeds: SeedsConf = await loadConf()

  const name = camelCase(argv.runnerName)
  const runnerPath = path.join(seeds.paths.runners, name)
  const fullPath = `${runnerPath}/index.ts`

  console.log(`
  ==================================================
  Starting runner creation!
  Creating: ${name}
  Into: ${runnerPath}
  Full path: ${fullPath}
  ==================================================
  `)

  const template = await loadTemplate()
  const comp = Handlebars.compile(template)
  const content = comp({})

  await persistRunner(runnerPath, 'index.ts', content)
  seeds.runners[name] = {
    path: `${runnerPath}/index.ts`
  }

  await persistConf(seeds)

  const status = {
    name,
    content
  }

  return status
}, {
  boundaries: {
    loadConf: async () => {
      return await load.run({})
    },
    persistConf: async (seeds: SeedsConf) => {
      const seedsPath = path.join(process.cwd(), 'seeds.json')
      await fs.writeFile(seedsPath, JSON.stringify(seeds, null, 2))
    },
    loadTemplate: async () => {
      const template = await fs.readFile(templatePath, 'utf-8')

      return template
    },
    persistRunner: async (dir: string, name: string, content: string) => {
      const runnerPath = path.resolve(dir, name)

      let err
      try {
        await fs.stat(runnerPath)
      } catch (e) {
        err = e
      }

      if (err === undefined) {
        throw new Error(`File '${runnerPath}' already exists.`)
      }

      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(runnerPath, content, 'utf-8')

      return {
        path: runnerPath.toString()
      }
    }
  }
})

createRunner.setSchema({
  runnerName: Schema.types.string
})
