/// <reference types="q" />
/// <reference path="../../ts-promises/ts-promises.d.ts" />

/** A task result containing either a return value or an error
 * @template R the result type
 * @template E the error type
 */
interface ResultOrError<R, E> {
    /** True if there is no error (does not mean 'result' is non-null), false if there is an error */
    hasResult: boolean;
    result: R;
    error: E;
}


/** A task result containing either a returned array of values or an array of errors
 * @template R the result array element type
 * @template E the error array element type
 */
interface ResultsAndErrors<R, E> {
    results: R[];
    errors: E[];
}


/** The state of a task (whether it is executing, awaiting execution, paused, completed, failed, canceled, etc) */
interface TaskState {
    /** True indicates a state of completion/failure/cancelation, false indicates any other state */
    isSettled(): boolean;
    /** True indicates a state of running/execution, false indicates any other state */
    isRunning(): boolean;
}

type _TaskState = TaskState;


/** Task interface for executing and monitoring the state and result/failure of a synchronous or asynchronous task
 * @template R the type of data returned by this task if it succeeds
 * @template S the type of error throw by this task if it fails
 * @author TeamworkGuy2
 * @since 2017-08-06
 */
interface Task<R, S> {
    //new (name: string, action: (() => R) | Q.IPromise<R>, dfd?: Q.Deferred<R>): Task<R, S>;

    /** The current state of this task */
    readonly state: TaskState;
    /** The name of this task */
    readonly name: string;

    /** Start this task, can only be called once per task instance, subsequent calls throw an error
     * @returns a promise which completes or fails when the task completes or fails
     */
    start(): Q.IPromise<R>;

    /** Check whether the task has completed or failed */
    isSettled(): boolean;

    /** Get the promise associated with this task, same promise returned by the initial call to 'start()' */
    getPromise(): Task.Promise<R, S>;

    /** Returns the task's result after it completes (if it is successful, does not throw an error), else returns undefined */
    getResult(): R;

    /** Returns the task's error if it fails (throws an error), else returns undefined */
    getError(): S;
}

declare module Task {

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

type _Task<R, S> = Task<R, S>;


declare module TaskResults {
    export type Task<R, S> = _Task<R, S>;
    export type TaskState = _TaskState;
}