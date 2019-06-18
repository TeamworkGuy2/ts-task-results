"use strict";
var Q = require("q");
/** Task implementation for a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
var Task = /** @class */ (function () {
    function Task(name, action, dfd) {
        if (dfd === void 0) { dfd = Q.defer(); }
        this.name = name;
        this.state = "CREATED";
        this.action = action;
        this.actionDfd = dfd;
        this.result = undefined;
        this.error = undefined;
    }
    Task.prototype.start = function () {
        var that = this;
        if (this.state !== "CREATED") {
            throw new Error("task has already been started, cannot start task more than once");
        }
        // resolve/reject run on next tick so 'action' functions that return immediately don't cause TaskSet.getPromises() to return bad results
        function taskCompleted(res) {
            that.state = "COMPLETED";
            that.result = res != null ? res : null;
            that.actionDfd.resolve(res);
        }
        function taskErrored(err) {
            that.state = "ERRORED";
            that.error = err != null ? err : null;
            that.actionDfd.reject(err);
        }
        this.state = "AWAITING_EXECUTION";
        if (Task.isPromise(this.action)) {
            this.state = "RUNNING"; // TODO technically incorrect, we don't know when the task will run in the browser/node/other.
            this.action.then(taskCompleted, taskErrored);
        }
        else {
            try {
                this.state = "RUNNING";
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
        return Task.isSettled(this.state);
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
    Task.isSettled = function (state) {
        return state === "CANCELED" || state === "ERRORED" || state === "COMPLETED";
    };
    Task.isRunning = function (state) {
        return state === "RUNNING" || state === "AWAITING_SCHEDULING" || state === "AWAITING_CHILDREN_COMPLETION" || state === "AWAITING_EXECUTION";
    };
    Task.isPromise = Q.isPromiseAlike;
    return Task;
}());
module.exports = Task;
