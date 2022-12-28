/* global describe, expect, it */
const fs = require('fs').promises
const path = require('path')

const RecordTape = require('../../index')

describe('Save', function () {
  it('Save to file', async function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/save')
    await fs.unlink(tapeFilePath + '.json')

    const tape = new RecordTape({ path: tapeFilePath })
    tape.addLogItem({ input: true, output: true })
    tape.addLogItem({ input: true, output: true })
    await tape.save()

    const backupTape = new RecordTape({ path: tapeFilePath })
    await backupTape.load()

    expect(tape.getData()).to.deep.equal(backupTape.getData())
  })
})
