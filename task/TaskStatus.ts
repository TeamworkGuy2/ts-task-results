import EnumCreator = require("../../ts-mortar/utils/EnumCreator");

/** TaskStatus enum for the status of a {@link Task}
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
class TaskStatus implements EnumCreator.EnumConstant {

    private static TaskPhase = {
        CREATED: {},
        RUNNING: {},
        SETTLED: {},
    };

    static CANCELED: TaskStatus;
    static CREATED: TaskStatus;
    static ERRORED: TaskStatus;
    static COMPLETED: TaskStatus;
    static RUNNING: TaskStatus;
    static AWAITING_SCHEDULING: TaskStatus;
    static AWAITING_CHILDREN_COMPLETION: TaskStatus;
    static AWAITING_EXECUTION: TaskStatus;

    static isInstance(obj): boolean { return null; }
    static values(): TaskStatus[] { return null; }
    static parse(name: string): TaskStatus { return null; }

    public name(): string { return null; }


    private static Cctor = (function () {
        EnumCreator.initEnumClass(TaskStatus, TaskStatus, () => [
            TaskStatus.CANCELED = new TaskStatus("CANCELED", TaskStatus.TaskPhase.SETTLED),
            TaskStatus.CREATED = new TaskStatus("CREATED", TaskStatus.TaskPhase.CREATED),
            TaskStatus.ERRORED = new TaskStatus("ERRORED", TaskStatus.TaskPhase.SETTLED),
            TaskStatus.COMPLETED = new TaskStatus("COMPLETED", TaskStatus.TaskPhase.SETTLED),
            TaskStatus.RUNNING = new TaskStatus("RUNNING", TaskStatus.TaskPhase.RUNNING),
            TaskStatus.AWAITING_SCHEDULING = new TaskStatus("AWAITING_SCHEDULING", TaskStatus.TaskPhase.RUNNING),
            TaskStatus.AWAITING_CHILDREN_COMPLETION = new TaskStatus("AWAITING_CHILDREN_COMPLETION", TaskStatus.TaskPhase.RUNNING),
            TaskStatus.AWAITING_EXECUTION = new TaskStatus("AWAITING_EXECUTION", TaskStatus.TaskPhase.RUNNING),
        ]);
    } ());


    private phase;

    constructor(name: string, phase) {
        EnumCreator.EnumConstantImpl.call(this, name);
    }


    isSettled() {
        return this.phase === TaskStatus.TaskPhase.SETTLED;
    }


    isRunning() {
        return this.phase === TaskStatus.TaskPhase.RUNNING;
    }

}

export = TaskStatus;
