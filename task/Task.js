"use strict";
var Q = require("q");
var TaskState = require("./TaskState");
/** Task implementation for a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
var Task = (function () {
    function Task(name, action, dfd) {
        if (dfd === void 0) { dfd = Q.defer(); }
        this.name = name;
        this.state = TaskState.CREATED;
        this.action = action;
        this.actionDfd = dfd;
        this.isPromise = Task.isPromise(action);
        this.result = undefined;
        this.error = undefined;
    }
    Task.prototype.start = function () {
        var that = this;
        if (this.state !== TaskState.CREATED) {
            throw new Error("task has already been started, cannot start task more than once");
        }
        function taskCompleted(res) {
            that.state = TaskState.COMPLETED;
            that.result = res;
            that.actionDfd.resolve(res);
        }
        function taskErrored(err) {
            that.state = TaskState.ERRORED;
            that.error = err;
            that.actionDfd.reject(err);
        }
        this.state = TaskState.AWAITING_EXECUTION;
        if (this.isPromise) {
            this.state = TaskState.RUNNING; // TODO technically incorrect, we don't know when the task will run in the browser/node/rhino/etc.
            this.action.then(taskCompleted, taskErrored);
        }
        else {
            try {
                this.state = TaskState.RUNNING;
                var res = this.action();
                taskCompleted(res);
            }
            catch (e) {
                taskErrored(e);
            }
        }
        return this.actionDfd.promise;
    };
    Task.prototype.isSettled = function () {
        return this.state.isSettled();
    };
    Task.prototype.getPromise = function () {
        return this.actionDfd.promise;
    };
    Task.prototype.getResult = function () {
        return this.result;
    };
    Task.prototype.getError = function () {
        return this.error;
    };
    /** Create a task
     * @param name the name of the task
     * @param action the unit of work performed by this task, a function or promise
     * @param [dfd] an optional Deferred to use for tracking the completion/failure of the task, if not provided a default will be created using 'Q.defer()'
     */
    Task.newTask = function (name, action, dfd) {
        if (dfd === void 0) { dfd = Q.defer(); }
        return new Task(name, action, dfd);
    };
    Task.isPromise = Q.isPromiseAlike;
    return Task;
}());
module.exports = Task;
