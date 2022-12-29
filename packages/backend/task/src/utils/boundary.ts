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

export const createBoundery = function (fn): Boundary {
  let tape: any[] = []
  let mode = 'proxy'

  // const action = async (...argv: any[]): Promise<any> => {
  //   const record: Record = {
  //     input: argv
  //   }

  //   if (mode === 'proxy-pass') {
  //     const record = findRecord(argv, tape)

  //     if (typeof record !== 'undefined') {
  //       return await (async () => {
  //         return record.output
  //       })()
  //     }
  //   }

  //   if (mode === 'replay') {
  //     return await (async () => {
  //       const record = findRecord(argv, tape)

  //       if (typeof record === 'undefined') {
  //         throw new Error('No tape value for this inputs')
  //       }

  //       if (typeof record.error !== 'undefined') {
  //         throw new Error(record.error)
  //       }

  //       return record.output
  //     })()
  //   }

  //   return await (async () => {
  //     let result, error
  //     try {
  //       result = await fn(...argv)
  //     } catch (e) {
  //       error = e
  //     }

  //     if (typeof error !== 'undefined') {
  //       const prevRecord: Record = findRecord(argv, tape)
  //       if (mode === 'proxy-catch' && typeof prevRecord !== 'undefined') {
  //         return await (async () => {
  //           return prevRecord.output
  //         })()
  //       } else {
  //         record.error = error.message
  //         tape.push(record)

  //         throw error
  //       }
  //     } else {
  //       record.output = result
  //       tape.push(record)

  //       return result
  //     }
  //   })()
  // }

  // action.getTape = function () {
  //   return tape
  // }

  // action.setTape = function (newTape) {
  //   tape = newTape
  // }

  // action.getMode = function (newMode) {
  //   return mode
  // }

  // action.setMode = function (newMode) {
  //   mode = newMode
  // }

  const q = async (...argv): Promise<any> => {
    const record: Record = {
      input: argv
    }

    if (mode === 'proxy-pass') {
      const record = findRecord(argv, tape)

      if (typeof record !== 'undefined') {
        return await (async () => {
          return record.output
        })()
      }
    }

    if (mode === 'replay') {
      return await (async () => {
        const record = findRecord(argv, tape)

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
        const prevRecord: Record = findRecord(argv, tape)
        if (mode === 'proxy-catch' && typeof prevRecord !== 'undefined') {
          return await (async () => {
            return prevRecord.output
          })()
        } else {
          record.error = error.message
          tape.push(record)

          throw error
        }
      } else {
        record.output = result
        tape.push(record)

        return result
      }
    })()
  }

  q.getTape = function () {
    return tape
  }

  q.setTape = function (newTape) {
    tape = newTape
  }

  q.getMode = function (newMode) {
    return mode
  }

  q.setMode = function (newMode) {
    mode = newMode
  }

  return q
}
