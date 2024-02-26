import { Runner } from '@marble-seeds/runner'

import { createTask } from '../../tasks/createTask'
import { init } from '../../tasks/init'

export const runner = new Runner()

runner.load('init', init)
runner.load('create', createTask)
