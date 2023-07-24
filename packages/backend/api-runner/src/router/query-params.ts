export const QueryParams = class {
  readonly _filters: any

  constructor () {
    this._filters = {}
  }

  addFilter (name: string, fn): void {
    this._filters[name] = fn
  }

  async toFilters (query, ctx): Promise<any> {
    const filters: any = {}

    for (const param in query) {
      if (param === 'limit' || param === 'start' || param === 'sort') {
        continue
      }

      const filter = this._filters[param]

      // if param was added with addFilter it uses it as a modifier
      // if param wasn't added with addFilter, sets the defalt value
      if (filter !== undefined) {
        await filter(filters, query[param], ctx)
      } else {
        if (!isNaN(parseInt(query[filter]))) {
          filters[param] = parseInt(query[param])
        } else {
          filters[param] = query[param]
        }
      }
    }

    return filters
  }
}
