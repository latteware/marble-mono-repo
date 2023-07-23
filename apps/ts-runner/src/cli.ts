import { TaskRunner } from '@marble-seeds/task-runner'

import { runner } from './index'

(async function () {
  const { action, taskName, args } = TaskRunner.getArgs()

  if (action === 'list') {
    const listItems: string = runner.getTaskList().join(' ,')
    console.log(`Available tasks: ${listItems}`)
  } else if (action === 'run') {
    await runner.run(taskName, args)
  } else if (action === 'clean-log') {
    await runner.cleanLog(taskName)
  } else {
    throw new Error('Invalid action')
  }
})().catch((err) => {
  console.log('Error!!!', err)

  process.exit(1)
})
