
/** Task implementation for a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
class Task<R, S> implements TaskResults.Task<R, S> {
    private originalAction: PsPromise<R, S>;
    private action: PsPromise<R, S>;
    private result: R | null | undefined;
    private error: S | null | undefined;

    public name: string;
    public state: TaskState;


    private constructor(name: string, action: PsPromise<R, S>) {
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
    public start(): PsPromise<R, S> {
        var that = this;
        if (this.state !== "CREATED") {
            throw new Error("task has already been started, cannot start task more than once");
        }

        // resolve/reject run on next tick so 'action' functions that return immediately don't cause TaskSet.getPromises() to return bad results
        function taskCompleted(res: R) {
            that.state = "COMPLETED";
            that.result = res != null ? res : null;
            return res;
        }

        function taskErrored(err: S): Throws<S> {
            that.state = "ERRORED";
            that.error = err != null ? err : null;
            throw err;
        }

        this.state = "AWAITING_EXECUTION";

        this.state = "RUNNING"; // TODO technically incorrect, we don't know when the task will run in the browser/node/other.
        this.action = <PsPromise<any, any>>this.action.then(taskCompleted, taskErrored);
        return this.action;
    }


    public isSettled(): boolean {
        return Task.isSettled(this.state);
    }


    public getPromise(): PsPromise<R, S> {
        return this.action;
    }


    public getResult(): R | null | undefined {
        return this.result;
    }


    public getError(): S | null | undefined {
        return this.error;
    }


    /** Create and start a task
     * @param name the name of the task
     * @param action the unit of work performed by this task, a function or promise 
     * @param dfd IDeferred for tracking the completion/failure of the task, if not provided a default will be created using 'Q.defer()'
     */
    public static startTask<R1, S1>(name: string, action: PsPromise<R1, S1>): TaskResults.Task<R1, S1> {
        var task = new Task<R1, S1>(name, action);
        task.start();
        return task;
    }


    public static isSettled(state: TaskState): state is TaskStateSettled {
        return state === "CANCELED" || state === "ERRORED" || state === "COMPLETED";
    }


    public static isRunning(state: TaskState): state is TaskStateRunning {
        return state === "RUNNING" || state === "AWAITING_SCHEDULING" || state === "AWAITING_EXECUTION";
    }


    public static isPromise(obj: any): obj is PromiseLike<any> {
        return obj === Object(obj) && typeof obj.then === "function";
    }

}

export = Task;
