/* global describe, it */
import * as path from 'path'
import { expect } from 'chai'
import { RecordTape } from '../../index'

const simpleTapePath = path.resolve(__dirname, '../fixtures/single-cache')
const complexTapePath = path.resolve(__dirname, '../fixtures/complex-cache')

describe('Cache tests', function () {
  it('Should create cache object from log', function () {
    const tape = new RecordTape({ path: simpleTapePath })
    tape.loadSync()

    const cache = tape.compileCache()

    expect(cache).to.deep.equal({
      getFilePath: [
        { input: ['doc'], output: 'readme.md' },
        { input: ['package'], output: 'package.json' }
      ]
    })
  })

  it.skip('Should create cache object with multiple boundaties', function () {
    const tape = new RecordTape({ path: complexTapePath })
    tape.loadSync()

    const cache = tape.compileCache()

    expect(cache).to.deep.equal({
      getFilePath: [
        { input: ['doc'], output: 'readme.md' },
        { input: ['package'], output: 'package.json' }
      ]
    })
  })
})
