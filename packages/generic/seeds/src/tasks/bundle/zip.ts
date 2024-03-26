// TASK: zip
// Run this task with: seeds task:run bundle:zip --dir .builds/ --input dailyUpdate.js --output dailyUpdate.zip

import archiver from 'archiver'
import fs from 'fs'
import path from 'path'
import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'

export interface TastArgv {
  dir: string
  input: string
  output: string
}

const bytesToMB = (bytes: number): string => {
  const MB = bytes / (1024 * 1024)
  return `${MB.toFixed(2)} MB`
}

export const zip = new Task(async function ({ dir, input, output }: TastArgv) {
  const q = new Promise(function (resolve, reject) {
    console.log('Zip into ->', path.resolve(dir, output))
    const outStream = fs.createWriteStream(path.resolve(dir, output))
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    archive.on('error', function (err) {
      reject(err)
    })

    outStream.on('end', function () {
      console.log('Data has been drained')
    })

    outStream.on('close', function () {
      console.log(bytesToMB(archive.pointer() as number) + ' total bytes')
      console.log('archiver has been finalized and the output file descriptor has closed.')

      setTimeout(() => {
        resolve({
          output
        })
      }, 100)
    })

    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.warn('ENOENT', err)
      } else {
        // throw error
        throw err
      }
    })

    archive.pipe(outStream)

    console.log('Input ->', input)
    const inputPath = path.resolve(dir, input)
    archive.file(inputPath, { name: 'index.js' })
    archive.file(inputPath + '.map', { name: 'index.js.map' })
    archive.finalize()
  })

  return await q
}, {
  boundaries: {}
})

zip.setSchema({
  dir: Schema.types.string,
  input: Schema.types.string,
  output: Schema.types.string
})
