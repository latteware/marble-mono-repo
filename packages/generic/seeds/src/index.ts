#!/usr/bin/env node

// This is a typescript/esbuild program that load a typescript runner from a Marble seeds
// posible task are init, describe, create-task, run, build, deploy commands
import minimist from 'minimist'

import { version } from '../package.json'

import { runner } from './runners/cli/runner'

const args = minimist(process.argv.slice(2))

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

// ToDo: Check if the init command is called
const cli = async function (): Promise<void> {
  if (args.version !== undefined) {
    console.log(`seeds version ${version}`)
  } else if (args._[0] === 'list-tasks') {
    const listTasks = runner.getTask('task:list')

    const res = await listTasks.run({})
    console.log('Total tasks:', res.length)
  } else if (args._.includes('init') === true) {
    const init = runner.getTask('init')

    const outcome = await init.run({})
    console.log('Init', outcome)
  } else if (args._[0] === 'run-task' && args._[1] !== undefined) {
    const argv = parseRunnerArgs(args)
    const runTask = runner.getTask('task:run')
    console.log('Run task', args._[1], ' with ', argv.params)

    const res = await runTask.run({
      descriptorName: args._[1],
      args: argv.params
    })
    console.log('Run successfully:', res)
  } else if (args._[0] === 'save-fixture') {
    const saveFixture = runner.getTask('task:saveFixture')
    console.log('Saving fixture: ', args._[1])

    const res = await saveFixture.run({
      descriptorName: args._[1]
    })
    console.log('Saved successfully:', res)
  } else if (args._[0] === 'create-task') {
    const createTask = runner.getTask('task:create')

    const res = await createTask.run({
      taskDescriptor: args.name,
      taskPath: args.path
    })
    console.log('Created successfully:', res)
  } else if (args._[0] === 'create-test') {
    const createTest = runner.getTask('task:createTest')
    console.log('Creating', args.name)

    const res = await createTest.run({
      taskName: args.name
    })
    console.log('Created successfully:', res.testFile)
  } else if (args._[0] === 'create-runner') {
    const createRunner = runner.getTask('runner:create')
    console.log('Creating', args.name)

    const res = await createRunner.run({
      runnerName: args.name
    })
    console.log('Created successfully:', res)
  } else {
    console.error('Invalid options')
    process.exit(1)
  }

  process.exit(0)
}

cli().catch((e) => {
  console.log('Error:', e.message)
  process.exit(1)
})
