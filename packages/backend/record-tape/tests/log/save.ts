/* global describe, it */
import { expect } from 'chai'
import fs from 'fs'
import path from 'path'
import { RecordTape } from '../../src/index'

const logFileData = '{"name":"name","type":"success","input":[true],"output":true,"boundaries":{}}\n{"name":"name","type":"error","input":[true],"error":"invalid data","boundaries":{}}\n'

describe('Save to file', function () {
  it('Save async', async function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/save')
    try {
      await fs.promises.unlink(tapeFilePath + '.log')
    } catch (e) {
      console.warn('didnt found a file to unlink')
    }

    const tape = new RecordTape({ path: tapeFilePath })
    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })
    await tape.save()

    const content = await fs.promises.readFile(tapeFilePath + '.log', 'utf8')

    expect(logFileData).to.deep.equal(content)
  })

  it('Save sync', function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/save')
    try {
      fs.unlinkSync(tapeFilePath + '.log')
    } catch (e) {
      console.warn('didnt found a file to unlink')
    }

    const tape = new RecordTape({ path: tapeFilePath })
    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })
    tape.saveSync()

    const content = fs.readFileSync(tapeFilePath + '.log', 'utf8')

    expect(logFileData).to.deep.equal(content)
  })
})
