import { Task } from '@marble-seeds/task'
import { type PathLike } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { type SeedsConf } from '../types'

export const load = new Task(async function (_, { readFile }) {
  const seedsPath = path.join(process.cwd(), 'seeds.json')
  const raw: string = await readFile(seedsPath)
  const conf = JSON.parse(raw)

  if (conf.runners === undefined) {
    conf.runners = {}
  }

  return conf as SeedsConf
}, {
  boundaries: {
    readFile: async (path: PathLike) => {
      const content = await fs.readFile(path, 'utf-8')

      return content
    }
  }
})

load.setSchema({})
