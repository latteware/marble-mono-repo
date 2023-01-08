/* global describe, it */
import { expect } from 'chai'
import path from 'path'
import { RecordTape } from '../../index'

const baseTapeData = [
  {
    name: 'name', type: 'success', input: [true], output: true, boundaries: {}
  },
  {
    name: 'name', type: 'error', input: [true], error: 'invalid data', boundaries: {}
  }
]

describe('Load', function () {
  it('Load async from file', async function () {
    const tape = new RecordTape({
      path: path.resolve(__dirname, '../fixtures/load')
    })

    await tape.load()
    const log = tape.getLog()

    expect(log).to.deep.equal(baseTapeData)
  })

  it('load sync from file', function () {
    const tape = new RecordTape({
      path: path.resolve(__dirname, '../fixtures/load')
    })

    tape.loadSync()
    const log = tape.getLog()

    expect(log).to.deep.equal(baseTapeData)
  })
})
