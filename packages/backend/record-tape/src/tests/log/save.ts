/* global describe, it */
import { expect } from 'chai'
import fs from 'fs/promises'
import path from 'path'
import { RecordTape } from '../../index'

describe('Save', function () {
  it('Save to file', async function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/save')
    try {
      await fs.unlink(tapeFilePath + '.json')
    } catch (e) {

    }

    const tape = new RecordTape({ path: tapeFilePath })
    tape.addLogItem({ input: true, output: true })
    tape.addLogItem({ input: true, output: true })
    await tape.save()

    const baseTapeData = {
      log: [{ input: true, output: true }, { input: true, output: true }],
      boundaries: {}
    }

    expect(tape.getData()).to.deep.equal(baseTapeData)
  })
})
