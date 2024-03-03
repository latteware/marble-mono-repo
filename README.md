## Welcome to Marble seeds mono repo.

This is managed by NX. To list all the projects over here do `nx show projects`. Still everything is to early to show but its something.

## Milestone 1: Flow of a task

#### [Done]Step 1 - init

Maybe add path from the task folder... use "src/tasks/" for the default

####  [Done]Step 2 - create task

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

### Milestone: Create and deploy a runneres

Objective: Be able to create a runner, running locally and  deploy flow to the runner to a lambda

#### Step 1 create a runner

`> seeds create-runner stocks`

#### Step 2 add tasks to the runner and a handler?

#### Step 3 deploy to a lambda

### Milestone: Interactive CLI

Objective: Add [inquirer](https://www.npmjs.com/package/inquirer) to the CLI to allow an interactive experieces

### Milestone: Load a Runner on the UI

Objective: Allow a CRA, Nextjs or Expo project to load a runner and have it load or mutada data

### Milestone: DynamoDB data store

Objective: Create a datastore with DynamoDB as backed using Marble Schemas to define the table schema

### Milestone: Runner pre funcion per env

Objective: Allow runners to define a pre function(that is a task) with and env(local, ui, lambda) so it can process the inputs easier.

Use case: A lambda event for a S3 file should be parsed so the tasks can be created easilly, while on local it can be runned with a simple uuid and bucket param

## Projects to research

#### Typia

[Typia Docs](https://typia.io/docs/)

This project allows to create validators from typescript types on the fly. This could be a great way to handle schema validation instead or on top of Joi.
