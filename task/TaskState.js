"use strict";
var EnumCreator = require("../../ts-mortar/utils/EnumCreator");
/** TaskState enum for the status of a Task
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
var TaskState = /** @class */ (function () {
    function TaskState(phase) {
        this.phase = phase;
    }
    TaskState.prototype.isSettled = function () {
        return this.phase === TaskPhase.SETTLED;
    };
    TaskState.prototype.isRunning = function () {
        return this.phase === TaskPhase.RUNNING;
    };
    return TaskState;
}());
var TaskPhase = {
    CREATED: 1,
    RUNNING: 3,
    SETTLED: 5,
};
var TaskStateEnum = EnumCreator.initEnumClass(TaskState, TaskState, function (toMember) {
    return {
        CANCELED: toMember(new TaskState(TaskPhase.SETTLED)),
        CREATED: toMember(new TaskState(TaskPhase.CREATED)),
        ERRORED: toMember(new TaskState(TaskPhase.SETTLED)),
        COMPLETED: toMember(new TaskState(TaskPhase.SETTLED)),
        RUNNING: toMember(new TaskState(TaskPhase.RUNNING)),
        AWAITING_SCHEDULING: toMember(new TaskState(TaskPhase.RUNNING)),
        AWAITING_CHILDREN_COMPLETION: toMember(new TaskState(TaskPhase.RUNNING)),
        AWAITING_EXECUTION: toMember(new TaskState(TaskPhase.RUNNING)),
    };
});
module.exports = TaskStateEnum;
