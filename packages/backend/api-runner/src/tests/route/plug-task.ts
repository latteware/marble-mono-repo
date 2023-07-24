/* global describe, it */
import chai from 'chai'
import chaiHttp from 'chai-http'

import { Task } from '@marble-seeds/task'

import { server, Route, Router } from '../../index'

chai.use(chaiHttp)

const { expect, request } = chai

describe('route plug tests', function () {
  it('/api/status should return 200 for box', async function () {
    const srv = server()

    const task = new Task(() => {
      return {
        success: true
      }
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/status'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get('/api/status')

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      success: true
    })
  })
})
