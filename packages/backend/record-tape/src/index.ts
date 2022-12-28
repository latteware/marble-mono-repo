import * as fs from 'fs'

interface LogItem {
  input: any[]
  output: any
  boundaries: any
}

interface Config {
  path?: string
  log?: LogItem[]
  boundaries?: any
}

interface Tape {
  log: any[]
  boundaries: any
}

export const RecordTape = class RecordTape {
  _path: string | null
  _mode: string
  _boundaries: any
  _log: LogItem[]

  constructor (config: Config = {}) {
    this._path = typeof config.path === 'string' ? `${config.path}.json` : null
    this._log = config.log ?? []
    this._boundaries = config.boundaries ?? {}
    this._mode = 'record'
  }

  _formatData (): Tape {
    return {
      log: this._log,
      boundaries: this._boundaries
    }
  }

  // Data functions
  getData (): Tape {
    return this._formatData()
  }

  getLog (): any[] {
    return this._log
  }

  getBoundaries (): any {
    return this._boundaries
  }

  getMode (): string {
    return this._mode
  }

  setMode (mode: string): void {
    this._mode = mode
  }

  addLogItem (item): any {
    if (this._mode === 'replay') {
      return
    }

    if (
      (typeof item.input !== 'undefined' && typeof item.output !== 'undefined') ||
      (typeof item.input !== 'undefined' && typeof item.error !== 'undefined')
    ) {
      return this._log.push(item)
    }
  }

  addBoundariesData (boundaries: any): void {
    this._boundaries = boundaries
  }

  addBoundaryItem (boundaryName: string, callData): void {
    const boundaries = this._boundaries

    if (typeof boundaries[boundaryName] === 'undefined') {
      boundaries[boundaryName] = []
    }

    // ToDo: implement clean up of repeated inputs
    const boundary = boundaries[boundaryName]
    boundary.unshift(callData)
  }

  recordFrom (task): void {
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

  // Load save functions
  async load (): Promise<any> {
    const readFile = fs.promises.readFile

    if (this._path === null) {
      return
    }

    let content, err
    try {
      content = await readFile(this._path, 'utf8')
    } catch (e) {
      err = e
    }

    if (typeof err !== 'undefined') {
      return
    }

    const data = JSON.parse(content)

    this._log = data.log
    this._boundaries = data.boundaries

    return data
  }

  loadSync (): any {
    if (this._path === null) {
      return
    }

    if (!fs.existsSync(this._path)) {
      return
    }

    const content = fs.readFileSync(this._path, 'utf8')

    const data = JSON.parse(content)

    this._log = data.log
    this._boundaries = data.boundaries

    return data
  }

  async save (): Promise<any> {
    if (typeof this._path !== 'undefined') { return }

    const writeFile = fs.promises.writeFile
    const data = this._formatData()
    const content = JSON.stringify(data, null, 2)

    await writeFile(this._path, content, 'utf8')

    return data
  }

  saveSync (): any {
    if (typeof this._path !== 'undefined') { return }

    const data = this._formatData()
    const content = JSON.stringify(data, null, 2)

    fs.writeFileSync(this._path, content, 'utf8')

    return data
  }
}
