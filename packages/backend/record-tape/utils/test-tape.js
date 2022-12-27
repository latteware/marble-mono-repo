/* global describe, before, it, expect */
const testCreation = (fn, suiteName, tape, task) => {
  fn(`Suite: ${suiteName}`, function () {
    let testFn
    before(function () {
      tape.loadSync()

      task.setMode('replay')
      task.setBoundariesTapes(tape.getBoundaries())

      testFn = async (argv) => {
        return await task.run(argv)
      }
    })

    for (const record of tape.getLog()) {
      it(`Test input ${JSON.stringify(record.input)}, should ${record.error ? 'fail' : 'give output'}`, async function () {
        let result, error
        try {
          result = await testFn(record.input)
        } catch (e) {
          error = e
        }

        if (record.output) {
          expect(error).to.equal(undefined)
          expect(record.output).to.deep.equal(result)
        }

        if (record.error) {
          expect(result).to.equal(undefined)
          expect(record.error).to.deep.equal(error.message)
        }
      })
    }
  })
}

// This function takes a tape and build a mocha set of test
const testTape = (suiteName, tape, testFn) => {
  testCreation(describe, suiteName, tape, testFn)
}

testTape.only = (suiteName, tape, testFn) => {
  testCreation(describe.only, suiteName, tape, testFn)
}

testTape.skip = (suiteName, tape, testFn) => {
  testCreation(describe.skip, suiteName, tape, testFn)
}

module.exports = testTape
