#!/usr/bin/env node

// This is a typescript/esbuild program that load a typescript runner from a Marble seeds
// posible task are init, describe, create-task, run, build, deploy commands
import minimist from 'minimist'
import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import camelCase from 'camelcase'

import { version } from '../package.json'

import { createTask } from './tasks/createTask'

type Tasks = Record<string, {
  task: any
  tape?: any
}>

const args = minimist(process.argv.slice(2))

// ToDo: move to a marble task
// Function to initialize and create seeds.json
function initializeSeedsConfig (): void {
  const seedsPath = path.join(process.cwd(), 'seeds.json')
  const config = {}

  console.log('Should init a project on', seedsPath)
  console.log('Init config', config)
  fs.writeFileSync(seedsPath, JSON.stringify(config, null, 2))
  console.log('seeds.json has been created')
}

type Props = Record<string, any>

interface Arguments {
  action: string
  taskName: string
  params: Props
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

interface bundleOutput {
  buildFile: string
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

// Check if the init command is called
if (args.version !== undefined) {
  console.log(`seeds version ${version}`)
} else if (args._[0] === 'create-task') {
  createTask.run({
    taskName: camelCase(args.name as string),
    path: args.path
  }).then(res => {
    console.log('Created successfully:', res)
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
} else if (args._.includes('init') === true) {
  initializeSeedsConfig()
} else {
  // Catch all
  console.error('invalid options')
  process.exit(1)
}
