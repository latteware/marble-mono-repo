/* global describe, it */
import { expect } from 'chai'
import path from 'path'
import { RecordTape } from '../../index'

describe('Load', function () {
  it('Load from file', async function () {
    const tape = new RecordTape({
      path: path.resolve(__dirname, '../fixtures/load')
    })

    await tape.load()
    const data = tape.getData()

    expect(data).to.deep.equal({
      log: [
        { input: true, output: true }
      ],
      boundaries: {}
    })
  })

  it('Syn load from file', function () {
    const tape = new RecordTape({
      path: path.resolve(__dirname, '../fixtures/load')
    })

    tape.loadSync()
    const data = tape.getData()

    expect(data).to.deep.equal({
      log: [
        { input: true, output: true }
      ],
      boundaries: {}
    })
  })
})
