/* global describe, before, it */
import Schema = require('@marble-seeds/schema')
import { expect } from 'chai'
import { Task } from '../../index'

const { types } = Schema

describe('Validation tests', function () {
  let task
  before(() => {
    const schema: { value: number } = {
      value: types.number.required()
    }

    task = new Task(function (argv) {
      return argv
    })

    task.setSchema(schema)
  })

  it('Should be invalid', function () {
    const error = task.validate({ value: null })

    expect(error).to.not.equal(null)
  })

  it('Should be valid', function () {
    const isValid = task.validate({ value: 5 })

    expect(isValid).to.equal(undefined)
  })

  it('Should validate data as past of run funcion', async function () {
    let error
    try {
      await task.run({ value: null })
    } catch (e) {
      error = e
    }

    expect(error.message).to.equal('"value" must be a number')
  })

  it('Should work well', async function () {
    const result = await task.run({ value: 5 })

    expect(result.value).to.equal(5)
  })
})

describe('Validation tests on param', function () {
  let task
  before(() => {
    const schema = {
      value: types.number.required()
    }

    task = new Task(function (argv) {
      return argv
    }, {
      validate: schema
    })
  })

  it('Should be invalid', function () {
    const error = task.validate({ value: null })

    expect(error).to.not.equal(null)
  })

  it('Should be valid', function () {
    const isValid = task.validate({ value: 5 })

    expect(isValid).to.equal(undefined)
  })

  it('Should validate data as past of run funcion', async function () {
    let error
    try {
      await task.run({ value: null })
    } catch (e) {
      error = e
    }

    expect(error.message).to.equal('"value" must be a number')
  })

  it('Should work well', async function () {
    const result = await task.run({ value: 5 })

    expect(result.value).to.equal(5)
  })
})

describe('Validation multiple values tests', function () {
  let task
  before(() => {
    const schema = {
      value: types.number.required(),
      increment: types.number.required()
    }

    task = new Task(function (argv) {
      return argv
    })

    task.setSchema(schema)
  })

  it('Should be on both invalid but fail in first', async function () {
    let error
    try {
      await task.run({ value: null })
    } catch (e) {
      error = e
    }

    expect(error.message).to.equal('"value" must be a number')
  })

  it('Should be on both invalid but fail in increment', async function () {
    let error
    try {
      await task.run({ value: 5 })
    } catch (e) {
      error = e
    }

    expect(error.message).to.equal('"increment" is required')
  })

  it('Should work well', async function () {
    const result = await task.run({ value: 5, increment: 1 })

    expect(result.value).to.equal(5)
    expect(result.increment).to.equal(1)
  })
})

describe('Get Schema', function () {
  it('Object as string', async function () {
    const add2 = new Task(function (int: number) {
      return int + 2
    }, {
      validate: {
        value: types.number.required()
      }
    })

    const schema = add2.getSchema()
    const seed = schema.toString()

    expect(seed).to.equal('{"value":{"type":"number","flags":{"presence":"required"}}}')
  })

  it('Empty object as string', async function () {
    const add2 = new Task(function (int: number) {
      return int + 2
    }, {})

    const schema = add2.getSchema()

    expect(schema).to.equal(undefined)
  })
})
