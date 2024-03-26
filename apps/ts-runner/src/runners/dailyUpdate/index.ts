import { Runner } from '@marble-seeds/runner'

// Import tasks
import { getPrice } from '../../tasks/stocks/getPrice'

export const runner = new Runner()

// Load task into runner
runner.load('stocks:getPrice', getPrice)

runner.pargeArguments = function (data) {
  console.log('->', data)

  return {
    taskName: data.task,
    args: data.args
  }
}

runner.handler = async function (data) {
  console.log('Data?', data)
  const { taskName, args }: { taskName: string, args: any } = runner.pargeArguments(data)

  const res = await runner.run(taskName, args)

  console.log('->', res)
  return res
}
