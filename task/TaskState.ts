import EnumCreator = require("ts-mortar/utils/EnumCreator");

/** TaskState enum for the status of a Task
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
class TaskState implements TaskResults.TaskState {
    static CANCELED: TaskState;
    static CREATED: TaskState;
    static ERRORED: TaskState;
    static COMPLETED: TaskState;
    static RUNNING: TaskState;
    static AWAITING_SCHEDULING: TaskState;
    static AWAITING_CHILDREN_COMPLETION: TaskState;
    static AWAITING_EXECUTION: TaskState;

    private phase: number;

    constructor(phase: number) {
        this.phase = phase;
    }


    isSettled() {
        return this.phase === TaskPhase.SETTLED;
    }


    isRunning() {
        return this.phase === TaskPhase.RUNNING;
    }

}


var TaskPhase = {
    CREATED: 1,
    RUNNING: 3,
    SETTLED: 5,
};


var TaskStateEnum = EnumCreator.initEnumClass(TaskState, TaskState, (toMember: (member: TaskState) => TaskState & EnumCreator.EnumMember) => {
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

type TaskStateEnum = TaskState & EnumCreator.EnumMember;

export = TaskStateEnum;