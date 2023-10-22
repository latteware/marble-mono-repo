import debug from 'debug'

const log = debug('api')

interface RouteType {
  priority: number
  _isRoute: boolean
  _isRouter: boolean
  prefix: string
  name: string
  method: string
  path: string
  middlewares: any[]

  add: (app: any) => void
  clone: () => RouteType
}

interface RouterType {
  _isRoute: boolean
  _isRouter: boolean
  priority: number
  prefix: string
  name: string
  method: string
  path: string
  middlewares: any[]

  add: (app: any) => void
  clone: () => RouteType
  getRoutes: () => Array<RouteType | RouterType>
}

const merge = function (router: { prefix: string, middlewares: any[] }, item: RouteType): RouteType {
  const route: RouteType = item.clone()

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
    this.routes.forEach((item: RouteType | RouterType, name: string) => {
      item.name = name
      const route = item as RouteType
      const router = item as RouterType

      if (isRoute(route)) {
        routes.push(route)
      } else if (isRouter(router)) {
        router.getRoutes().forEach(route => {
          return routes.push(merge(item, route))
        })
      }
    })

    this._routes = routes.sort((a, b) => (b.priority - a.priority))
  }

  add (app): void {
    log(`Router => ${this.prefix} ${this._routes.length}`)

    this._routes.forEach((item: RouteType) => {
      item = merge({
        prefix: this.prefix,
        middlewares: this.middlewares
      }, item)
      log(`Adding route => [${item.method}]${item.path}`)

      item.add(app)
    })
  }
}
