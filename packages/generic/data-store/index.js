const fs = require('fs').promises

const DataStore = class {
  constructor (config) {
    this._path = config && config.path ? `${config.path}.json` : null
    this._data = []
  }

  toJSON () {
    return this._data
  }

  async fetch () {
    const content = await fs.readFile(this._path, 'utf-8')
    this._data = JSON.parse(content)
  }

  async sync () {
    const content = JSON.stringify(this._data)

    await fs.writeFile(this._path, content, 'utf-8')
  }

  transform (fn) {
    const data = fn(this._data)

    this._data = data
  }

  // Transform wrappers
  set (data) {
    this.transform(() => {
      return data
    })
  }

  push (item) {
    this.transform((data) => {
      data.push(item)

      return data
    })
  }

  pop () {
    let item
    this.transform((data) => {
      item = data.pop()

      return data
    })

    return item
  }
}

module.exports = DataStore
