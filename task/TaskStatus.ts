import EnumCreator = require("../../ts-mortar/utils/EnumCreator");

/** TaskStatus enum for the status of a {@link Task}
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
class TaskStatus {
    static CANCELED: TaskStatus;
    static CREATED: TaskStatus;
    static ERRORED: TaskStatus;
    static COMPLETED: TaskStatus;
    static RUNNING: TaskStatus;
    static AWAITING_SCHEDULING: TaskStatus;
    static AWAITING_CHILDREN_COMPLETION: TaskStatus;
    static AWAITING_EXECUTION: TaskStatus;


    private phase: any;

    constructor(phase: any) {
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
    CREATED: {},
    RUNNING: {},
    SETTLED: {},
};


var TaskStatusEnum = EnumCreator.initEnumClass(TaskStatus, TaskStatus, (toMember) => {
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

type TaskStatusEnum = TaskStatus & EnumCreator.EnumMember;

export = TaskStatusEnum;