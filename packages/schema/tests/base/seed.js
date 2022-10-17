/* global describe, expect, it */
const Schema = require('../../index')
const { types } = Schema

const idSchema = new Schema({
  id: types.string
})

const userSchema = new Schema({
  id: types.string.uuid().required(),
  email: types.string.email().required(),
  password: types.string.pattern(/^[a-zA-Z0-9]{3,30}$/).required()
})

const idSeed = '{"id":{"type":"string"}}'
const userSeed = '{"id":{"type":"string","flags":{"presence":"required"},"rules":[{"name":"guid"}]},"email":{"type":"string","flags":{"presence":"required"},"rules":[{"name":"email"}]},"password":{"type":"string","flags":{"presence":"required"},"rules":[{"name":"pattern","args":{"regex":"/^[a-zA-Z0-9]{3,30}$/"}}]}}'

describe('To string', function () {
  it('Should return seed', async function () {
    const str = idSchema.toString()

    expect(str).to.equal(idSeed)
  })

  it('Should return seed', async function () {
    const str = userSchema.toString()

    expect(str).to.equal(userSeed)
  })
})

describe('From string', function () {
  it('Should return no errors', async function () {
    const schema = Schema.fromString(idSeed)

    const error = schema.validate({
      id: 'foo'
    })

    expect(error).to.equal(undefined)
  })

  it('Should return error not a int', async function () {
    const schema = Schema.fromString(idSeed)

    const error = schema.validate({
      id: 5
    })

    expect(error).to.not.equal(undefined)
    expect(error.message).to.equal('"id" must be a string')
  })

  it('Should return no errors for user schema', async function () {
    const schema = Schema.fromString(userSeed)

    const error = schema.validate({
      id: '5ae7dc2f-8a26-4d13-b125-be59b8b0b2f5',
      email: 'foo@gmail.com',
      password: 'password'
    })

    expect(error).to.equal(undefined)
  })

  it('Should return no errors for user schema', async function () {
    const schema = Schema.fromString(userSeed)

    const error = schema.validate({
      id: '5ae7dc2f-8a26-4d13-b125-be59b8b0b2f5'
    })

    expect(error).to.not.equal(undefined)
    expect(error.message).to.equal('"email" is required')
  })
})
