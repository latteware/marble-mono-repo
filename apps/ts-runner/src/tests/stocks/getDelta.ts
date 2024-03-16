/* global describe, it */
import { expect } from 'chai'
import path from 'path'

import { RecordTape } from '@marble-seeds/record-tape'

import { getDelta, type TastArgv } from '../../tasks/stocks/getDelta'

getDelta.setMode('replay')

const tapePath = path.resolve(__dirname, '../fixtures/stocks:getDelta')
const tape = new RecordTape({
  path: tapePath
})

tape.loadSync()

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
getDelta.setBoundariesData(tape.compileCache())

describe.only('stocks:getDelta tape', function () {
  tape.getLog().forEach((logRecord, i) => {
    it(`Tape #${i}: ${JSON.stringify(logRecord.input)}`, async function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await getDelta.run(logRecord.input as unknown as TastArgv)

      expect(res).to.be.deep.equal(logRecord.output)
    })
  })
})
