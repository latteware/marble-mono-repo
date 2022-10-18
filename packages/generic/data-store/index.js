const DataStore = class {
  constructor () {
    console.log('hi?')
  }

  transform (fn) {
    console.log('->', fn)
  }

  async fetch () {
    console.log('persisting')
  }

  async sync () {
    console.log('persisting')
  }
}

module.exports = {
  DataStore
}
