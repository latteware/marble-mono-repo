/* global describe, it */
import { RecordTape } from '../../index'
import { expect } from 'chai'

const baseTapeData = [
  {
    name: 'name', type: 'success', input: [true], output: true, boundaries: {}
  },
  {
    name: 'name', type: 'error', input: [true], error: 'invalid data', boundaries: {}
  }
]

const logFileData = '{"name":"name","type":"success","input":[true],"output":true,"boundaries":{}}\n{"name":"name","type":"error","input":[true],"error":"invalid data","boundaries":{}}\n'

describe('Log format', function () {
  it('Should ensure format', async function () {
    const tape = new RecordTape({})

    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })

    expect(tape.getLog()).to.deep.equal(baseTapeData)
  })

  it('Should serialize to one line per item', async function () {
    const tape = new RecordTape({})

    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })

    const logFile = tape.stringify()

    expect(logFile).to.deep.equal(logFileData)
  })
})
