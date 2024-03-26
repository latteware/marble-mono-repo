// TASK: upload
// Run this task with: seeds task:run runner:upload
import path from 'path'
import fs from 'fs/promises'
import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { bundle as bundleRuner } from '../bundle/create'
import { zip } from '../bundle/zip'
import { load } from '../conf/load'

import { type SeedsConf } from '../types'

export interface TastArgv {
  descriptorName: string
}

export const upload = new Task(async function ({ descriptorName }: TastArgv, { loadConf }) {
  const seeds: SeedsConf = await loadConf({})
  const runnerDescriptor = seeds.runners[descriptorName]

  if (runnerDescriptor === undefined) {
    throw new Error('Runner not found')
  }

  const entryPoint = path.join(process.cwd(), runnerDescriptor.path)
  const outputFile = path.resolve(__dirname, '../.builds', `${descriptorName}.js`)
  const zipFolder = path.resolve(__dirname, '../.builds')
  const zipFile = path.resolve(__dirname, '../.builds', `${descriptorName}.zip`)

  await bundleRuner.run({
    entryPoint,
    outputFile
  })

  await zip.run({
    dir: zipFolder,
    input: `${descriptorName}.js`,
    output: zipFile
  })

  console.log(descriptorName, '->', zipFile)
  const fileData = await fs.readFile(zipFile)

  const client = new S3Client({ region: seeds.infra.region })

  const buildPath = `runners/${descriptorName}/v0.0.1.zip`

  console.log('uploading to ->', seeds.infra.bucket, buildPath)
  const command = new PutObjectCommand({
    Bucket: seeds.infra.bucket,
    Key: buildPath,
    Body: fileData
  })

  const response = await client.send(command)

  console.log('->', response)

  const status = { status: 'Ok' }

  return status
}, {
  boundaries: {
    loadConf: load.asBoundary()
  }
})

upload.setSchema({
  descriptorName: Schema.types.string
})
