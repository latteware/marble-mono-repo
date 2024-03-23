import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'

import { getDelta } from './getDelta'

export interface TastArgv {
  ticker: string
}

export const getPrice = new Task(async function ({ ticker }: TastArgv, {
  getDelta
}) {
  const res = await getDelta(ticker)

  return res
}, {
  boundaries: {
    getDelta: async (ticker: string) => {
      const today = new Date()
      const endDate = today.toISOString().split('T')[0]

      const start = new Date(today)
      start.setDate(today.getDate() - 30)
      const startDate = start.toISOString().split('T')[0]

      return await getDelta.run({ ticker, startDate, endDate })
    }
  }
})

getPrice.setSchema({
  ticker: Schema.types.string.required()
})
