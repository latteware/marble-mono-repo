/* global describe, it */
import chai from 'chai'
import chaiHttp from 'chai-http'

import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'

import { server, Route, Router } from '../../index'

const { types } = Schema

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

  it('/api/:uuid should return 200 for box', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid }: { uuid: string }) => {
      return {
        uuid
      }
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get(`/api/${testUuid}`)

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      uuid: testUuid
    })
  })

  it('/api/:uuid should return 200 with validator', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid }: { uuid: string }) => {
      return {
        uuid
      }
    })

    task.setSchema({
      uuid: types.string.required()
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get(`/api/${testUuid}`)

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      uuid: testUuid
    })
  })
})

describe('route plug get params', function () {
  it('/api/:uuid should return 200 with query', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid, query }: { uuid: string, query: string }) => {
      // Get uuid from url and query from query params
      return {
        uuid,
        query
      }
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get(`/api/${testUuid}?query=here`)

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      uuid: testUuid,
      query: 'here'
    })
  })

  it('Validator on /api/:uuid should return 200 with query', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid, query }: { uuid: string, query: string }) => {
      // Get uuid from url and query from query params
      return {
        uuid,
        query
      }
    })

    task.setSchema({
      uuid: types.string.required(),
      query: types.string
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get(`/api/${testUuid}?query=here`)

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      uuid: testUuid,
      query: 'here'
    })
  })

  it('Validator on /api/:uuid should return 200 without query', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid, query }: { uuid: string, query: string }) => {
      // Get uuid from url and query from query params
      return {
        uuid,
        query: query ?? ''
      }
    })

    task.setSchema({
      uuid: types.string.required(),
      query: types.string
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get(`/api/${testUuid}`)

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      uuid: testUuid,
      query: ''
    })
  })

  it('Validator on /api/:uuid should return 422 if required', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid, query }: { uuid: string, query: string }) => {
      // Get uuid from url and flag from post body
      return {
        uuid,
        query
      }
    })

    task.setSchema({
      uuid: types.string.required(),
      query: types.string.required()
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get(`/api/${testUuid}`)

    expect(res).to.have.status(422)
    expect(res.body.message).to.equal('"query" is required')
  })
})

describe('route plug body params', function () {
  it('/api/:uuid should return 200 with flag', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid, flag }: { uuid: string, flag: boolean }) => {
      // Get uuid from url and flag from post body
      return {
        uuid,
        flag
      }
    })

    const route = Route.plugTask({
      box: task,
      method: 'post',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).post(`/api/${testUuid}`).send({ flag: true })

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      uuid: testUuid,
      flag: true
    })
  })

  it('Validator on /api/:uuid should return 200 with flag', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid, flag }: { uuid: string, flag: boolean }) => {
      // Get uuid from url and flag from post body
      return {
        uuid,
        flag
      }
    })

    task.setSchema({
      uuid: types.string.required(),
      flag: types.boolean.required()
    })

    const route = Route.plugTask({
      box: task,
      method: 'post',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).post(`/api/${testUuid}`).send({ flag: true })

    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      uuid: testUuid,
      flag: true
    })
  })

  it('Validator on /api/:uuid should return 422', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid, flag }: { uuid: string, flag: boolean }) => {
      // Get uuid from url and flag from post body
      return {
        uuid,
        flag
      }
    })

    task.setSchema({
      uuid: types.string.required(),
      flag: types.boolean.required()
    })

    const route = Route.plugTask({
      box: task,
      method: 'post',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).post(`/api/${testUuid}`)

    expect(res).to.have.status(422)
    expect(res.body.message).to.equal('"flag" is required')
  })
})

describe('route plug errors tests', function () {
  it('/api/:uuid should return 404 on error "Not found"', async function () {
    const srv = server()

    const testUuid = 'foo'

    const task = new Task(({ uuid }: { uuid: string }) => {
      throw new Error('Not found')
    })

    task.setSchema({
      uuid: types.string.required()
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get(`/api/${testUuid}`)

    expect(res).to.have.status(404)
  })

  it('/api/:uuid should return 422 on validator error', async function () {
    const srv = server()

    const task = new Task(({ uuid }: { uuid: string }) => {
      throw new Error('Not found')
    })

    task.setSchema({
      notHere: types.string.required()
    })

    const route = Route.plugTask({
      box: task,
      method: 'get',
      path: '/:uuid'
    })

    const routers = new Router({
      routes: [route],
      prefix: '/api'
    })

    routers.add(srv)
    const app = srv.listen()

    const res = await request(app).get('/api/not-here-test')

    expect(res).to.have.status(422)
    expect(res.body.message).to.equal('"notHere" is required')
  })
})
