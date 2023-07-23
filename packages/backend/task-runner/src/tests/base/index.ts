/* global describe, it */
import { expect } from 'chai'
import { Task } from '@marble-seeds/task'

import { TaskRunner } from '../../index'

describe('Base test', function () {
  it('Should run a task', async function () {
    const task = new Task(() => {
      return 'hi five!!!'
    })

    const runner = new TaskRunner()
    runner.load('sample', task)

    const result = await runner.run('sample', {})

    expect(result).to.equal('hi five!!!')
  })

  it('Should run a task with params', async function () {
    const taskInt = new Task(({ int }: { int: number }) => {
      return int + 5
    })

    const runner = new TaskRunner()
    runner.load('sample', taskInt)

    const result = await runner.run('sample', { int: 6 })

    expect(result).to.equal(11)
  })

  it('Should run a task with params', async function () {
    const taskInt = new Task(({ int }: { int: number }) => {
      return int + 5
    })

    const taskString = new Task(({ str }: { str: string }) => {
      return str + ' world'
    })

    const runner = new TaskRunner()
    runner.load('int', taskInt)
    runner.load('string', taskString)

    const int = await runner.run('int', { int: 6 })
    const str = await runner.run('string', { str: 'hello' })

    expect(int).to.equal(11)
    expect(str).to.equal('hello world')
  })

  it('Should get task back', async function () {
    const taskInt = new Task(async ({ int }: { int: number }): Promise<number> => {
      return int + 5
    })

    const indentity = new Task(async function ({ int }: { int: number }): Promise<number> {
      return int + 5
    })

    const runner = new TaskRunner()
    runner.load('int', taskInt)

    const task = runner.getTask('int')

    let int = 0
    if (task !== undefined) {
      int = await task.run({ int: 6 })
    }
    const int2 = await taskInt.run({ int: 6 })
    const int3 = await indentity.run({ int: 6 })

    expect(int).to.equal(11)
    expect(int2).to.equal(11)
    expect(int3).to.equal(11)
  })
})
