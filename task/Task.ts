import Q = require("q");
import TaskState = require("./TaskState");

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
        this.state = TaskState.CREATED;
        this.action = action;
        this.actionDfd = <PsDeferred<R, S>><any>dfd;
        this.result = undefined;
        this.error = undefined;
    }


    public start(): PsPromise<R, S> {
        var that = this;
        if (this.state !== TaskState.CREATED) {
            throw new Error("task has already been started, cannot start task more than once");
        }

        // resolve/reject run on next tick so 'action' functions that return immediately don't cause TaskSet.getPromises() to return bad results
        function taskCompleted(res: R) {
            that.state = TaskState.COMPLETED;
            that.result = res != null ? res : null;
            that.actionDfd.resolve(res);
        }

        function taskErrored(err: any) {
            that.state = TaskState.ERRORED;
            that.error = err != null ? err : null;
            that.actionDfd.reject(err);
        }

        this.state = TaskState.AWAITING_EXECUTION;

        if (Task.isPromise(this.action)) {
            this.state = TaskState.RUNNING; // TODO technically incorrect, we don't know when the task will run in the browser/node/rhino/etc.
            (<Q.IPromise<R>><any>this.action).then(taskCompleted, taskErrored);
        }
        else {
            try {
                this.state = TaskState.RUNNING;
                var res = (<() => R><any>this.action)();
                taskCompleted(res);
            } catch (e) {
                taskErrored(e);
            }
        }

        return this.actionDfd.promise;
    }


    public isSettled(): boolean {
        return this.state.isSettled();
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

}

export = Task;
