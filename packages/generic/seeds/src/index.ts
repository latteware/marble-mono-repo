#!/usr/bin/env node

// This is a typescript/esbuild program that load a typescript runner from a Marble seeds
// posible task are init, describe, create-task, run, build, deploy commands
import minimist from 'minimist'
import esbuild from 'esbuild'
import path from 'path'

import { version } from '../package.json'

import { runner } from './runners/cli/runner'

type Tasks = Record<string, {
  task: any
  tape?: any
}>

const args = minimist(process.argv.slice(2))

type Props = Record<string, any>

interface Arguments {
  action: string
  taskName: string
  params: Props
}

interface bundleOutput {
  buildFile: string
}

export function parseRunnerArgs (margs: any): Arguments {
  const argv: any = margs
  const action: string = argv._[0]

  if (action === undefined) {
    throw new Error('No action defined')
  }
  const taskName = argv.task

  const newObj: Props = { ...argv }

  delete newObj._
  delete newObj.task

  return { action, taskName, params: newObj }
}

async function loadRunner (runnerName: string): Promise<any> {
  let runner
  try {
    const runnerPath = path.resolve(runnerName)

    runner = await import(runnerPath)
  } catch (error) {
    console.error(`Failed to run the ${runnerName} runner.`, error)
  }

  return runner.default
}

async function bundle (runnerName: string): Promise<bundleOutput> {
  const entryPoint = path.join(process.cwd(), `src/runners/${runnerName}/index.ts`)
  const outPoint = path.join(__dirname, `../.builds/${runnerName}/latest.js`)

  await esbuild.build({
    entryPoints: [entryPoint],
    outfile: outPoint,
    bundle: true,
    minify: true,
    platform: 'node'
  })

  return {
    buildFile: outPoint.toString()
  }
}

// ToDo: Check if the init command is called
if (args.version !== undefined) {
  console.log(`seeds version ${version}`)
} else if (args._[0] === 'run-task' && args._[1] !== undefined) {
  const argv = parseRunnerArgs(args)
  const runTask = runner.getTask('task:run')
  console.log('Run task', args._[1], ' with ', argv.params)

  runTask.run({
    descriptorName: args._[1],
    args: argv.params
  }).then(res => {
    console.log('Run successfully:', res)
  }).catch(err => {
    console.error('Opps!!!', err)
  })
} else if (args._[0] === 'save-fixture') {
  const saveFixture = runner.getTask('task:saveFixture')
  console.log('Saving fixture: ', args._[1])

  saveFixture.run({
    descriptorName: args._[1]
  }).then(res => {
    console.log('Saved successfully:', res)
  }).catch(err => {
    console.error('Opps!!!', err)
  })
} else if (args._[0] === 'create-task') {
  const createTask = runner.getTask('task:create')

  createTask.run({
    taskDescriptor: args.name,
    taskPath: args.path
  }).then(res => {
    console.log('Created successfully:', res)
  }).catch(err => {
    console.error('Opps!!!', err)
  })
} else if (args._[0] === 'create-test') {
  console.log('Creating', args.name)

  const createTest = runner.getTask('task:createTest')
  createTest.run({
    taskName: args.name
  }).then(res => {
    console.log('Created successfully:', res.testFile)
  }).catch(err => {
    console.error('Opps!!!', err)
  })
} else if (args._[0] === 'describe' && args._[1] !== undefined) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  bundle(args._[1]).then(async ({ buildFile }) => {
    const module = await loadRunner(buildFile)
    return module.default
  }).then(runner => {
    const listItems: Tasks = runner.getTasks()
    console.log('Available tasks:')

    Object.keys(listItems).forEach((taskName: string) => {
      const { task } = listItems[taskName]
      if (task.getSchema() !== undefined) {
        console.log(`- ${taskName}`, task.getSchema()._schema.describe())
      } else {
        console.log(`- ${taskName}`)
      }
    })
  }).catch(err => {
    console.error('Error', err)
  })
} else if (args._[0] === 'bundle' && args._[1] !== undefined) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  bundle(args._[1]).then(async () => {
    console.log('Bundle successfully')
  }).catch(err => {
    console.error('Error', err)
  })
} else if (args._[0] === 'run' && args._[1] !== undefined) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  bundle(args._[1]).then(async ({ buildFile }) => {
    const module = await loadRunner(buildFile)
    return module.default
  }).then(async runner => {
    const argv = parseRunnerArgs(args)

    const res = await runner.run(argv.taskName, argv.params)
    console.log('Result =>', res)

    return res
  }).catch(err => {
    console.error('Error', err)
  })
} else if (args._.includes('list-tasks') === true) {
  const listTasks = runner.getTask('task:list')

  listTasks.run({}).then(async outcome => {
    console.log('listTasks', outcome)
  }).catch(err => {
    console.error('Cant listTasks!', err.message)
  })
} else if (args._.includes('init') === true) {
  const init = runner.getTask('init')

  init.run({}).then(async outcome => {
    console.log('Init', outcome)
  }).catch(err => {
    console.error('Cant init!', err)
  })
} else {
  // Catch all
  console.error('invalid options')
  process.exit(1)
}
