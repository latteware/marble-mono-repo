import path from 'path'

import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import { RecordTape } from '@marble-seeds/record-tape'

import { load as loadConf } from '../conf/load'
import { type SeedsConf } from '../types'

interface TastArgv {
  descriptorName: string
}

export const saveFixture = new Task(async function ({ descriptorName }: TastArgv, { loadConf }) {
  const seeds: SeedsConf = await loadConf()
  const logsPath = path.join(process.cwd(), seeds.paths.logs, descriptorName)
  const fixturePath = path.join(process.cwd(), seeds.paths.fixtures, descriptorName)

  const tape = new RecordTape({ path: logsPath })
  await tape.load()

  const fixtures = new RecordTape({ path: fixturePath })
  await fixtures.load()
  const logItems = tape.getLog()

  if (logItems.length > 0) {
    fixtures.addLogRecord(logItems[0])
  }

  await fixtures.save()

  return {
    fixtures: fixtures.getLog().length
  }
}, {
  boundaries: {
    loadConf: loadConf.asBoundary()
  }
})

saveFixture.setSchema({
  descriptorName: Schema.types.string
})
