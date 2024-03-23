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
    let label = `Tape #${i}: ${JSON.stringify(logRecord.input)} with success result`

    if (logRecord.error !== undefined) {
      label = `Tape #${i}: ${JSON.stringify(logRecord.input)} with error`
    }
    it(label, async function () {
      let res, error: Error | undefined
      try {
        res = await getDelta.run(logRecord.input as unknown as TastArgv)
      } catch (e) {
        error = e
      }

      if (error !== undefined) {
        expect(res).to.be.equal(undefined)
        expect(error.message).to.be.equal(logRecord.error)
      } else {
        expect(res).to.be.deep.equal(logRecord.output)
        expect(error).to.be.equal(undefined)
      }
    })
  })
})
