/* global describe, expect, it */
const RecordTape = require('../../index')

const Task = require('@marble-seeds/task')

const getPackageJsonTape = require('./fixtures/get-package-json-tape.json')

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

describe('Sample', function () {
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

    tape.recordFrom(task)

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

    tape.recordFrom(task)

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

    tape.recordFrom(task)

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

  it('Should have on boundaries item be added on run', async function () {
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

    tape.recordFrom(task)

    await task.run({
      org: 'latteware',
      repo: 'repo-2',
      filePath: 'package.json'
    })

    const { getFileContent: boundaryTape } = tape.getBoundaries()

    expect(boundaryTape.length).to.equal(2)
    expect(boundaryTape[1].input).to.deep.equal([{ org: 'latteware', repo: 'repo-2', filePath: 'package.json' }])
    expect(boundaryTape[1].output).to.deep.equal({ org: 'latteware', repo: 'repo-2', filePath: 'package.json' })
  })
})
