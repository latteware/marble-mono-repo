import parseArgs from 'minimist'
import Schema from '@marble-seeds/schema'

import { createBoundary } from './utils/boundary'

interface TaskConfig {
  validate?: any
  mode?: string
  boundaries?: any
  boundariesTape?: any
}

export const Task = class Task {
  _fn: Function
  _mode: string
  _cli: boolean
  _coolDown: number

  _boundariesDefinition: any
  _boundaries: any | null
  _boundariesTapes: any | null

  _schema: any | undefined
  _listener: Function | undefined

  constructor (fn: Function, conf: TaskConfig = {}) {
    this._fn = fn
    // review how to add it in the same from on API and task
    this._schema = undefined
    if (typeof conf.validate !== 'undefined') {
      this._schema = new Schema(conf.validate)
    }

    this._mode = conf.mode ?? 'proxy'

    this._boundariesDefinition = conf.boundaries ?? {}

    this._listener = undefined

    // Cool down time before killing the process on cli runner
    this._coolDown = 1000

    // Review this assignment
    this._boundariesTapes = conf.boundariesTape ?? {}
    this._boundaries = this._createBounderies({
      definition: this._boundariesDefinition,
      baseData: this._boundariesTapes,
      mode: this._mode
    })
  }

  getMode (): string {
    return this._mode
  }

  setMode (mode: string): void {
    for (const name in this._boundaries) {
      const boundary = this._boundaries[name]

      boundary.setMode(mode)
    }

    this._mode = mode
  }

  setCliHandlers (): void {
    this._cli = true
  }

  setSchema (base: any): void {
    this._schema = new Schema(base)
  }

  getSchema (): any {
    if (typeof this._schema === 'undefined') {
      return new Schema({})
    }

    return this._schema
  }

  validate (argv: any): any | undefined {
    if (typeof this._schema === 'undefined') {
      return undefined
    }

    return this._schema.validate(argv)
  }

  // Listen and emit to make it easy to have hooks
  // Posible improvement to handle multiple listeners, but so far its not needed
  addListener (fn: Function): void {
    this._listener = fn
  }

  removeListener (): void {
    this._listener = undefined
  }

  /*
    The listener get the input/outout of the call
    Plus all the boundary data
  */
  emit (data: any): void {
    if (typeof this._listener === 'undefined') { return }

    const event = {
      ...data, boundaries: this.getBondariesRunLog()
    }

    this._listener(event)
  }

  getBoundaries (): any {
    return this._boundaries
  }

  setBoundariesTapes (boundariesTape: { [x: string]: any }): void {
    for (const name in this._boundaries) {
      const boundary = this._boundaries[name]

      let tape
      if (typeof boundariesTape !== 'undefined') {
        tape = boundariesTape[name]
      }

      if (typeof boundary !== 'undefined' && typeof tape !== 'undefined') {
        boundary.setTape(tape)
      }
    }
  }

  _createBounderies ({
    definition,
    baseData,
    mode = 'proxy'
  }: any): any {
    const boundariesFns = {}

    for (const name in definition) {
      const boundary = createBoundary(definition[name])

      if (typeof baseData !== 'undefined' && typeof baseData[name] !== 'undefined') {
        const tape = baseData[name]

        boundary.setTape(tape)
      }
      boundary.setMode(mode)

      boundariesFns[name] = boundary
    }

    return boundariesFns
  }

  getBondariesTape (): any {
    const boundaries = this._boundaries
    const boundariesTape = {}

    for (const name in boundaries) {
      const boundary = boundaries[name]

      boundariesTape[name] = boundary.getTape()
    }

    return boundariesTape
  }

  getBondariesRunLog (): any {
    const boundaries = this._boundaries
    const boundariesRunLog = {}

    for (const name in boundaries) {
      const boundary = boundaries[name]

      boundariesRunLog[name] = boundary.getRunData()
    }

    return boundariesRunLog
  }

  startRunLog (): void {
    const boundaries = this._boundaries

    for (const name in boundaries) {
      const boundary = boundaries[name]

      boundary.startRun()
    }
  }

  async run (argv: any): Promise<any> {
    // ToDo: have a better CLI handler, probably move of the task runner
    const cliArgs = parseArgs(process.argv.slice(2))
    delete cliArgs._
    argv = argv ?? cliArgs
    // End ToDo block

    // start run log
    this.startRunLog()
    const boundaries = this._boundaries

    const q = new Promise((resolve, reject) => {
      const error = this.validate(argv)

      if (typeof error !== 'undefined') {
        this.emit({
          input: argv,
          error: error.message
        })

        throw error
      }

      (async (): Promise<any> => {
        const outout = await this._fn(argv, boundaries)

        return outout
      })().then((output) => {
        this.emit({
          input: argv,
          output
        })

        resolve(output)
      }).catch((error) => {
        this.emit({
          input: argv,
          error: error.message
        })

        reject(error)
      })
    })

    if (this._cli) {
      q.then(output => {
        console.log('Success =>', output)
        setTimeout(() => process.exit(), this._coolDown)
      }).catch(error => {
        console.error('=>', error)
        process.nextTick(() => process.exit(1))
      })
    }

    // return q

    const result = await q

    return result
  }
}
