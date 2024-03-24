import { install as addSourceMapSupport } from 'source-map-support'

import { Runner } from '@marble-seeds/runner'

import { init } from '../../tasks/init'

// task
import { listTasks } from '../../tasks/listTasks'
import { createTask } from '../../tasks/createTask'
import { runTask } from '../../tasks/runTask'
import { saveFixture } from '../../tasks/saveFixture'
import { createTest } from '../../tasks/createTest'

// runner
import { createRunner } from '../../tasks/runners/create'

addSourceMapSupport()

export const runner = new Runner()

runner.load('init', init)

runner.load('task:list', listTasks)
runner.load('task:create', createTask)
runner.load('task:createTest', createTest)
runner.load('task:run', runTask)
runner.load('task:saveFixture', saveFixture)

runner.load('runner:create', createRunner)
