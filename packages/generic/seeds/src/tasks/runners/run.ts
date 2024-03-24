import { Task } from '@marble-seeds/task'
// import Schema from '@marble-seeds/schema'

import { load } from '../conf/load'

export interface TastArgv {
  taskName: string
}

export const run = new Task(async function (argv: TastArgv, { loadConf, loadConfV2 }) {
  const seeds = await loadConf({})

  const status = { status: 'Ok', seeds }

  return status
}, {
  boundaries: {
    loadConf: load.asBoundary()
  }
})

// Add argument: Schema.types.string
run.setSchema({})
