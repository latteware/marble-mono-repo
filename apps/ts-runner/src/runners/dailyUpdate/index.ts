import { Runner } from '@marble-seeds/runner'

// Import tasks
// import { task } from '../../tasks/name'

export const runner = new Runner()

// Load task into runner
// runner.load('taskName', task)

runner.pargeArguments = function (data) {
  console.log('->', data)

  return {
    taskName: data.task,
    args: data.args
  }
}

runner.handler = async function (data) {
  const { taskName, args }: { taskName: string, args: any } = runner.pargeArguments(data)

  const res = await runner.run(taskName, args)

  return res
}
