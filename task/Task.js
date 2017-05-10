"use strict";
var Q = require("q");
var TaskStatus = require("./TaskStatus");
/** Task class for a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
var Task = (function () {
    function Task(name, action, dfd) {
        if (dfd === void 0) { dfd = Q.defer(); }
        this._name = name;
        this.action = action;
        this.actionDfd = dfd;
        this.isPromise = Task.isPromise(action);
        this._status = TaskStatus.CREATED;
        this.start = this.start.bind(this);
    }
    Object.defineProperty(Task.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Task.prototype.start = function () {
        var that = this;
        if (this._status !== TaskStatus.CREATED) {
            throw new Error("task has already been started, cannot start task more than once");
        }
        function taskCompleted(res) {
            that._status = TaskStatus.COMPLETED;
            that.result = res;
            that.actionDfd.resolve(res);
        }
        function taskErrored(err) {
            that._status = TaskStatus.ERRORED;
            that.error = err;
            that.actionDfd.reject(err);
        }
        this._status = TaskStatus.AWAITING_EXECUTION;
        if (this.isPromise) {
            this._status = TaskStatus.RUNNING; // TODO technically incorrect, we don't know when the task will run in the browser/node/rhino/etc.
            this.action.then(taskCompleted, taskErrored);
        }
        else {
            try {
                this._status = TaskStatus.RUNNING;
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
        return this._status.isSettled();
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
    return Task;
}());
Task.isPromise = Q.isPromiseAlike;
module.exports = Task;
