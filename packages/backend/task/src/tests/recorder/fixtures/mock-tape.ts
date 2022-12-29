export const MockTape = class {
  _log: any[]
  _boundaries: any
  _mode: string

  constructor (mockTape) {
    this._log = mockTape.log
    this._boundaries = mockTape.boundaries
  }

  getLog (): any[] {
    return this._log
  }

  getMode (): string {
    return 'proxy'
  }

  getBoundaries (): any {
    return this._boundaries
  }

  addLogItem (item: any): any[] | undefined {
    if (this._mode === 'replay') {
      return
    }

    if (
      (typeof item.input !== 'undefined' && typeof item.output !== 'undefined') ||
      (typeof item.input !== 'undefined' && typeof item.error !== 'undefined')
    ) {
      this._log.push(item)
      return this._log
    }
  }

  addBoundariesData (boundaries): any {
    this._boundaries = boundaries
  }

  recordFrom (task): void {
    task.addListener(async (logItem, boundaries) => {
      this.addLogItem(logItem)
      this.addBoundariesData(boundaries)
    })

    task.setBoundariesTapes(this._boundaries)
  }
}
