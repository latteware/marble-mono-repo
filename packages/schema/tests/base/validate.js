/* global describe, expect, it */
const Schema = require('../../index')
const { types } = Schema

const idSchema = new Schema({
  productId: types.number
})

describe('Validate', function () {
  it('Should return no errors', async function () {
    const error = idSchema.validate({
      productId: 3
    })

    expect(error).to.equal(undefined)
  })

  it('Should return error not a number', async function () {
    const error = idSchema.validate({
      productId: 'foo'
    })

    expect(error).to.not.equal(undefined)
    const err = error.details[0]
    expect(err.message).to.equal('"productId" must be a number')
  })
})

describe('isValid', function () {
  it('Should return isValid true', async function () {
    const isValid = idSchema.isValid({
      productId: 3
    })

    expect(isValid).to.equal(true)
  })

  it('Should return isValid false', async function () {
    const isValid = idSchema.isValid({
      productId: 'foo'
    })

    expect(isValid).to.equal(false)
  })
})

describe('Optionals', function () {
  it('Should return isValid true both cases', async function () {
    const getSchema = new Schema({
      uuid: types.string
    })

    const hasUuid = getSchema.isValid({ uuid: 'foo' })
    const hadntUuid = getSchema.isValid({})

    expect(hasUuid).to.equal(true)
    expect(hadntUuid).to.equal(true)
  })
})
