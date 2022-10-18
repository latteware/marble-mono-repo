/* global describe, expect, it */
const base = require('../../index')

describe('Sample', function () {
  it('Simple test', async function () {
    const result = base.main()

    expect(result).to.equal(true)
  })
})
