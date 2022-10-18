/* global describe, expect, it */
const Schema = require('../../index')
const { types } = Schema

const idSchema = new Schema({
  id: types.string.required()
})

describe('Errors', function () {
  it('Should return error for id', async function () {
    const error = idSchema.validate({
      id: 5
    })

    expect(error).to.not.equal(undefined)
    expect(error.message).to.equal('"id" must be a string')
  })
})
