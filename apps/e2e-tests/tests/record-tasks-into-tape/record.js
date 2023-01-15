/* global describe, expect, it */
const { RecordTape } = require('@marble-seeds/record-tape')
const { Task } = require('@marble-seeds/task')

const fs = require('fs').promises
const path = require('path')

describe('Record from task', function () {
  it('Should create tape item', async function () {
    const tape = new RecordTape()

    const task = new Task(function (argv) {
      return argv
    })

    tape.recordFrom('test', task)

    await task.run({ value: 5 })

    const log = tape.getLog()

    expect(log.length).to.equal(1)
    expect(log[0]).to.deep.equal({
      name: 'test',
      type: 'success',
      input: { value: 5 },
      output: { value: 5 },
      boundaries: {}
    })
  })

  it('Should create tape item with boundaries', async function () {
    const tape = new RecordTape()

    const task = new Task(async function (argv, { getFilePath }) {
      const filePath = await getFilePath()

      return { filePath }
    }, {
      boundaries: {
        getFilePath: async () => {
          return 'readme.md'
        }
      }
    })

    tape.recordFrom('test', task)

    await task.run({ value: 5 })

    const log = tape.getLog()

    expect(log.length).to.equal(1)
    expect(log[0]).to.deep.equal({
      name: 'test',
      type: 'success',
      input: { value: 5 },
      output: { filePath: 'readme.md' },
      boundaries: { getFilePath: [{ input: [], output: 'readme.md' }] }
    })
  })

  it('Should create tape multiple items with boundaries', async function () {
    const tape = new RecordTape()

    const task = new Task(async function (argv, { getFilePath }) {
      const filePath = await getFilePath()

      return { filePath }
    }, {
      boundaries: {
        getFilePath: async () => {
          return 'readme.md'
        }
      }
    })

    tape.recordFrom('test', task)

    await task.run({ value: 5 })
    await task.run({ value: 5 })

    const log = tape.getLog()

    expect(log.length).to.equal(2)
    expect(log[0]).to.deep.equal({
      name: 'test',
      type: 'success',
      input: { value: 5 },
      output: { filePath: 'readme.md' },
      boundaries: { getFilePath: [{ input: [], output: 'readme.md' }] }
    })
    expect(log[1]).to.deep.equal({
      name: 'test',
      type: 'success',
      input: { value: 5 },
      output: { filePath: 'readme.md' },
      boundaries: { getFilePath: [{ input: [], output: 'readme.md' }] }
    })
  })

  it('Should create fixture file', async function () {
    const tapeFilePath = path.resolve(__dirname, './fixtures/simple-log')
    const tape = new RecordTape({ path: tapeFilePath })

    try {
      await fs.unlink(tapeFilePath + '.log')
    } catch (e) {
      console.warn('didnt found a file to unlink')
    }

    const task = new Task(async function (argv, { getFilePath }) {
      const filePath = await getFilePath()

      return { filePath }
    }, {
      boundaries: {
        getFilePath: async () => {
          return 'readme.md'
        }
      }
    })

    tape.recordFrom('test', task)

    await task.run({ value: 5 })
    await task.run({ value: 5 })

    await tape.save()

    const clone = new RecordTape({ path: tapeFilePath })
    await clone.load()

    expect(clone.stringify()).to.deep.equal(tape.stringify())
  })
})
