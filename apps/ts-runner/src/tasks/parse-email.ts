import { Task } from '@marble-seeds/task'

export const parseEmail = new Task(({ url }: { url: string }) => {
  console.log('fetching', url)

  return { action: 'hi five!!!' }
})
