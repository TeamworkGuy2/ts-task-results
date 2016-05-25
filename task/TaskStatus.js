"use strict";
var EnumCreator = require("../../ts-mortar/utils/EnumCreator");
/** TaskStatus enum for the status of a {@link Task}
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
var TaskStatus = (function () {
    function TaskStatus(name, phase) {
        EnumCreator.EnumConstantImpl.call(this, name);
    }
    TaskStatus.isInstance = function (obj) { return null; };
    TaskStatus.values = function () { return null; };
    TaskStatus.parse = function (name) { return null; };
    TaskStatus.prototype.name = function () { return null; };
    TaskStatus.prototype.isSettled = function () {
        return this.phase === TaskStatus.TaskPhase.SETTLED;
    };
    TaskStatus.prototype.isRunning = function () {
        return this.phase === TaskStatus.TaskPhase.RUNNING;
    };
    TaskStatus.TaskPhase = {
        CREATED: {},
        RUNNING: {},
        SETTLED: {},
    };
    TaskStatus.Cctor = (function () {
        EnumCreator.initEnumClass(TaskStatus, TaskStatus, function () { return [
            TaskStatus.CANCELED = new TaskStatus("CANCELED", TaskStatus.TaskPhase.SETTLED),
            TaskStatus.CREATED = new TaskStatus("CREATED", TaskStatus.TaskPhase.CREATED),
            TaskStatus.ERRORED = new TaskStatus("ERRORED", TaskStatus.TaskPhase.SETTLED),
            TaskStatus.COMPLETED = new TaskStatus("COMPLETED", TaskStatus.TaskPhase.SETTLED),
            TaskStatus.RUNNING = new TaskStatus("RUNNING", TaskStatus.TaskPhase.RUNNING),
            TaskStatus.AWAITING_SCHEDULING = new TaskStatus("AWAITING_SCHEDULING", TaskStatus.TaskPhase.RUNNING),
            TaskStatus.AWAITING_CHILDREN_COMPLETION = new TaskStatus("AWAITING_CHILDREN_COMPLETION", TaskStatus.TaskPhase.RUNNING),
            TaskStatus.AWAITING_EXECUTION = new TaskStatus("AWAITING_EXECUTION", TaskStatus.TaskPhase.RUNNING),
        ]; });
    }());
    return TaskStatus;
}());
module.exports = TaskStatus;
