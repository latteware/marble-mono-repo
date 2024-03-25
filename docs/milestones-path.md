# Milestones path

This file contains the current milestone and future milestones. The current milestone is the one that Im working on which i hope to ship soon and the future milestions are just ideas.

## [Current] Milestion 2: Create and deploy a runneres

Objective: Be able to create a runner, running locally and  deploy flow to the runner to a lambda

#### [Done] Step 1 create a runner

`> seeds create-runner stocks`

This runner will need to create a index.ts, a version file, a handler file and a terraform file.

#### [Done] Step 2 Add to runner lib a handler and parse args functions

Make runners be able to handler how to parse args and have a runner.handle so it starts to match the CLI and Lambda flows.

#### [Done] Step 3 add tasks to the runner and a handler

Add task to runner

#### [Done] Step 4 Run it locally on cli

Run the multiple task on the runner locally

**Sidequest:** Migrate seeds to use this runners flow

#### Step 5 bundle and upload runner to S3

Bundle the runner and Upload the file to S3

#### Step 6 Deploy lambda using the S3 file

Create a lambda using terraform that loads the bundle from S3 and its able to run the task on the UI

#### Step 7 Add logs to runners

Runner should handler their logs in a way that can change per env.

## Future milestones

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
