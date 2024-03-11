import { Task } from '@marble-seeds/task'
import Schema from '@marble-seeds/schema'
import axios from 'axios'

interface TastArgv {
  ticker: string
  startDate: string
  endDate: string
}

interface PriceData {
  date: string
  open: number
  close: number
}

export const getDelta = new Task(async function ({ ticker, startDate, endDate }: TastArgv, { fetchPriceData }) {
  const {
    startPrice,
    endPrice
  } = await fetchPriceData(ticker, startDate, endDate)

  const deltaPrice = endPrice - startPrice
  const percentageChange = (deltaPrice / startPrice) * 100

  console.log(`Delta Price: ${deltaPrice}, ${percentageChange}`)

  return {
    deltaPrice,
    percentageChange,
    startPrice,
    endPrice
  }
}, {
  boundaries: {
    fetchPriceData: async (ticker: string, startDate: string, endDate: string) => {
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`, {
        params: {
          period1: new Date(startDate).getTime() / 1000,
          period2: new Date(endDate).getTime() / 1000,
          interval: '1d'
        }
      })

      const priceData: PriceData[] = response.data.chart.result[0].indicators.quote[0].open.map((open: number, index: number) => ({
        date: new Date(response.data.chart.result[0].timestamp[index] * 1000).toISOString().split('T')[0],
        open,
        close: response.data.chart.result[0].indicators.quote[0].close[index]
      }))

      const startPrice = priceData[0]?.open
      const endPrice = priceData[priceData.length - 1]?.close

      return {
        startPrice,
        endPrice
      }
    }
  }
})

getDelta.setSchema({
  ticker: Schema.types.string.required(),
  startDate: Schema.types.string.required(),
  endDate: Schema.types.string.required()
})
