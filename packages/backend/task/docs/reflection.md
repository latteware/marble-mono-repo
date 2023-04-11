Wrap example that allows reflection

```js
Wrap example from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

Typescript has 2 hidden type utils 2 extract the params and return types from a funcion passsed as an argument
- Parameters
- ReturnType

Example

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
