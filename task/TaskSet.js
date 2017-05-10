"use strict";
/// <reference path="../../ts-promises/ts-promises.d.ts" />
var Task = require("./Task");
/** A set of tasks where all tasks return the same result type.
 * The advantage of a TaskSet over a Promise[] is that a task set provides listeners for start, completion, and failure events to be intercepted for logging or other purposes
 * @since 2016-09-24
 * @template T the type of result returned by the tasks in this task set
 * @template S the type of error throw by the tasks in this task set
 */
var TaskSet = (function () {
    /** Create an empty task set with option started, completed, and failed callbacks
     * @param [taskStartedCb] a function to call when a task starts (i.e. when startTask() is called)
     * @param [taskCompletedCb] a function to call when a task completes
     * @param [taskFailedCb] a function to call when a task fails
     */
    function TaskSet(taskStartedCb, taskCompletedCb, taskFailedCb) {
        /** The maximum number of completed tasks which can be saved by this task set and retrieved via getCompletedTasks().
         * If this value is 0, then no task history is kept.
         * If this value is -1, then all task history is kept
         */
        this.maxCompletedTasks = 200;
        /** The percentage of 'maxCompletedTasks' to drop from the 'tasksCompleted' array when it becomes full. Must be between [0, 1]
         */
        this.dropCompletedTasksPercentage = 0.5;
        this.tasksCompletedCount = 0;
        this.tasksInProgress = new Map();
        this.tasksCompleted = [];
        this.taskStartedCallback = taskStartedCb;
        this.taskCompletedCallback = taskCompletedCb;
        this.taskFailedCallback = taskFailedCb;
    }
    TaskSet.prototype.getTaskStartedCallback = function () {
        return this.taskStartedCallback;
    };
    TaskSet.prototype.setTaskStartedCallback = function (cb) {
        TaskSet.checkCallback(cb, "task started");
        this.taskStartedCallback = cb;
    };
    TaskSet.prototype.getTaskCompletedCallback = function () {
        return this.taskCompletedCallback;
    };
    TaskSet.prototype.setTaskCompletedCallback = function (cb) {
        TaskSet.checkCallback(cb, "task completed");
        this.taskCompletedCallback = cb;
    };
    TaskSet.prototype.getTaskFailedCallback = function () {
        return this.taskFailedCallback;
    };
    TaskSet.prototype.setTaskFailedCallback = function (cb) {
        TaskSet.checkCallback(cb, "task failed");
        this.taskFailedCallback = cb;
    };
    /** @return a list of completed tasks, possibly only containing a limited number of the most recently completed tasks based on the max tasks completed limit.
     * @ee #getMaxTasksCompletedSize()
     */
    TaskSet.prototype.getCompletedTasks = function () {
        return this.tasksCompleted;
    };
    /** Clear the completed tasks array and reset the completed task count to 0
     */
    TaskSet.prototype.clearCompletedTasks = function () {
        this.tasksCompleted = [];
        this.tasksCompletedCount = 0;
    };
    /** This is the total number of tasks completed regardless of the max tasks completed limit
     */
    TaskSet.prototype.getCompletedTaskCount = function () {
        return this.tasksCompletedCount;
    };
    /** Check whether a specific task or, if no name is provided, if any tasks, are currently in progress
     * @param [taskName] optional name of the task to check
     */
    TaskSet.prototype.isRunning = function (taskName) {
        if (taskName != null) {
            return this.tasksInProgress.get(taskName) != null ? this.tasksInProgress.get(taskName).status.isRunning() : false;
        }
        else {
            return this.tasksInProgress.size > 0;
        }
    };
    /** All of the currently in progress tasks flattened into an array of objects with 'name' and 'task' properties
     */
    TaskSet.prototype.getInProgressTasks = function () {
        var res = [];
        this.tasksInProgress.forEach(function (task, name) {
            res.push({ name: name, task: task });
        });
        return res;
    };
    /** All of the currently in-progress tasks
     */
    TaskSet.prototype.getTasks = function () {
        return this.tasksInProgress;
    };
    /** Return an array of promises from all of the currently in-progress tasks
     */
    TaskSet.prototype.getPromises = function () {
        var promises = [];
        this.tasksInProgress.forEach(function (task) { return promises.push(task.getPromise()); });
        return promises;
    };
    /** Start a task based on a promise, the task is started and added to this task set's internal list of in-progress tasks
     * @param taskName the name of the task
     * @param taskPromise the promise which the new task will be based on, when this promise completes/fails, the task will complete/fail
     */
    TaskSet.prototype.startTask = function (taskName, task) {
        var that = this;
        function taskDone(res) {
            // keep a log of completed tasks
            that.saveCompletedTask(taskName, newTask);
            // remove the completed task
            that.tasksInProgress.delete(taskName);
            that.callTaskCompleted(taskName);
            return res;
        }
        function taskError(err) {
            // remove failed task
            that.tasksInProgress.delete(taskName);
            that.callTaskFailed(taskName);
            throw err;
        }
        // handle promises or functions
        var taskWrapped = Task.isPromise(task) ? task.then(taskDone, taskError) : function taskWrapper() {
            try {
                var res = task();
                return taskDone(res);
            }
            catch (e) {
                taskError(e);
            }
        };
        // create and start the task
        var newTask = new Task(taskName, taskWrapped);
        newTask.start();
        this.tasksInProgress.set(taskName, newTask);
        this.callTaskStarted(taskName);
        return newTask;
    };
    TaskSet.prototype.saveCompletedTask = function (taskName, newTask) {
        this.tasksCompletedCount++;
        if (this.maxCompletedTasks !== 0) {
            this.tasksCompleted.push({
                name: taskName,
                task: newTask
            });
            // drop the older half of the task history array when full
            var taskCount = this.tasksCompleted.length;
            if (this.maxCompletedTasks > -1 && taskCount > this.maxCompletedTasks) {
                var mustDrop = taskCount - this.maxCompletedTasks;
                var percentCount = Math.round(this.maxCompletedTasks * this.dropCompletedTasksPercentage);
                this.tasksCompleted = this.tasksCompleted.slice(mustDrop + percentCount, taskCount);
            }
        }
    };
    TaskSet.prototype.callTaskStarted = function (taskName) {
        if (this.taskStartedCallback) {
            try {
                this.taskStartedCallback(taskName);
            }
            catch (e) {
                // Do nothing
            }
        }
    };
    TaskSet.prototype.callTaskCompleted = function (taskName) {
        if (this.taskCompletedCallback) {
            try {
                this.taskCompletedCallback(taskName);
            }
            catch (e) {
                // Do nothing
            }
        }
    };
    TaskSet.prototype.callTaskFailed = function (taskName) {
        if (this.taskFailedCallback) {
            try {
                this.taskFailedCallback(taskName);
            }
            catch (e) {
                // Do nothing
            }
        }
    };
    /** Check if a function argument is a non-null function */
    TaskSet.checkCallback = function (cb, msg) {
        if (typeof cb !== "function") {
            throw new Error(msg + " callback argument must be a function");
        }
    };
    return TaskSet;
}());
module.exports = TaskSet;
