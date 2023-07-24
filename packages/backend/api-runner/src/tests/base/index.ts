/* global describe, it */
import chai from 'chai'
import chaiHttp from 'chai-http'

// import { server, Router, Route } from '../../index'
import { server } from '../../index'

chai.use(chaiHttp)

const { expect, request } = chai

describe('server base tests', function () {
  it('Empty test should return 404', async function () {
    const srv = server()
    const app = srv.listen()

    const res = await request(app).get('/')

    expect(res).to.have.status(404)
  })

  it.skip('/api/status should return 200', async function () {
    const srv = server()

    // const route = new Route({
    //   method: 'get',
    //   path: '/status',
    //   handler: async (ctx) => {
    //     ctx.body = {
    //       success: true
    //     }
    //   }
    // })

    // const routers = new Router({
    //   routes: [route],
    //   prefix: '/api'
    // })

    // routers.add(srv)
    // const app = srv.listen()

    // const res = await request(app).get('/api/status')

    // expect(res).to.have.status(200)
    // expect(res.body).to.deep.equal({
    //   success: true
    // })
  })
})

