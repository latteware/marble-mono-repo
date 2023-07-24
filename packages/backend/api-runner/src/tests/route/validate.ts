/* global describe, it */
import chai from 'chai'
import chaiHttp from 'chai-http'
import Schema from '@marble-seeds/schema'

import { server, Route, Router } from '../../index'

chai.use(chaiHttp)

const { expect, request } = chai
const { types } = Schema

describe('route validate tests', function () {
  it('/api/status should return 200', async function () {
    const srv = server()

    const schema: { value: number } = {
      value: types.number.required()
    }

    const route = new Route({
      method: 'post',
      path: '/items',
      validator: schema,
      handler: async (ctx) => {
        ctx.body = {
          success: true
        }
      }
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).post('/api/items').send({ value: 5 })

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      success: true
    })
  })

  it('/api/status should return 422', async function () {
    const srv = server()

    const schema: { value: number } = {
      value: types.number.required()
    }

    const route = new Route({
      method: 'post',
      path: '/items',
      validator: schema,
      handler: async (ctx) => {
        ctx.body = {
          success: true
        }
      }
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).post('/api/items').send({ value: 'lolz' })

    expect(res).to.have.status(422)
  })
})
