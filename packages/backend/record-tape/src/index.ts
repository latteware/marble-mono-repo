import fs from 'fs'

interface LogRecord {
  name: string
  type: 'success' | 'error'
  input: any[]

  output?: any
  error?: any

  boundaries: any
}

interface SuccessLogItem {
  input: any[]
  output: any
  boundaries?: any
}

interface ErrorLogItem {
  input: any[]
  error: any
  boundaries?: any
}

function isSuccessLogItem (log: SuccessLogItem | ErrorLogItem): log is SuccessLogItem {
  return (log as SuccessLogItem).output !== undefined
}

function isErrorLogItem (log: SuccessLogItem | ErrorLogItem): log is ErrorLogItem {
  return (log as ErrorLogItem).error !== undefined
}

type LogItem = SuccessLogItem | ErrorLogItem

interface Config {
  path?: fs.PathLike
  log?: LogRecord[]
  boundaries?: any
}

export const RecordTape = class RecordTape {
  _path: fs.PathLike | undefined
  _mode: string
  _boundaries: any
  _log: LogRecord[]

  constructor (config: Config = {}) {
    this._path = typeof config.path === 'string' ? `${config.path}.log` : undefined
    this._log = config.log ?? []
    this._boundaries = config.boundaries ?? {}
    this._mode = 'record'
  }

  // Data functions
  getLog (): any[] {
    return this._log
  }

  getMode (): string {
    return this._mode
  }

  setMode (mode: string): void {
    this._mode = mode
  }

  addLogItem (name: string, logItem: LogItem): void {
    if (this._mode === 'replay') {
      return
    }

    if (isSuccessLogItem(logItem)) {
      const { input, output, boundaries = {} } = logItem

      this._log.push({ name, type: 'success', input, output, boundaries })
    } else if (isErrorLogItem(logItem)) {
      const { input, error, boundaries = {} } = logItem

      this._log.push({ name, type: 'error', input, error, boundaries })
    } else {
      throw new Error('invalid log item')
    }
  }

  stringify (): string {
    let log = ''

    for (const logItem of this._log) {
      const str = JSON.stringify(logItem)
      log = log + str + '\n'
    }

    return log
  }

  recordFrom (name, task): void {
    // Add listner
    task._listener = async (logItem, boundaries) => {
      // Only update if mode is record
      if (this.getMode() === 'record') {
        this.addLogItem(name, logItem)

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
    if (typeof this._path === 'undefined') { return }
    const readFile = fs.promises.readFile

    let content, err
    try {
      content = await readFile(this._path, 'utf8')
    } catch (e) {
      err = e
    }

    if (typeof err !== 'undefined') {
      return
    }

    const items = content.split('\n')
    const log: LogRecord[] = []

    for (const item of items) {
      if (item !== '') {
        const data: LogRecord = JSON.parse(item)
        log.push(data)
      }
    }

    this._log = log

    return log
  }

  loadSync (): any {
    if (typeof this._path === 'undefined') { return }

    if (!fs.existsSync(this._path)) {
      return
    }

    const content = fs.readFileSync(this._path, 'utf8')

    const items = content.split('\n')
    const log: LogRecord[] = []

    for (const item of items) {
      if (item !== '') {
        const data: LogRecord = JSON.parse(item)
        log.push(data)
      }
    }

    this._log = log

    return log
  }

  async save (): Promise<void> {
    if (typeof this._path === 'undefined') { return }

    const writeFile = fs.promises.writeFile
    const content = this.stringify()

    await writeFile(this._path, content, 'utf8')
  }

  saveSync (): void {
    if (typeof this._path === 'undefined') { return }

    const content = this.stringify()

    fs.writeFileSync(this._path, content, 'utf8')
  }
}
