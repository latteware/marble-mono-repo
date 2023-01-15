import * as assert from 'assert'

interface Record {
  input: any[]
  output?: any
  error?: string
}

interface Boundary extends Function {
  getTape: Function
  setTape: Function
  getMode: Function
  setMode: Function

  startRun: Function
  stopRun: Function
  getRunData: Function
}

const findRecord = (record, tape): any => {
  const result = tape.find((item: any) => {
    if (typeof item === 'undefined') { return false }

    let error
    try {
      assert.deepEqual(record, item.input)
    } catch (e) {
      error = e
    }

    return typeof error === 'undefined'
  })

  return result
}

export const createBoundary = function (fn): Boundary {
  let runLog: any[] = []
  let cacheTape: any[] = []
  let mode: string = 'proxy'
  let hasRun: boolean = false

  const q = async (...argv): Promise<any> => {
    const record: Record = {
      input: argv
    }

    if (mode === 'proxy-pass') {
      const record = findRecord(argv, cacheTape)

      if (typeof record !== 'undefined') {
        return await (async () => {
          return record.output
        })()
      }
    }

    if (mode === 'replay') {
      return await (async () => {
        const record = findRecord(argv, cacheTape)

        if (typeof record === 'undefined') {
          throw new Error('No tape value for this inputs')
        }

        if (typeof record.error !== 'undefined') {
          throw new Error(record.error)
        }

        return record.output
      })()
    }

    return await (async () => {
      let result, error
      try {
        result = await fn(...argv)
      } catch (e) {
        error = e
      }

      if (typeof error !== 'undefined') {
        const prevRecord: Record = findRecord(argv, cacheTape)
        if (mode === 'proxy-catch' && typeof prevRecord !== 'undefined') {
          return await (async () => {
            return prevRecord.output
          })()
        } else {
          record.error = error.message

          if (hasRun) { runLog.push(record) }
          cacheTape.push(record)

          throw error
        }
      } else {
        record.output = result

        if (hasRun) { runLog.push(record) }
        cacheTape.push(record)

        return result
      }
    })()
  }

  // tape cache
  q.getTape = function () {
    return cacheTape
  }

  q.setTape = function (newTape) {
    cacheTape = newTape
  }

  // Mode
  q.getMode = function (newMode) {
    return mode
  }

  q.setMode = function (newMode) {
    mode = newMode
  }

  // run log
  q.startRun = function (): void {
    runLog = []
    hasRun = true
  }

  q.stopRun = function (): void {
    hasRun = false
  }

  q.getRunData = function (): any[] {
    return runLog
  }

  return q
}
