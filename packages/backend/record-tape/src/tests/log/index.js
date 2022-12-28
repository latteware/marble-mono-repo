/* global describe, expect, it */
const RecordTape = require('../../index')

describe('Log items', function () {
  it('Add successful log item', async function () {
    const tape = new RecordTape()

    tape.addLogItem({
      input: {},
      output: {}
    })

    const { log } = tape.getData()
    expect(log.length).to.equal(1)
  })

  it('Add error log item', async function () {
    const tape = new RecordTape()

    tape.addLogItem({
      input: {},
      error: new Error('sample error')
    })

    const { log } = tape.getData()
    expect(log.length).to.equal(1)
  })

  it('Should not record it on invalid log item', async function () {
    const tape = new RecordTape()

    tape.addLogItem({})

    const { log } = tape.getData()
    expect(log.length).to.equal(0)
  })
})
