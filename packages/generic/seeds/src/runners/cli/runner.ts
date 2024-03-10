import { Runner } from '@marble-seeds/runner'

import { createTask } from '../../tasks/createTask'
import { init } from '../../tasks/init'
import { listTasks } from '../../tasks/listTasks'
import { runTask } from '../../tasks/runTask'

export const runner = new Runner()

runner.load('init', init)

runner.load('task:list', listTasks)
runner.load('task:create', createTask)
runner.load('task:run', runTask)
