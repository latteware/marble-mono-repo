export interface RunnerDescriptor {
  path: string
}

export interface TaskDescriptor {
  path: string
  handler: string
}

export interface SeedsConf {
  paths: {
    logs: string
    tasks: string
    runners: string
    fixtures: string
    tests: string
  }
  tasks: Record<string, TaskDescriptor>
  runners: Record<string, RunnerDescriptor>
}
