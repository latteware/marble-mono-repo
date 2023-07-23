/* global describe, it */
import { expect } from 'chai'
import { Task } from '@marble-seeds/task'

import { TaskRunner } from '../../index'

describe('Tape tests', function () {
  it('Should run a task', async function () {
    const task = new Task(() => {
      return 'hi five!!!'
    })

    const runner = new TaskRunner()
    runner.load('sample', task)

    const result = await runner.run('sample', {})

    expect(result).to.equal('hi five!!!')
  })
})
