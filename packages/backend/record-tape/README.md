## Marble seeds Record Tape

## Install with

```
npm i @marble-seeds/@marble-seeds/record-tape
```

## Docs

RecordTape is a data structure ment to persist [Task](https://github.com/latteware/marble-backend-task) data that is the main package from marble-seeds.

Allows to record all the task executions and the boundaries data of that execution so it can be easily manipulate and replayed.

Has 2 main sections:

- **log:** this part contains the input/output of all the tasks that where executed.
- **boundaries:** this part contains the inputs/outputs of the external calls of the task.

By having this 2 elements the task can be replayed with out touching external elements and test of the input/outputs are the same. By keeping this records the tape can be used to create test robust test with close to no effort and refactor in a simple way.

### Testing

One of the main use cases is to test Task with the testTape function that generates mocha test from a tape structure.

```
const RecordTape = require('@marble-seeds/record-tape')

const task = require('../../tasks/fetch-raw-list')

const tape = task.getTape()
tape.loadSync()

RecordTape.testTape('Tape POC tests', tape, async (argv) => {
  return await task.run(argv)
})
```

`RecordTape.testTape.only` and `RecordTape.testTape.skip` also are posible to mimic `skip/only` mocha test functionality
