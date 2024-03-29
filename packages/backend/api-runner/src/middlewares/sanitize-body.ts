import traverse from 'traverse'

function tvs (obj: any): any {
  if (!(obj instanceof Object)) {
    return obj
  }

  return traverse(obj).map(function (x) {
    if (typeof this.key === 'string' && this.key !== this.key.replace(/\./g, '')) {
      const key = this.key

      this.key = this.key.replace(/\./g, '')
      this.update(x)

      this.key = key
      this.delete()
    }

    // TODO: find better way to return in the function for standardjs
    return []
  })
}

export default async function (ctx, next): Promise<void> {
  const headers = ctx.request.headers
  let body = ctx.request.body

  if (headers['content-type'] !== undefined && headers['content-type'] === 'application/json') {
    body = tvs(ctx.request.body)
  }

  ctx.request.body = body

  await next()
}
