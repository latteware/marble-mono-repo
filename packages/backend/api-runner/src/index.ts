import Koa from 'koa'
import logger from 'koa-logger'
import cors from'@koa/cors'
import removeTrailingSlashes from 'koa-remove-trailing-slashes'

import middlewares from './middlewares'

interface Config {
  env?: string
}

export const server = function (config: Config = {}) {
  const app = new Koa()

  if (config.env !== 'test') {
    app.use(logger())
  }

  app.use(cors())
  app.use(removeTrailingSlashes())
  app.use(middlewares.sanitizeBody)
  app.use(middlewares.errorHandler)

  return app
}
