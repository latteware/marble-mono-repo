/* global describe, expect, it */
const { RecordTape } = require('@marble-seeds/record-tape')
const { Task } = require('@marble-seeds/task')

const getPackageJsonTape = require('./fixtures/get-package-json-tape.json')

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

describe.skip('Replay task', function () {
  it('Should have on boundary loaded at the start', async function () {
    // clone tapes
    const tape = new RecordTape(clone(getPackageJsonTape))

    const task = new Task(function (argv) {
      return argv
    }, {
      boundaries: {
        getFileContent: async ({ org, repo, filePath }) => {}
      }
    })

    tape.recordFrom('sample', task)

    const { getFileContent } = task.getBoundaries()
    expect(getFileContent).to.not.equal(undefined)

    const boundaryTape = getFileContent.getTape()
    expect(boundaryTape.length).to.equal(1)
    expect(boundaryTape).to.deep.equal(getPackageJsonTape.boundaries.getFileContent)
  })

  it('Should have on boundary item be added on run', async function () {
    // clone tapes
    const tape = new RecordTape(clone(getPackageJsonTape))

    const task = new Task(async (argv, { getFileContent }) => {
      await getFileContent(argv)

      return argv
    }, {
      boundaries: {
        getFileContent: async ({ org, repo, filePath }) => {
          return { org, repo, filePath }
        }
      }
    })

    tape.recordFrom('sample', task)

    await task.run({
      org: 'latteware',
      repo: 'repo-1',
      filePath: 'package.json'
    })

    const { getFileContent } = task.getBoundaries()
    expect(getFileContent).to.not.equal(undefined)

    const boundaryTape = getFileContent.getTape()
    expect(boundaryTape.length).to.equal(2)
  })

  it('Should have on log item be added on run', async function () {
    // clone tapes
    const tape = new RecordTape(clone(getPackageJsonTape))

    const task = new Task(async (argv, { getFileContent }) => {
      await getFileContent(argv)

      return argv
    }, {
      boundaries: {
        getFileContent: async ({ org, repo, filePath }) => {
          return { org, repo, filePath }
        }
      }
    })

    tape.recordFrom('sample', task)

    await task.run({
      org: 'latteware',
      repo: 'repo-2',
      filePath: 'package.json'
    })

    const log = tape.getLog()
    expect(log.length).to.equal(3)
    expect(log[2].input).to.deep.equal({ org: 'latteware', repo: 'repo-2', filePath: 'package.json' })
    expect(log[2].output).to.deep.equal({ org: 'latteware', repo: 'repo-2', filePath: 'package.json' })
  })

  it('Should have on boundaries on log item after the run', async function () {
    // clone tapes
    console.log('Loading old tape ->', getPackageJsonTape)
    const tape = new RecordTape(clone(getPackageJsonTape))

    const task = new Task(async (argv, { getFileContent }) => {
      await getFileContent(argv)

      return argv
    }, {
      boundaries: {
        getFileContent: async ({ org, repo, filePath }) => {
          return { org, repo, filePath }
        }
      }
    })

    tape.recordFrom('sample', task)

    await task.run({
      org: 'latteware',
      repo: 'repo-2',
      filePath: 'package.json'
    })

    // const { getFileContent: boundaryTape } = tape.getBoundaries()

    const log = tape.getLog()
    console.log('->', log[0])

    console.log('->', tape.stringify())

    // expect(log[1].boundaries.getFileContent).to.deep.equal([{ org: 'latteware', repo: 'repo-2', filePath: 'package.json' }])
    // expect(boundaryTape[1].output).to.deep.equal({ org: 'latteware', repo: 'repo-2', filePath: 'package.json' })
  })
})
