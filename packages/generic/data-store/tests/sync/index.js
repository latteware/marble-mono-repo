/* global describe, expect, it */
const path = require('path')
const fs = require('fs').promises

const DataStore = require('../../index')

describe('Sync base', function () {
  it('Should sync to file', async function () {
    const storePath = path.resolve(__dirname, './fixtures/base')
    try {
      await fs.unlink(storePath + '.json')
    } catch (e) {
      console.warn(e)
    }

    const dataStore = new DataStore({
      path: storePath
    })
    dataStore.set([
      { item: true },
      { item: false }
    ])
    await dataStore.sync()

    const content = await fs.readFile(storePath + '.json', 'utf-8')
    const data = JSON.parse(content)

    expect(data).to.deep.equal([
      { item: true },
      { item: false }
    ])
  })
})
