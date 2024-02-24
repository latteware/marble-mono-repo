import * as assert from 'assert'

type BaseBoundary = (...args: any[]) => any

export type Mode = 'proxy' | 'proxy-pass' | 'proxy-catch' | 'replay'

export const createBoundary = <Func extends BaseBoundary>(fn: Func): {
  (...args: Parameters<Func>): Promise<ReturnType<Func>>
  getTape: () => any[]
  setTape: (newTape: any) => void
  getMode: () => Mode
  setMode: (newMode: Mode) => void
  startRun: () => void
  stopRun: () => void
  getRunData: () => any[]
} => {
  interface Record {
    input: Parameters<Func>
    output?: any
    error?: string
  }

  let runLog: Record[] = []
  let cacheTape: Record[] = []
  let mode: Mode = 'proxy'
  let hasRun: boolean = false

  const wrappedFn = async (...args: Parameters<Func>): Promise<ReturnType<Func>> => {
    const findRecord = (record: Parameters<Func>, tape: Record[]): Record | undefined => {
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

    const record: Record = {
      input: args
    }

    if (mode === 'proxy-pass') {
      const record = findRecord(args, cacheTape)

      if (typeof record !== 'undefined') {
        return await (async () => {
          return record.output
        })()
      }
    }

    if (mode === 'replay') {
      return await (async () => {
        const record = findRecord(args, cacheTape)

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
        result = await fn(...args)
      } catch (e) {
        error = e
      }

      if (typeof error !== 'undefined') {
        const prevRecord: Record | undefined = findRecord(args, cacheTape)
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
  wrappedFn.getTape = function (): Record[] {
    return cacheTape
  }

  wrappedFn.setTape = function (newTape): void {
    cacheTape = newTape
  }

  // Mode
  wrappedFn.getMode = function (): Mode {
    return mode
  }

  wrappedFn.setMode = function (newMode: Mode): void {
    mode = newMode
  }

  // run log
  wrappedFn.startRun = function (): void {
    runLog = []
    hasRun = true
  }

  wrappedFn.stopRun = function (): void {
    hasRun = false
  }

  wrappedFn.getRunData = function (): Record[] {
    return runLog
  }

  return wrappedFn
}
