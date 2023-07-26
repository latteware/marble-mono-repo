/* global describe, it */
import { expect } from 'chai'
import fs from 'fs'
import path from 'path'

import { RecordTape } from '../../src/index'

const logFileData = '{"name":"name","type":"success","input":[true],"output":true,"boundaries":{}}\n{"name":"name","type":"error","input":[true],"error":"invalid data","boundaries":{}}\n'

describe('[Record tape]Save to file async', function () {
  it('Save async to existing file(should add new logs)', async function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/save')
    try {
      await fs.promises.writeFile(tapeFilePath + '.log', logFileData)
    } catch (e) {
      console.warn('Didnt found a file to unlink')
    }

    const tape = new RecordTape({ path: tapeFilePath })
    await tape.load()
    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })
    await tape.save()

    const content = await fs.promises.readFile(tapeFilePath + '.log', 'utf8')

    expect(tape.getLog().length).to.deep.equal(4)
    expect(tape.stringify()).to.deep.equal(logFileData + logFileData)
    expect(content).to.deep.equal(logFileData + logFileData)
  })

  it('Save async to a path of invalid folder', async function () {
    const tapeFilePath = path.resolve(__dirname, '../nowhere/nop')

    const tape = new RecordTape({ path: tapeFilePath })
    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })

    let err
    try {
      await tape.save()
    } catch (error) {
      err = error
    }

    expect(err.message).to.deep.equal('Folder doesn\'t exists')
  })

  it('Save async to a log file that doesnt exist', async function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/nop')

    try {
      await fs.promises.unlink(tapeFilePath + '.log')
    } catch (e) {
      console.warn('Didnt found a file to unlink')
    }

    const tape = new RecordTape({ path: tapeFilePath })
    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })
    await tape.save()

    const content = await fs.promises.readFile(tapeFilePath + '.log', 'utf8')

    expect(logFileData).to.deep.equal(content)
  })
})

describe('[Record tape]Save to file sync', function () {
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

  it('Save sync to a path of invalid folder', function () {
    const tapeFilePath = path.resolve(__dirname, '../nowhere/nop')

    const tape = new RecordTape({ path: tapeFilePath })
    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })

    let err
    try {
      tape.saveSync()
    } catch (error) {
      err = error
    }

    expect(err.message).to.deep.equal('Folder doesn\'t exists')
  })

  it('Save sync to a log file that doesnt exist', function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/nop')

    try {
      fs.unlinkSync(tapeFilePath + '.log')
    } catch (e) {
      console.warn('Didnt found a file to unlink')
    }

    const tape = new RecordTape({ path: tapeFilePath })
    tape.addLogItem('name', { input: [true], output: true, boundaries: {} })
    tape.addLogItem('name', { input: [true], error: 'invalid data', boundaries: {} })
    tape.saveSync()

    const content = fs.readFileSync(tapeFilePath + '.log', 'utf8')

    expect(logFileData).to.deep.equal(content)
  })
})
