const { Task } = require('@marble-seeds/task')

const task = new Task(async function (argv) {
  console.log(argv)

  return { foo: true }
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
