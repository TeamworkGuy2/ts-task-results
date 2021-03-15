"use strict";
/// <reference path="./task-results.d.ts" />
var Task = require("./Task");
var TaskSet = require("./TaskSet");
var Tasks;
(function (Tasks) {
    /** Create a task
     * @param name the name of the task
     * @param action the unit of work performed by this task, a function or promise
     * @param dfd IDeferred for tracking the completion/failure of the task, if not provided a default will be created using 'Q.defer()'
     */
    function startTask(name, action) {
        return Task.startTask(name, action);
    }
    Tasks.startTask = startTask;
    /** Create a task set
     * @param name the name of the task set
     * @param action the unit of work performed by this task, a function or promise
     * @param [dfd] an optional Deferred to use for tracking the completion/failure of the task, if not provided a default will be created using 'Q.defer()'
     */
    function newTaskSet(taskStartedCb, taskCompletedCb, taskFailedCb) {
        return new TaskSet(taskStartedCb, taskCompletedCb, taskFailedCb);
    }
    Tasks.newTaskSet = newTaskSet;
})(Tasks || (Tasks = {}));
module.exports = Tasks;
