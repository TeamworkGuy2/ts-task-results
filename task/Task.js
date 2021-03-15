"use strict";
/** Task implementation for a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
var Task = /** @class */ (function () {
    function Task(name, action) {
        this.name = name;
        this.state = "CREATED";
        this.originalAction = action;
        this.action = action;
        this.result = undefined;
        this.error = undefined;
    }
    /** Start this task, can only be called once per task instance, subsequent calls throw an error.
     * @returns a promise which completes or fails when the task completes or fails
     */
    Task.prototype.start = function () {
        var that = this;
        if (this.state !== "CREATED") {
            throw new Error("task has already been started, cannot start task more than once");
        }
        // resolve/reject run on next tick so 'action' functions that return immediately don't cause TaskSet.getPromises() to return bad results
        function taskCompleted(res) {
            that.state = "COMPLETED";
            that.result = res != null ? res : null;
            return res;
        }
        function taskErrored(err) {
            that.state = "ERRORED";
            that.error = err != null ? err : null;
            throw err;
        }
        this.state = "AWAITING_EXECUTION";
        this.state = "RUNNING"; // TODO technically incorrect, we don't know when the task will run in the browser/node/other.
        this.action = this.action.then(taskCompleted, taskErrored);
        return this.action;
    };
    Task.prototype.isSettled = function () {
        return Task.isSettled(this.state);
    };
    Task.prototype.getPromise = function () {
        return this.action;
    };
    Task.prototype.getResult = function () {
        return this.result;
    };
    Task.prototype.getError = function () {
        return this.error;
    };
    /** Create and start a task
     * @param name the name of the task
     * @param action the unit of work performed by this task, a function or promise
     * @param dfd IDeferred for tracking the completion/failure of the task, if not provided a default will be created using 'Q.defer()'
     */
    Task.startTask = function (name, action) {
        var task = new Task(name, action);
        task.start();
        return task;
    };
    Task.isSettled = function (state) {
        return state === "CANCELED" || state === "ERRORED" || state === "COMPLETED";
    };
    Task.isRunning = function (state) {
        return state === "RUNNING" || state === "AWAITING_SCHEDULING" || state === "AWAITING_EXECUTION";
    };
    Task.isPromise = function (obj) {
        return obj === Object(obj) && typeof obj.then === "function";
    };
    return Task;
}());
module.exports = Task;
