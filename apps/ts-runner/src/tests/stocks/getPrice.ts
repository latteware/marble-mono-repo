import { expect } from 'chai'
import path from 'path'

import { RecordTape } from '@marble-seeds/record-tape'

import { getPrice, type TastArgv } from '../../tasks/stocks/getPrice'

getPrice.setMode('replay')

const tapePath = path.resolve(__dirname, '../fixtures/stocks:getPrice')
const tape = new RecordTape({
  path: tapePath
})

tape.loadSync()

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
getPrice.setBoundariesData(tape.compileCache())

describe.only('stocks:getPrice tape', function () {
  tape.getLog().forEach((logRecord, i) => {
    it(`Tape #${i}: ${JSON.stringify(logRecord.input)}`, async function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await getPrice.run(logRecord.input as unknown as TastArgv)

      expect(res).to.be.deep.equal(logRecord.output)
    })
  })
})
