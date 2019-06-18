TypeScript Task Results
==============

Dependencies:
* Q.js
* ts-promises

Manage task groups which can be functions and/or promises.
Example:
```ts
var Q = require("q");
var Tasks = require("ts-task-results/task/Tasks");
var TaskSet = require("ts-task-results/task/TaskSet");

var taskSet = new TaskSet<string, string>(null, (name) => console.log("success:", name), (name) => console.log("failure:", name));
taskSet.startTask("task-1", Tasks.newTask<string, string>("a", () => "result a").start());
taskSet.startTask("task-2", Q.resolve<string>("result b"));
taskSet.startTask("task-3", Q.reject<string>("error c"));

Q.all(<PromiseLike<any>[]>taskSet.getPromises())
    .then((results) => console.log("done:", results), (err) => console.error("error:", err));
```

Output (order may differ):
```
success: task-2
failure: task-3
success: task-1
error: error c
```


### Tasks
Static `newTask()` and `newTaskSet()` methods

### Task
Wrapper for synchronous or asynchronous function or promise and tracking its status/completion

### TaskSet
Manage a group of Tasks, keep track of which ones are in-progress, which ones are completed, and which ones have failed. 
Allows for logging/error handling to easily be inserted into groups of similar asynchronous tasks.

### Results
Simple interfaces and helpers for returning results OR errors from a function
