## Welcome to Marble seeds mono repo.

This is managed by NX. To list all the projects over here do `nx show projects`. Still everything is to early to show but its something.

## Getting started

To start create a new github project using [the project template](https://github.com/latteware/marble-app-project-template) on Github and install the CLI with

```
npm i -g @marble-seeds/seeds
```

## Cli commands



## Task

#### Create a task

To create a new task do:

```
seeds task:create TASK_NAME
```

Task names usually are MODULE:ACTION like stocks:getPrice

#### Run task

```
seeds task:run TASK_NAME --param value
```

Example

```
seeds task:run stocks:getDelta --ticker="BRK-B" --startDate "2024-01-10" --endDate
"2024-03-20"
```

#### Create test for a task

Create a test for your task can be done with

```
seeds task:createTest TASK_NAME
```

#### Save fixture for a task

This will add a fixture from the last execution to your test

```
seeds task:createTest TASK_NAME
```

Aftet that do `npm test` to run the text based on the fixtures that you have saves

#### List task

```
seeds task:list
```

## Runner

#### Create a runner

```
seeds runner:create RUNNER_NAME
```

#### Run a target runner

```
seeds runner:run RUNNER_NAME --param value
```

#### List task on target runner

```
seeds runner:list RUNNER_NAME
```

## Other

#### Info

Will provide current seeds version

```
seeds info
```

#### Init

Will create a seeds.json file. This file is needed on the root of the project. Will describe available tasks, runners and paths on the repo.

```
seeds init
```
