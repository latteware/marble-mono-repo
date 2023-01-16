/* global describe, it */
import { expect } from 'chai'
import { Task } from '../../index'

describe('Listener with boundaries tests', function () {
  it('Should be record one item and its boundaries tape', async function () {
    const tape: any[] = []

    const task = new Task(async (argv, boundaries) => {
      const externalData = await boundaries.fetchExternalData()

      return { ...externalData, ...argv }
    }, {
      boundaries: {
        fetchExternalData: async () => {
          return { foo: false }
        }
      }
    })

    task.addListener((record) => {
      tape.push(record)
    })

    await task.run({ value: 5 })

    expect(tape.length).to.equal(1)
    expect(tape[0].input).to.deep.equal({ value: 5 })
    expect(tape[0].output).to.deep.equal({ value: 5, foo: false })
    expect(tape[0].boundaries).to.deep.equal({
      fetchExternalData: [
        { input: [], output: { foo: false } }
      ]
    })
  })

  it('Should be record multiple item and its boundaries tape', async function () {
    const tape: any[] = []

    const task = new Task(async (argv, boundaries) => {
      const externalData = await boundaries.fetchExternalData()

      return { ...externalData, ...argv }
    }, {
      boundaries: {
        fetchExternalData: async () => {
          return { foo: false }
        }
      }
    })

    task.addListener((record, newBoundariesTape) => {
      tape.push(record)
    })

    await task.run({ value: 5 })
    await task.run({ value: 6 })

    expect(tape.length).to.equal(2)

    expect(tape[0].input).to.deep.equal({ value: 5 })
    expect(tape[0].output).to.deep.equal({ value: 5, foo: false })
    expect(tape[0].boundaries).to.deep.equal({
      fetchExternalData: [
        { input: [], output: { foo: false } }
      ]
    })

    expect(tape[1].input).to.deep.equal({ value: 6 })
    expect(tape[1].output).to.deep.equal({ value: 6, foo: false })
    expect(tape[1].boundaries).to.deep.equal({
      fetchExternalData: [
        { input: [], output: { foo: false } }
      ]
    })
  })

  it('Should be record error and its boundaries tape', async function () {
    const tape: any[] = []

    const task = new Task(async (argv: any, boundaries) => {
      const externalData = await boundaries.fetchExternalData()
      if (typeof argv.value === 'undefined') {
        throw new Error('Value is required')
      }

      return { ...externalData, ...argv }
    }, {
      boundaries: {
        fetchExternalData: async () => {
          return { foo: false }
        }
      }
    })

    task.addListener((record) => {
      tape.push(record)
    })

    try {
      await task.run({})
    } catch (e) {}

    expect(tape.length).to.equal(1)
    expect(tape[0].input).to.deep.equal({})
    expect(tape[0].error).to.deep.equal('Value is required')
    expect(tape[0].boundaries).to.deep.equal({
      fetchExternalData: [
        { input: [], output: { foo: false } }
      ]
    })
  })

  it('Should be record error + success and its boundaries tape', async function () {
    const tape: any[] = []

    const task = new Task(async (argv, boundaries) => {
      const externalData = await boundaries.fetchExternalData()
      if (typeof argv.value === 'undefined') {
        throw new Error('Value is required')
      }

      return { ...externalData, ...argv }
    }, {
      boundaries: {
        fetchExternalData: async () => {
          return { foo: false }
        }
      }
    })

    task.addListener((record) => {
      tape.push(record)
    })

    try {
      await task.run({})
    } catch (e) {}
    await task.run({ value: 5 })

    expect(tape.length).to.equal(2)
    expect(tape[0].input).to.deep.equal({})
    expect(tape[0].error).to.deep.equal('Value is required')
    expect(tape[0].boundaries).to.deep.equal({
      fetchExternalData: [
        { input: [], output: { foo: false } }
      ]
    })

    expect(tape[1].input).to.deep.equal({ value: 5 })
    expect(tape[1].output).to.deep.equal({ value: 5, foo: false })
    expect(tape[1].boundaries).to.deep.equal({
      fetchExternalData: [
        { input: [], output: { foo: false } }
      ]
    })
  })

  it('Should be record 2 run logs if boundary called twice', async function () {
    const tape: any[] = []

    const task = new Task(async (argv, boundaries) => {
      await boundaries.fetchExternalData()
      await boundaries.fetchExternalData()

      return { foo: true }
    }, {
      boundaries: {
        fetchExternalData: async () => {
          return { foo: false }
        }
      }
    })

    task.addListener((record) => {
      tape.push(record)
    })

    await task.run({ value: 5 })

    expect(tape.length).to.equal(1)
    expect(tape[0].input).to.deep.equal({ value: 5 })
    expect(tape[0].output).to.deep.equal({ foo: true })
    expect(tape[0].boundaries).to.deep.equal({
      fetchExternalData: [
        { input: [], output: { foo: false } },
        { input: [], output: { foo: false } }
      ]
    })
  })

  it('Should be record 2 boundary logs', async function () {
    const tape: any[] = []

    const task = new Task(async (argv: { value: number }, boundaries) => {
      let counter = argv.value

      counter = await boundaries.add(counter)
      counter = await boundaries.subtract(counter)
      counter = await boundaries.subtract(counter)

      return counter
    }, {
      boundaries: {
        add: async (value: number): Promise<number> => {
          return value + 1
        },
        subtract: async (value: number): Promise<number> => {
          return value - 1
        }
      }
    })

    task.addListener((record) => {
      tape.push(record)
    })

    await task.run({ value: 5 })

    expect(tape.length).to.equal(1)
    expect(tape[0].input).to.deep.equal({ value: 5 })
    expect(tape[0].output).to.deep.equal(4)
    expect(tape[0].boundaries).to.deep.equal({
      add: [
        { input: [5], output: 6 }
      ],
      subtract: [
        { input: [6], output: 5 },
        { input: [5], output: 4 }
      ]
    })
  })
})
