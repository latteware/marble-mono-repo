/* global describe, it */
import { RecordTape } from '../../index'
import { expect } from 'chai'

describe('Log items', function () {
  it('Add successful log item', async function () {
    const tape = new RecordTape()

    tape.addLogItem('good run', {
      input: [{}],
      output: {}
    })

    const log = tape.getLog()
    expect(log.length).to.equal(1)
  })

  it('Add error log item', async function () {
    const tape = new RecordTape()

    tape.addLogItem('run error', {
      input: [{}],
      error: new Error('sample error')
    })

    const log = tape.getLog()
    expect(log.length).to.equal(1)
  })

  it('Should not record it on invalid log item', async function () {
    const tape = new RecordTape()

    // tape.addLogItem({ input: {} })

    const log = tape.getLog()
    expect(log.length).to.equal(0)
  })
})
