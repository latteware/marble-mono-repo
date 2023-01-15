/* global describe, expect, it */
const { RecordTape } = require('@marble-seeds/record-tape')
const { Task } = require('@marble-seeds/task')

const path = require('path')

describe('Record from task', function () {
  it('Should create fixture file', async function () {
    const tapeFilePath = path.resolve(__dirname, './fixtures/temp-log')
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
})
