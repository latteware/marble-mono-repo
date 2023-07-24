import lov from 'lov'
import _ from 'lodash'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

export interface RouteType {
  _isRoute: boolean
  _isRouter: boolean
  prefix: string
  name: string
  method: string
  path: string
  middlewares: any[]

  add: (app: any) => void
}

export class Route {
  readonly _isRoute: boolean
  readonly _isRouter: boolean
  readonly prefix: string

  public options: any
  public name: string
  public path: string
  public method: string
  public priority: number
  public bodySize: string

  public validator: any
  public handler: any

  public middlewares: any[]

  static plugTask: ({ method, path, box }: { method: any, path: any, box: any }) => RouteType

  constructor (options: any) {
    this._isRoute = true
    this.options = options ?? {}

    this.method = this.options.method ?? 'get'
    this.path = this.options.path
    this.validator = this.options.validator
    this.handler = this.options.handler
    this.priority = this.options.priority ?? 1
    this.middlewares = this.options.middlewares ?? []
    this.bodySize = this.options.bodySize ?? '1mb'
  }

  add (app: any): void {
    const method = this.method
    const path = this.path
    const validator = this.validator
    const handler = this.handler

    const rtr = new Router()

    rtr.use(bodyParser({
      strict: false,
      formLimit: this.bodySize,
      jsonLimit: this.bodySize
    }))

    // Add route base data
    rtr.use(async function (ctx, next) {
      ctx.route = {
        method,
        path
      }

      await next()
    })

    _.forEach(this.middlewares, mdw => {
      rtr.use(mdw)
    })

    rtr[method](path.replace(/\/$/, ''), async function (ctx) {
      if (validator !== undefined) {
        let validate = ctx.request.body
        if (method === 'get') {
          validate = ctx.request.query
        }
        const result = lov.validate(validate, validator)

        if (result.error !== undefined) {
          return ctx.throw(422, result.error.message)
        }
      }

      await handler(ctx)
    })

    app.use(rtr.routes())
  }
}

Route.plugTask = function ({ method, path, box }) {
  return new Route({
    method,
    path,
    validator: box.getSchema(),
    handler: async (ctx) => {
      let argv = ctx.body
      if (method === 'get') {
        argv = ctx.request.query
      }

      let result, error
      try {
        result = await box.run(argv)
      } catch (e) {
        error = e
      }

      if (error !== undefined) {
        return ctx.throw(422, error.message)
      }

      ctx.body = result
    }
  })
}
