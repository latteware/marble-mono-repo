import { server, Route, Router } from '@marble-seeds/api'

import { fetchJSON } from './tasks/fetch-json'

const srv = server()

const routers = new Router({
  routes: [
    Route.plugTask({
      box: fetchJSON,
      method: 'get',
      path: '/'
    })
  ],
  prefix: '/status'
})

routers.add(srv)

srv.listen({
  port: 8080
}, function () {
  console.log('running on port 8080')
})
