/* global describe, expect, it */
const RecordTape = require('../../index')

describe('Boundaries items', function () {
  it('Add successful log item', async function () {
    const tape = new RecordTape()

    tape.addBoundaryItem('add', {
      input: { value: 4, increment: 1 },
      output: 5
    })

    tape.addBoundaryItem('add', {
      input: { value: 4, increment: 2 },
      output: 6
    })

    const { boundaries } = tape.getData()
    expect(boundaries).to.deep.equal({
      add: [
        { input: { value: 4, increment: 2 }, output: 6 },
        { input: { value: 4, increment: 1 }, output: 5 }
      ]
    })
  })
})
