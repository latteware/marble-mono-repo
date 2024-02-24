import Koa from 'koa'
import logger from 'koa-logger'
import cors from '@koa/cors'
import removeTrailingSlashes from 'koa-remove-trailing-slashes'

import middlewares from './middlewares'
import router from './router'

interface Config {
  env?: string
}

export const server = function (config: Config = {}): any {
  const app = new Koa()

  if (config.env !== 'test') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    app.use(logger())
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.use(cors())
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.use(removeTrailingSlashes())
  app.use(middlewares.sanitizeBody)
  app.use(middlewares.errorHandler)

  return app
}

export const Route = router.Route
export const Router = router.Router
export const QueryParams = router.QueryParams

export {
  middlewares
}
