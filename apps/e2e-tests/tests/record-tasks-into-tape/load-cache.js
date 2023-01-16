/* global describe, expect, it */
const { RecordTape } = require('@marble-seeds/record-tape')
const { Task } = require('@marble-seeds/task')

const path = require('path')

describe('Cache from tape to task', function () {
  it('Task should have on boundary loaded at the start', async function () {
    const tapeFilePath = path.resolve(__dirname, './fixtures/simple-log')
    const tape = new RecordTape({ path: tapeFilePath })
    await tape.load()

    const task = new Task(function (argv) {
      return argv
    }, {
      boundaries: {
        getFilePath: async () => {}
      },
      mode: 'replay'
    })

    tape.recordFrom('sample', task)

    const { getFilePath } = task.getBoundaries()
    expect(getFilePath).to.not.equal(undefined)

    const boundaryTape = getFilePath.getTape()
    expect(boundaryTape.length).to.equal(2)
  })

  it('Should load boundariesData from tape and use it on run', async function () {
    const tapeFilePath = path.resolve(__dirname, './fixtures/simple-log')
    const tape = new RecordTape({ path: tapeFilePath })
    await tape.load()

    const task = new Task(async function (argv, { getFilePath }) {
      const filePath = await getFilePath()

      return { filePath }
    }, {
      boundaries: {
        getFilePath: async () => {
          return ''
        }
      },
      boundariesData: tape.compileCache(),
      mode: 'replay'
    })

    const result = await task.run({})

    expect(result.filePath).to.equal('readme.md')
  })

  it('Should replicate result from tape', async function () {
    const tapeFilePath = path.resolve(__dirname, './fixtures/types')
    const tape = new RecordTape({ path: tapeFilePath })
    await tape.load()

    const task = new Task(async (argv, { getFilePath }) => {
      const filePath = await getFilePath(argv.type)

      return { filePath }
    }, {
      boundaries: {
        getFilePath: async (type) => {}
      },
      boundariesData: tape.compileCache(),
      mode: 'replay'
    })

    tape.recordFrom('sample', task)

    const result = await task.run({
      type: 'doc'
    })

    expect(result.filePath).to.equal('readme.md')
  })
})
