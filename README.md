## Welcome to Marble seeds mono repo.

This is managed by NX. To list all the projects over here do `nx show projects`. Still everything is to early to show but its something.

## Milestone 1: Flow of a task

#### [Done]Step 1 - init

Maybe add path from the task folder... use "src/tasks/" for the default

####  Step 2 - create task

`> seeds create-task --name "stocks:get-delta" --path src/tasks/`

=> use base path "src/tasks/" if not provided use the one on seeds.json
=> split the :
=> use folder stocks to create getDelta.ts
=> add to seeds.json an object tasks with stocks:get-delta and the path src/tasks/stocks/getDelta.ts

#### Step 3 run task

Write the code of your task to get price and delta based on a period of time

#### Step 4 run task

`> seeds run stocks:get-delta --ticket AMZN|NVDA`

Run and create a logItem from the execution

#### Step 5 create a tests

`> seeds create=test stocks:get-delta`

Use the CLI to create a test based on the logItem from the last execution

## Future milestones

### Milestone: Deploy a runner

Objective: A deploy flow to the runner to a lambda

#### Step 1 create a runner

`> seeds create-runner stocks`

#### Step 2 add tasks to the runner and a handler?

#### Step 3 deploy to a lambda

### Milestone: Interactive CLI

Objective: Add [inquirer](package) to the CLI to allow an interactive experieces

### Milestone: Load a Runner on the UI

Objective: Allow a CRA, Nextjs or Expo project to load a runner and have it load or mutada data

### Milestone: DynamoDB data store

Objective: Create a datastore with DynamoDB as backed using Marble Schemas to define the table schema



