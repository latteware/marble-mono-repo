import { Runner } from '@marble-seeds/runner'

import { createTask } from '../../tasks/createTask'
import { init } from '../../tasks/init'
import { listTasks } from '../../tasks/listTasks'

export const runner = new Runner()

runner.load('init', init)

runner.load('listTasks', listTasks)

runner.load('create', createTask)
