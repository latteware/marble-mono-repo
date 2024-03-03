## Marble seeds Ttask-runner

## Install with

```
npm i @marble-seeds/task-runner
```

## Docs

After clone do

```
import { TaskRunner } from '@marble-seeds/task-runner'

import { fetchJSON } from './tasks/fetch-json'
import { parseEmail } from './tasks/parse-email'

const runner = new TaskRunner()

runner.setTapeFolder('./logs')
runner.load('fetch-json', fetchJSON)
runner.load('parse-email', parseEmail)

export { runner }
```

To get a new history, then point to the correct package

```
git remote set-url origin [Git repo]
```

Update the `package.json` file with the new name of you module and its repo

Then remove this part and write the docs of your package

