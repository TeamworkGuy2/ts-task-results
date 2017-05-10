import Q = require("q");
import TaskStatus = require("./TaskStatus");

/** Task class for a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
class Task<R, S> {
    public static isPromise: (obj: any) => obj is Q.IPromise<any> = <any>Q.isPromiseAlike;

    private action: (() => R) | Q.IPromise<R>;
    private isPromise: boolean;
    private actionDfd: Task.Deferred<R, S>;
    private _name: string;
    private _status: TaskStatus;
    private result: R;
    private error: S;


    constructor(name: string, action: (() => R) | Q.IPromise<R>, dfd: Q.Deferred<R> = Q.defer<R>()) {
        this._name = name;
        this.action = action;
        this.actionDfd = dfd;
        this.isPromise = Task.isPromise(action);
        this._status = TaskStatus.CREATED;

        this.start = this.start.bind(this);
    }


    get status(): TaskStatus {
        return this._status;
    }

    get name(): string {
        return this._name;
    }


    public start(): Q.IPromise<R> {
        var that = this;
        if (this._status !== TaskStatus.CREATED) {
            throw new Error("task has already been started, cannot start task more than once");
        }

        function taskCompleted(res: R) {
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
            (<Q.IPromise<R>><any>this.action).then(taskCompleted, taskErrored);
        }
        else {
            try {
                this._status = TaskStatus.RUNNING;
                var res = (<() => R><any>this.action)();
                taskCompleted(res);
            } catch (e) {
                taskErrored(e);
            }
        }

        return this.actionDfd.promise;
    }


    public isSettled(): boolean {
        return this._status.isSettled();
    }


    public getPromise(): Task.Promise<R, S> {
        return this.actionDfd.promise;
    }


    public getResult(): R {
        return this.result;
    }


    public getError(): S {
        return this.error;
    }

}

module Task {

    /** Extension of Q.Promise that has an error type
     * @since 2015-3-16
     */
    export interface Promise<T, R> extends Q.Promise<T> {
        then<U>(onFulfill?: (value: T) => U | Q.IPromise<U>, onReject?: (error: R) => U | Q.IPromise<U>, onProgress?: Function): Q.Promise<U>;
    }


    /** Extension of Q.Deferred that has an error type
     * @since 2015-3-16
     */
    export interface Deferred<T, R> extends Q.Deferred<T> {
        promise: Task.Promise<T, R>;
        reject(reason: R): void;
    }

}

export = Task;
