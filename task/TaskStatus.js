"use strict";
var EnumCreator = require("../../ts-mortar/utils/EnumCreator");
/** TaskStatus enum for the status of a Task
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
var TaskStatus = (function () {
    function TaskStatus(phase) {
        this.phase = phase;
    }
    TaskStatus.prototype.isSettled = function () {
        return this.phase === TaskPhase.SETTLED;
    };
    TaskStatus.prototype.isRunning = function () {
        return this.phase === TaskPhase.RUNNING;
    };
    return TaskStatus;
}());
var TaskPhase = {
    CREATED: {},
    RUNNING: {},
    SETTLED: {},
};
var TaskStatusEnum = EnumCreator.initEnumClass(TaskStatus, TaskStatus, function (toMember) {
    return {
        CANCELED: toMember(new TaskStatus(TaskPhase.SETTLED)),
        CREATED: toMember(new TaskStatus(TaskPhase.CREATED)),
        ERRORED: toMember(new TaskStatus(TaskPhase.SETTLED)),
        COMPLETED: toMember(new TaskStatus(TaskPhase.SETTLED)),
        RUNNING: toMember(new TaskStatus(TaskPhase.RUNNING)),
        AWAITING_SCHEDULING: toMember(new TaskStatus(TaskPhase.RUNNING)),
        AWAITING_CHILDREN_COMPLETION: toMember(new TaskStatus(TaskPhase.RUNNING)),
        AWAITING_EXECUTION: toMember(new TaskStatus(TaskPhase.RUNNING)),
    };
});
module.exports = TaskStatusEnum;
