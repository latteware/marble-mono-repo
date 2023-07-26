/* global describe, it */
import * as path from 'path'
import { expect } from 'chai'
import { RecordTape } from '../../src/index'

const emptyPath = path.resolve('any')
const tapePath = path.resolve(__dirname, '../fixtures/load')

describe('Base tests', function () {
  it('Load sync with no file should return a empty tape', function () {
    const tape = new RecordTape({ path: emptyPath })
    tape.loadSync()

    const data = tape.getLog()
    expect(data.length).to.equal(0)
  })

  it('Load sync with fixture tape should return a tape with one element', function () {
    const tape = new RecordTape({ path: tapePath })
    tape.loadSync()

    const data = tape.getLog()
    expect(data.length).to.equal(2)
  })

  it('Load with no file should return a empty tape', async function () {
    const tape = new RecordTape({ path: emptyPath })
    await tape.load()

    const data = tape.getLog()
    expect(data.length).to.equal(0)
  })

  it('Load with fixture tape should return a tape with one element', async function () {
    const tape = new RecordTape({ path: tapePath })
    await tape.load()

    const data = tape.getLog()
    expect(data.length).to.equal(2)
  })
})
