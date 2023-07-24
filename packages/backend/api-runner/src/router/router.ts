import _ from 'lodash'
import debug from 'debug'

const log = debug('api')

interface RouteType {
  _isRoute: boolean
  _isRouter: boolean
  prefix: string
  name: string
  method: string
  path: string
  middlewares: any[]

  add: (app: any) => void
}

interface RouterType {
  _isRoute: boolean
  _isRouter: boolean
  prefix: string
  name: string
  method: string
  path: string
  middlewares: any[]

  add: (app: any) => void
  getRoutes: () => Array<RouteType | RouterType>
}

const merge = function (router: { prefix: string, middlewares: any[] }, item: RouteType): RouteType {
  const route: RouteType = _.clone(item)

  if (router.prefix !== undefined) {
    route.path = router.prefix + route.path
  }

  if (router.middlewares !== undefined) {
    route.middlewares = router.middlewares.concat(route.middlewares)
  }

  return route
}

function isRoute (item: RouteType): item is RouteType {
  return item._isRoute
}

function isRouter (item: RouterType): item is RouterType {
  return item._isRoute
}

export class Router {
  readonly _isRouter: boolean
  readonly _isRoute: boolean
  private _routes: any[]

  public options: any
  public prefix: string
  public routes: any
  public middlewares: any[]

  constructor (options: any) {
    this._isRouter = true
    this._isRoute = false

    this.options = options ?? {}

    this.prefix = this.options.prefix ?? ''
    this.routes = this.options.routes ?? []
    this.middlewares = this.options.middlewares

    this._routes = []
    this.setRoutes()
  }

  getRoutes (): Array<RouteType | RouterType> {
    return this._routes
  }

  setRoutes (): void {
    const routes: RouteType[] = []
    _.forEach(this.routes, (item: RouteType | RouterType, name: string) => {
      item.name = name
      const route = item as RouteType
      const router = item as RouterType

      if (isRoute(route)) {
        routes.push(route)
      } else if (isRouter(router)) {
        _.forEach(router.getRoutes(), (route, name) => {
          routes.push(merge(item, route))
        })
      }
    })

    this._routes = _.sortBy(routes, route => route.priority * -1)
  }

  add (app): void {
    log(`Router => ${this.prefix} ${this._routes.length}`)

    _.forEach(this._routes, (item: RouteType, name: string) => {
      item = merge({
        prefix: this.prefix,
        middlewares: this.middlewares
      }, item)
      log(`Adding route => [${item.method}]${item.path}`)

      item.add(app)
    })
  }
}
