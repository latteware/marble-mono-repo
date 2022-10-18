const Joi = require('joi')

const Schema = class {
  constructor (properties) {
    const schema = Joi.object(properties)
    this._schema = schema
  }

  setSchema (schema) {
    this._schema = schema
  }

  toString () {
    const description = this._schema.describe()

    return JSON.stringify(description.keys)
  }

  validate (data) {
    const isValid = this._schema.validate(data)

    return isValid.error
  }

  isValid (data) {
    const isValid = this._schema.validate(data)

    return isValid.error === undefined
  }
}

Schema.fromString = function (seed) {
  const base = Joi.build(JSON.parse(`{"type":"object","keys":${seed}}`))

  const schema = new Schema()
  schema.setSchema(base)

  return schema
}

Schema.types = Joi.types()

module.exports = Schema
