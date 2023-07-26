import parseArgs from 'minimist'
import fs from 'fs'
import path from 'path'

import { RecordTape } from '@marble-seeds/record-tape'

const fsPromises = fs.promises

interface Props { [key: string]: any }

export const TaskRunner = class TaskRunner {
  public _folderPath: fs.PathLike | null
  public _tasks: {
    [key: string]: {
      task: any
      tape?: any
    }
  }

  static getArgs (): { action: string, taskName: string, args: Props } {
    const argv: any = parseArgs(process.argv.slice(2))
    const action: string = argv._[0]

    if (action === undefined) {
      throw new Error('No action defined')
    }

    const taskName = argv.task

    const newObj: Props = { ...argv }

    delete newObj._
    delete newObj.task

    return { action, taskName, args: newObj }
  }

  constructor () {
    this._tasks = {}
    this._folderPath = null
  }

  setTapeFolderSync (folderName: fs.PathLike): void {
    try {
      fs.accessSync(folderName)
    } catch (error) {
      throw new Error('Folder doesn\'t exists')
    }

    this._folderPath = folderName
  }

  async setTapeFolder (folderName: fs.PathLike): Promise<fs.PathLike> {
    try {
      await fsPromises.access(folderName)
    } catch (error) {
      throw new Error('Folder doesn\'t exists')
    }

    this._folderPath = folderName

    return folderName
  }

  load (name: string, task: any): void {
    this._tasks[name] = { task }

    if (this._folderPath !== null) {
      const tapePath = this._folderPath as string + '/' + name
      const tape = new RecordTape({
        path: tapePath
      })
      tape.loadSync()

      tape.recordFrom('test', task)
      task.tape = tape
      this._tasks[name].tape = tape
    }
  }

  getTask (name: string): any | undefined {
    const { task } = this._tasks[name]

    return task
  }

  getTaskList (): string[] {
    return Object.keys(this._tasks)
  }

  async run (name: string, args: any): Promise<any> {
    const exists = this._tasks[name]

    if (exists === undefined) {
      throw new Error(`Task ${name} not found`)
    }

    const { task, tape } = exists

    if (task === undefined) {
      throw new Error(`Task ${name} not found`)
    }

    const results = await task.run(args)

    if (this._folderPath !== null) {
      await tape.save()
    }

    return results
  }

  async cleanLog (name: string): Promise<void> {
    if (this._folderPath === null) {
      return
    }

    const tapePath = path.resolve(__dirname, `../../${this._folderPath as string}/${name}.log`)
    await fsPromises.unlink(tapePath)
  }
}
