import Q = require("q");

/** Task implementation for a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
class Task<R, S> implements TaskResults.Task<R, S> {
    public static isPromise: (obj: any) => obj is PromiseLike<any> = Q.isPromiseAlike;

    private action: (() => R) | Q.IPromise<R>;
    private actionDfd: PsDeferred<R, S>;
    private result: R | null | undefined;
    private error: S | null | undefined;

    public name: string;
    public state: TaskState;


    constructor(name: string, action: (() => R) | Q.IPromise<R>, dfd: Q.Deferred<R> | PsDeferred<R, S> = Q.defer<R>()) {
        this.name = name;
        this.state = "CREATED";
        this.action = action;
        this.actionDfd = <PsDeferred<R, S>><any>dfd;
        this.result = undefined;
        this.error = undefined;
    }


    public start(): PsPromise<R, S> {
        var that = this;
        if (this.state !== "CREATED") {
            throw new Error("task has already been started, cannot start task more than once");
        }

        // resolve/reject run on next tick so 'action' functions that return immediately don't cause TaskSet.getPromises() to return bad results
        function taskCompleted(res: R) {
            that.state = "COMPLETED";
            that.result = res != null ? res : null;
            that.actionDfd.resolve(res);
        }

        function taskErrored(err: any) {
            that.state = "ERRORED";
            that.error = err != null ? err : null;
            that.actionDfd.reject(err);
        }

        this.state = "AWAITING_EXECUTION";

        if (Task.isPromise(this.action)) {
            this.state = "RUNNING"; // TODO technically incorrect, we don't know when the task will run in the browser/node/other.
            (<Q.IPromise<R>><any>this.action).then(taskCompleted, taskErrored);
        }
        else {
            try {
                this.state = "RUNNING";
                var res = (<() => R><any>this.action)();
                taskCompleted(res);
            } catch (e) {
                taskErrored(e);
            }
        }

        return this.actionDfd.promise;
    }


    public isSettled(): boolean {
        return Task.isSettled(this.state);
    }


    public getPromise(): PsPromise<R, S> {
        return this.actionDfd.promise;
    }


    public getResult(): R | null | undefined {
        return this.result;
    }


    public getError(): S | null | undefined {
        return this.error;
    }


    public static isSettled(state: TaskState): state is TaskStateSettled {
        return state === "CANCELED" || state === "ERRORED" || state === "COMPLETED";
    }


    public static isRunning(state: TaskState): state is TaskStateRunning {
        return state === "RUNNING" || state === "AWAITING_SCHEDULING" || state === "AWAITING_CHILDREN_COMPLETION" || state === "AWAITING_EXECUTION";
    }

}

export = Task;
