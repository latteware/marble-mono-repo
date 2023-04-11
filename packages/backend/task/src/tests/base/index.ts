/* global describe, it */
import { expect } from 'chai'
import { Task } from '../../index'

describe('Base test', function () {
  it('Indentity test', async function () {
    const indentity = new Task(function (argv) {
      return argv
    })

    const { bar } = await indentity.run({ bar: true })
    const { foo } = await indentity.run({ foo: true })

    expect(bar).to.equal(true)
    expect(foo).to.equal(true)
  })

  it('Indentity typestest', async function () {
    interface Indentity {
      bar?: boolean
      foo?: boolean
    }
    const calle = async function (argv: Indentity): Promise<Indentity> {
      return argv
    }

    const indentity = new Task(calle)

    const { bar } = await indentity.run({ bar: true })
    const { foo } = await indentity.run({ foo: true })

    expect(bar).to.equal(true)
    expect(foo).to.equal(true)
  })

  it('Add test', async function () {
    const add2 = new Task(function (int: number) {
      return int + 2
    })

    const six = await add2.run(4)
    const seven = await add2.run(5)

    expect(six).to.equal(6)
    expect(seven).to.equal(7)
  })

  it('getMode proxy test', async function () {
    const proxy = new Task(function (int: number) {
      return int + 2
    }, {
      mode: 'proxy'
    })

    const proxyPass = new Task(function (int: number) {
      return int + 2
    }, {
      mode: 'proxy-pass'
    })

    expect(proxy.getMode()).to.equal('proxy')
    expect(proxyPass.getMode()).to.equal('proxy-pass')
  })
})
