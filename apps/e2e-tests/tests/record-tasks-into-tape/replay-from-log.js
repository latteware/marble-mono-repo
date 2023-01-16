/* global describe, before, expect, it */
const { RecordTape } = require('@marble-seeds/record-tape')
const { Task } = require('@marble-seeds/task')

const path = require('path')

const tapeFilePath = path.resolve(__dirname, './fixtures/types')
const tape = new RecordTape({ path: tapeFilePath })
tape.loadSync()

describe('Replay', function () {
  let task
  before(() => {
    task = new Task(async function (argv, { getFilePath }) {
      const filePath = await getFilePath(argv.type)

      return { filePath }
    }, {
      boundaries: {
        getFilePath: async () => {}
      },
      boundariesData: tape.compileCache(),
      mode: 'replay'
    })
  })

  for (const logItem of tape.getLog()) {
    it(logItem.name, async function () {
      let result, err

      try {
        result = await task.run(logItem.input)
      } catch (e) {
        err = e
      }

      if (logItem.type === 'success') {
        expect(logItem.output).to.deep.equal(result)
        expect(logItem.err).to.deep.equal(undefined)
      } else if (logItem.type === 'error') {
        expect(logItem.error).to.deep.equal(err.message)
        expect(logItem.output).to.deep.equal(undefined)
      } else {
        throw new Error('invalid output type')
      }
    })
  }
})
