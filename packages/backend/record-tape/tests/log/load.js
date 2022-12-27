/* global describe, expect, it */
const path = require('path')
const RecordTape = require('../../index')

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
