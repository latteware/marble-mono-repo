/* global describe, expect, it */
const { RecordTape } = require('@marble-seeds/record-tape')
const { Task } = require('@marble-seeds/task')

const path = require('path')

describe('Cache from tape to task', function () {
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
})
