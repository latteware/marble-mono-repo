/* global describe, expect, it */
const DataStore = require('../../index')

const baseData = [
  { item: true },
  { item: false }
]

describe('Transform base', function () {
  it('Should add an item', async function () {
    const dataStore = new DataStore()

    dataStore.transform(data => {
      data.push({
        item: true
      })

      return data
    })

    const data = dataStore.toJSON()
    expect(data).to.deep.equal([
      { item: true }
    ])
  })

  it('Should fill data', async function () {
    const dataStore = new DataStore()
    dataStore.set([...baseData])

    const data = dataStore.toJSON()
    expect(data.length).to.deep.equal(2)
    expect(data[0]).to.deep.equal({ item: true })
    expect(data[1]).to.deep.equal({ item: false })
  })

  it('Should add data', async function () {
    const dataStore = new DataStore()
    dataStore.set([...baseData])
    dataStore.push({ item: 4 })

    const data = dataStore.toJSON()
    expect(data.length).to.equal(3)
    expect(data[2]).to.deep.equal({ item: 4 })
  })

  it('Should add data', async function () {
    const dataStore = new DataStore()
    dataStore.set([...baseData])
    const item = dataStore.pop()

    const data = dataStore.toJSON()
    expect(data.length).to.equal(1)
    expect(data[0]).to.deep.equal({ item: true })

    expect(item).to.deep.equal({ item: false })
  })
})
