import { TaskRunner } from '@marble-seeds/task-runner'

import { fetchJSON } from './tasks/fetch-json'
import { parseEmail } from './tasks/parse-email'

const runner = new TaskRunner()

runner.setTapeFolder('./logs')
runner.load('fetch-json', fetchJSON)
runner.load('parse-email', parseEmail)

export { runner }
