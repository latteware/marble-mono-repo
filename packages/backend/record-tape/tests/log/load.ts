/* global describe, it */
import { expect } from 'chai'
import path from 'path'
import fs from 'fs'

import { RecordTape } from '../../src/index'

const baseTapeData = [
  {
    name: 'name', type: 'success', input: [true], output: true, boundaries: {}
  },
  {
    name: 'name', type: 'error', input: [true], error: 'invalid data', boundaries: {}
  }
]

describe('Load async', function () {
  it('Load async from file', async function () {
    const tape = new RecordTape({
      path: path.resolve(__dirname, '../fixtures/load')
    })

    await tape.load()
    const log = tape.getLog()

    expect(log).to.deep.equal(baseTapeData)
  })

  it('Load async from file on a directory that doesnt exist', async function () {
    const tape = new RecordTape({
      path: path.resolve(__dirname, '../nowhere/nop')
    })

    let err
    try {
      await tape.load()
    } catch (error) {
      err = error
    }

    expect(err).to.not.equal(undefined)
    expect(err.message).to.equal('Logs folder doesn\'t exists')
  })

  it('Load async from file that doesnt exist', async function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/nop')

    try {
      await fs.promises.unlink(tapeFilePath + '.log')
    } catch (e) {
      console.warn('Didnt found a file to unlink')
    }

    const tape = new RecordTape({
      path: path.resolve(__dirname, '../fixtures/nop')
    })

    await tape.load()
    const log = tape.getLog()

    expect(log).to.deep.equal([])
  })
})

describe('Load sync', function () {
  it('load sync from file', function () {
    const tape = new RecordTape({
      path: path.resolve(__dirname, '../fixtures/load')
    })

    tape.loadSync()
    const log = tape.getLog()

    expect(log).to.deep.equal(baseTapeData)
  })

  it('Load sync from file on a directory that doesnt exist', async function () {
    const tape = new RecordTape({
      path: path.resolve(__dirname, '../somewhere/nop')
    })

    let err
    try {
      await tape.loadSync()
    } catch (error) {
      err = error
    }

    expect(err).to.not.equal(undefined)
    expect(err.message).to.equal('Logs folder doesn\'t exists')
  })

  it('Load sync from file that doesnt exist', async function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/nop')

    try {
      await fs.promises.unlink(tapeFilePath + '.log')
    } catch (e) {
      console.warn('Didnt found a file to unlink')
    }

    const tape = new RecordTape({
      path: path.resolve(__dirname, '../fixtures/nop')
    })

    await tape.loadSync()
    const log = tape.getLog()

    expect(log).to.deep.equal([])
  })
})
