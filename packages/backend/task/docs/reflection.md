
To allow Task and boundaries to carry stiles we need to use `Parameters` and `ReturnType` to get the fn items.

Took a long deep dive into Typescript to allow to reflect args and return to have the currect type.

https://www.typescriptlang.org/docs/handbook/utility-types.html

Wrap example that allows reflection from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

```ts
type AnyFunction = (...args: any[]) => any

const wrap = <Func extends AnyFunction>(
  fn: Func
): ((...args: Parameters<Func>) => ReturnType<Func>) => {
  const wrappedFn = (...args: Parameters<Func>): ReturnType<Func> => {
    return fn(...args)
  }

  return wrappedFn
}
```

Originaly created a simple test file to recreate the boundaries

```ts
import { expect } from 'chai'
// ========================================
// Create Boundary implementation
// ========================================

type BaseBoundary = (...args: any[]) => any

const createPromise = <Func extends BaseBoundary>(fn: Func): {
  run: (...args: Parameters<Func>) => Promise<ReturnType<Func>>
  getRunLog: () => Array<{
    input: Parameters<Func>
    output?: any
    error?: string
  }>
  clearLog: () => void
} => {
  interface Record {
    input: Parameters<Func>
    output?: any
    error?: string
  }

  let runLog: Record[] = []

  return {
    run: async function (...args: Parameters<Func>): Promise<ReturnType<Func>> {
      console.log('Calle argv =>', ...args)

      const record: Record = {
        input: args
      }

      const q = fn(...args)

      console.log('invoked type =>', typeof q, record.input)
      // async use case
      if (typeof q === 'object' && typeof q.then === 'function') {
        q.then((result) => {
          record.output = result
          runLog.push(record)

          console.log('async result =>', result, runLog)
        })

      // sync use case
      } else {
        console.log('sync result =>', q)
      }

      return q
    },
    getRunLog: function (): Record[] {
      return runLog
    },
    clearLog: function (): void {
      runLog = []
    }
  }
}

// ========================================
// Test the implementation
// ========================================

interface Sample {
  name: string
  code: number
}

async function sleep (ms: number): Promise<void> {
  await (new Promise(resolve => setTimeout(resolve, ms)))
}

describe.skip('Run sync boundary tests', function () {
  it('Boundary types???', async function () {
    const identity = createPromise(function (argv: Sample): string {
      return argv.name
    })

    const data = await identity.run({
      name: 'intro',
      code: 6
    })

    expect(data).to.equal('intro')
  })
})

describe.skip('Run async boundary tests', function () {
  it('Boundary simple base run', async function () {
    const identity = createPromise(async function (argv: Sample): Promise<number> {
      await sleep(50)

      return argv.name.length + argv.code
    })

    const data = await identity.run({
      name: 'intro',
      code: 6
    })

    expect(data).to.equal(11)
  })

  it('Boundary simple base run', async function () {
    const identity = createPromise(async function (argv: Sample): Promise<number> {
      await sleep(50)

      return argv.name.length + argv.code
    })

    await identity.run({
      name: 'intro',
      code: 6
    })

    await identity.run({
      name: 'intro',
      code: 6
    })

    const runLog = identity.getRunLog()

    expect(runLog.length).to.equal(2)
  })

  it('Boundary clear log', async function () {
    const identity = createPromise(async function (argv: Sample, timeout: number): Promise<number> {
      await sleep(50)

      return argv.name.length + argv.code
    })

    await identity.run({
      name: 'intro',
      code: 6
    }, 10)

    identity.clearLog()

    await identity.run({
      name: 'intro',
      code: 6
    }, 10)

    const runLog = identity.getRunLog()

    expect(runLog.length).to.equal(1)
    expect(runLog[0].input).to.deep.equal([
      {
        name: 'intro',
        code: 6
      },
      10
    ])
  })
})
```

Then needed to create some dummy class code to learn how to get Types from a constructor into a function fo the class and learned a little about from https://www.tutorialsteacher.com/typescript/typescript-generic-class

```ts
type BaseFunction = (...args: any[]) => any

class Task<Func extends BaseFunction> {
  readonly _fn: Func

  constructor (fn: Func) {
    this._fn = fn
  }

  async run (...args: Parameters<Func>): Promise<ReturnType<Func>> {
    const wrappedFn = async (...args: Parameters<Func>): Promise<ReturnType<Func>> => {
      return this._fn(args)
    }

    const q = await wrappedFn(...args)

    return q
  }
}
```
