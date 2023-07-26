/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/await-thenable */

/* global describe, it */
import { expect } from 'chai'
import path from 'path'
import fs from 'fs/promises'
import { Task } from '@marble-seeds/task'

import { TaskRunner } from '../../src/index'

const logContent = '{"name":"test","type":"success","input":{},"output":"hi five!!!","boundaries":{}}\n'

describe('[Task runner]Tape tests', function () {
  it.only('Should run a task and check that a log item was created', async function () {
    const tapeFilePath = path.resolve(__dirname, '../fixtures/status.log')
    try {
      await fs.unlink(tapeFilePath)
    } catch (e) {
      console.warn('Didnt found a file to unlink')
    }

    const task = new Task(() => {
      return 'hi five!!!'
    })

    const dir = path.resolve(__dirname, '../fixtures')

    const runner = new TaskRunner()
    await runner.setTapeFolder(dir)

    runner.load('status', task)

    const result = await runner.run('status', {})

    const content = await fs.readFile(tapeFilePath, 'utf8')

    expect(result).to.equal('hi five!!!')
    expect(content).to.equal(logContent)
  })
})

describe.only('[Task runner]Validate log folder', function () {
  it('Should fail to set a tape folder that doesn\'t exists, sync version', function () {
    const runner = new TaskRunner()

    let err
    try {
      runner.setTapeFolderSync('./nowhere')
    } catch (error) {
      err = error
    }

    expect(err).to.not.equal(undefined)
    expect(err.message).to.equal('Folder doesn\'t exists')
  })

  it('Should fail to set a tape folder that doesn\'t exists, sync version', async function () {
    const runner = new TaskRunner()

    const dir = path.resolve(__dirname, './nowhere')

    let err
    try {
      await runner.setTapeFolder(dir)
    } catch (error) {
      err = error
    }

    expect(err).to.not.equal(undefined)
    expect(err.message).to.equal('Folder doesn\'t exists')
  })
})
