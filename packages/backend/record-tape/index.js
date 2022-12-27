const fs = require('fs')

const testTape = require('./utils/test-tape')

const RecordTape = class RecordTape {
  constructor (config = {}) {
    this._path = config.path ? `${config.path}.json` : null
    this._log = config.log || []
    this._boundaries = config.boundaries || {}
    this._mode = 'record'
  }

  _formatData () {
    return {
      log: this._log,
      boundaries: this._boundaries
    }
  }

  // Data functions
  getData () {
    return this._formatData()
  }

  getLog () {
    return this._log
  }

  getBoundaries () {
    return this._boundaries
  }

  getMode () {
    return this._mode
  }

  setMode (mode) {
    this._mode = mode
  }

  addLogItem (item) {
    if (this._mode === 'replay') {
      return
    }

    if (
      (item.input && item.output) ||
      (item.input && item.error)
    ) {
      return this._log.push(item)
    }
  }

  addBoundariesData (boundaries) {
    this._boundaries = boundaries
  }

  addBoundaryItem (boundaryName, callData) {
    const boundaries = this._boundaries
    if (!boundaries[boundaryName]) {
      boundaries[boundaryName] = []
    }

    // ToDo: implement clean up of repeated inputs
    const boundary = boundaries[boundaryName]
    boundary.unshift(callData)
  }

  recordFrom (task) {
    // Add listner
    task._listener = async (logItem, boundaries) => {
      // Only update if mode is record
      if (this.getMode() === 'record') {
        this.addLogItem(logItem)
        this.addBoundariesData(boundaries)

        /*
          Update save logic
          - Should be an async update
          - Probably marking tape as dirty and pass the save responsability to the tape owners
        */
        this.saveSync()
      }
    }

    // Add boundaries tape
    task.setBoundariesTapes(this._boundaries)
  }

  replay ({ name, task }) {
    testTape(name, this, task)
  }

  replayOnly ({ name, task }) {
    testTape.only(name, this, task)
  }

  replaySkip ({ name, task }) {
    testTape.skip(name, this, task)
  }

  // Load save functions
  async load () {
    const readFile = fs.promises.readFile

    let content, err
    try {
      content = await readFile(this._path, 'utf8')
    } catch (e) {
      err = e
    }

    if (err) {
      return
    }

    const data = JSON.parse(content)

    this._log = data.log
    this._boundaries = data.boundaries

    return data
  }

  loadSync () {
    if (!fs.existsSync(this._path)) {
      return
    }

    const content = fs.readFileSync(this._path, 'utf8')

    const data = JSON.parse(content)

    this._log = data.log
    this._boundaries = data.boundaries

    return data
  }

  async save () {
    if (!this._path) { return }
    const writeFile = fs.promises.writeFile
    const data = this._formatData()
    const content = JSON.stringify(data, null, 2)

    await writeFile(this._path, content, 'utf8')

    return data
  }

  saveSync () {
    if (!this._path) { return }
    const data = this._formatData()
    const content = JSON.stringify(data, null, 2)

    fs.writeFileSync(this._path, content, 'utf8')

    return data
  }
}

module.exports = RecordTape
