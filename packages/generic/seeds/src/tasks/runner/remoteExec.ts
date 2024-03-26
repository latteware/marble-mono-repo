// TASK: remoteExec
// Run this task with: seeds task:run runner:remoteExec

import { Task } from '@marble-seeds/task'
// import Schema from '@marble-seeds/schema'
import { LambdaClient, InvokeCommand, type InvokeCommandInput } from '@aws-sdk/client-lambda'

import { load } from '../conf/load'
import { type SeedsConf } from '../types'

// Remove this comment once you add the params options that that the task allow
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TastArgv {}

export const remoteExec = new Task(async function (argv: TastArgv, { loadConf }) {
  const seeds: SeedsConf = await loadConf({})
  const lambdaClient = new LambdaClient({ region: seeds.infra.region })

  const body = {
    task: 'stocks:getPrice',
    args: {
      ticker: 'AMZN'
    }
  }

  const params: InvokeCommandInput = {
    FunctionName: 'cdktf-sandbox-function', // Replace with your Lambda function name
    InvocationType: 'RequestResponse', // For synchronous execution
    Payload: Buffer.from(JSON.stringify(body))
  }

  console.log('Exec with ->', body, params)
  const command = new InvokeCommand(params)
  const response = await lambdaClient.send(command)

  const payload = JSON.parse(new TextDecoder('utf-8').decode(response.Payload))

  console.log('->', payload)

  const status = {
    status: 'Ok',
    data: payload
  }

  return status
}, {
  boundaries: {
    loadConf: load.asBoundary()
  }
})

// Add argument: Schema.types.string
remoteExec.setSchema({})
