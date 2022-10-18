/* global describe, expect, it */
const DataStore = require('../../index')
const path = require('path')

describe('Fetch base', function () {
  it('Should fetch from file', async function () {
    const dataStore = new DataStore({
      path: path.resolve(__dirname, './fixtures/base')
    })
    await dataStore.fetch()

    const data = dataStore.toJSON()
    expect(data).to.deep.equal([
      { item: true },
      { item: false }
    ])
  })
})
