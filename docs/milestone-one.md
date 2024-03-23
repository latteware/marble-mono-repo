## Milestone 1: Flow of a task

Finished Sat, 23 March 2024

#### [Done] Step 1 - init

Maybe add path from the task folder... use "src/tasks/" for the default

####  [Done] Step 2 - create task

`> seeds create-task --name "stocks:get-delta" --path src/tasks/`

=> use base path "src/tasks/" if not provided use the one on seeds.json

=> split the :

=> use folder stocks to create getDelta.ts

=> add to seeds.json an object tasks with stocks:get-delta and the path src/tasks/stocks/getDelta.ts

#### [Done] Step 3 Code to the task

Write the code of your task to get price and delta based on a period of time

#### [Done] Step 4 run task

`> seeds run-task stocks:get-delta --ticket AMZN|NVDA`

#### [Done] Step 5 create a tests file on task creation and have fixture functionality

Make that a run task create a log item.

Then allow the user to create a for this log item with:

#### [Done]Step 6 upgrade project template

`> seeds create-test stocks:get-delta`

Maybe allow to pick the number of the log item or review log items. Will need to create a test suite in file at the time that the task is created.


