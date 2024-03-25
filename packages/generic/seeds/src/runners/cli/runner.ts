import { install as addSourceMapSupport } from 'source-map-support'

import { Runner } from '@marble-seeds/runner'

import { init } from '../../tasks/init'
import { getInfo } from '../../tasks/conf/info'

// task
import { list as listTasks } from '../../tasks/task/list'
import { create as createTask } from '../../tasks/task/create'
import { run as runTask } from '../../tasks/task/run'
import { saveFixture } from '../../tasks/task/saveFixture'
import { createTest } from '../../tasks/task/createTest'

// runner
import { createRunner } from '../../tasks/runner/create'
import { run as runCurrentRunner } from '../../tasks/runner/run'
import { list as listCurrentRunner } from '../../tasks/runner/list'

addSourceMapSupport()

interface InputArgs {
  taskName: string
  action?: string
  args: any
}

export const runner = new Runner()

runner.load('init', init)
runner.load('info', getInfo)

runner.load('task:list', listTasks)
runner.load('task:create', createTask)
runner.load('task:run', runTask)
runner.load('task:createTest', createTest)
runner.load('task:saveFixture', saveFixture)

runner.load('runner:create', createRunner)
runner.load('runner:run', runCurrentRunner)
runner.load('runner:list', listCurrentRunner)

runner.pargeArguments = function (data) {
  const { _, ...filteredObj } = data

  return {
    taskName: _[0],
    action: _[1],
    args: filteredObj
  }
}

runner.handler = async function (data) {
  const { taskName, action, args }: InputArgs = runner.pargeArguments(data)
  console.log('->', taskName, action, args)

  const task = runner.getTask(taskName)
  if (task === undefined) {
    console.error('Invalid options')
    process.exit(1)
  }

  console.log('================================================')
  console.log(`Running ${taskName} with ${JSON.stringify(args)}`)
  console.log('================================================')

  let res
  if (['task:create', 'task:createTest', 'task:saveFixture', 'runner:create', 'runner:list'].includes(taskName)) {
    console.log('Here ->', action)
    res = await task.run({
      descriptorName: action
    })
  } else if (taskName === 'runner:run') {
    const { task: taskDescriptor, ...params } = args
    console.log('->', taskDescriptor, params)
    res = await task.run({
      runnerName: action,
      taskName: taskDescriptor,
      params
    })
  } else if (taskName === 'task:run') {
    res = await task.run({
      descriptorName: action,
      args
    })
  } else {
    res = await task.run(args)
  }

  console.log('Run successfully:', res)
  return res
}
