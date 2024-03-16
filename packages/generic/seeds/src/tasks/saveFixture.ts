import path from 'path'

import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import { RecordTape } from '@marble-seeds/record-tape'

// Remove this comment once you add the params options that that the task allow
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TastArgv {
  descriptorName: string
}

export const saveFixture = new Task(async function ({ descriptorName }: TastArgv) {
  const logsPath = path.join(process.cwd(), 'logs', descriptorName)
  const fixturePath = path.join(process.cwd(), 'src/tests/fixtures', descriptorName)

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
  boundaries: {}
})

saveFixture.setSchema({
  descriptorName: Schema.types.string
})
