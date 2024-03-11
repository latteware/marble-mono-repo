import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'

import { getDelta } from './getDelta'

interface TastArgv {
  ticker: string
}

export const getPrice = new Task(async function ({ ticker }: TastArgv) {
  const today = new Date()
  const endDate = today.toISOString().split('T')[0]

  const start = new Date(today)
  start.setDate(today.getDate() - 30)
  const startDate = start.toISOString().split('T')[0]

  const res = await getDelta.run({ ticker, startDate, endDate })

  return res
}, {
  boundaries: {}
})

getPrice.setSchema({
  ticker: Schema.types.string.required()
})
