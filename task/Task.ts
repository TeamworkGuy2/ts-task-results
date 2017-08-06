import Q = require("q");
import TaskState = require("./TaskState");

/** Task implementation for a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
class Task<R, S> implements TaskResults.Task<R, S> {
    public static isPromise: (obj: any) => obj is Q.IPromise<any> = <any>Q.isPromiseAlike;

    private action: (() => R) | Q.IPromise<R>;
    private isPromise: boolean;
    private actionDfd: Task.Deferred<R, S>;
    private result: R;
    private error: S;

    public name: string;
    public state: TaskState;


    private constructor(name: string, action: (() => R) | Q.IPromise<R>, dfd: Q.Deferred<R> = Q.defer<R>()) {
        this.name = name;
        this.state = TaskState.CREATED;
        this.action = action;
        this.actionDfd = dfd;
        this.isPromise = Task.isPromise(action);
        this.result = undefined;
        this.error = undefined;
    }


    public start(): Q.IPromise<R> {
        var that = this;
        if (this.state !== TaskState.CREATED) {
            throw new Error("task has already been started, cannot start task more than once");
        }

        function taskCompleted(res: R) {
            that.state = TaskState.COMPLETED;
            that.result = res;
            that.actionDfd.resolve(res);
        }

        function taskErrored(err) {
            that.state = TaskState.ERRORED;
            that.error = err;
            that.actionDfd.reject(err);
        }

        this.state = TaskState.AWAITING_EXECUTION;

        if (this.isPromise) {
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


    public getPromise(): Task.Promise<R, S> {
        return this.actionDfd.promise;
    }


    public getResult(): R {
        return this.result;
    }


    public getError(): S {
        return this.error;
    }


    /** Create a task
     * @param name the name of the task
     * @param action the unit of work performed by this task, a function or promise 
     * @param [dfd] an optional Deferred to use for tracking the completion/failure of the task, if not provided a default will be created using 'Q.defer()'
     */
    public static newTask<R1, S1>(name: string, action: (() => R1) | Q.IPromise<R1>, dfd: Q.Deferred<R1> = Q.defer<R1>()): TaskResults.Task<R1, S1> {
        return new Task<R1, S1>(name, action, dfd);
    }

}

export = Task;
