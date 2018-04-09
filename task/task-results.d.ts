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


/** The state of a task (whether it is executing, awaiting execution, paused, completed, failed, canceled, etc)
 */
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
    /** The current state of this task */
    readonly state: TaskState;
    /** The name of this task */
    readonly name: string;

    /** Start this task, can only be called once per task instance, subsequent calls throw an error
     * @returns a promise which completes or fails when the task completes or fails
     */
    start(): PsPromise<R, S>;

    /** Check whether the task has completed or failed */
    isSettled(): boolean;

    /** Get the promise associated with this task, same promise returned by the initial call to 'start()' */
    getPromise(): PsPromise<R, S>;

    /** Returns the task's result after it completes (if it is successful, does not throw an error), else returns undefined */
    getResult(): R | null | undefined;

    /** Returns the task's error if it fails (throws an error), else returns undefined */
    getError(): S | null | undefined;
}

type _Task<R, S> = Task<R, S>;


/** A set of tasks where all tasks return the same result type.
 * The advantage of a TaskSet over a Promise[] is that a task set provides listeners for start, completion, and failure events to be intercepted for logging or other purposes
 * @since 2016-09-24
 * @template T the type of result returned by the tasks in this task set
 * @template S the type of error throw by the tasks in this task set
 */
interface TaskSet<T, S> {
    /** The maximum number of completed tasks which can be saved by this task set and retrieved via getCompletedTasks().
     * If this value is 0, then no task history is kept.
     * If this value is -1, then all task history is kept
     */
    maxCompletedTasks: number;
    /** The percentage of 'maxCompletedTasks' to drop from the 'tasksCompleted' array when it's full. Must be between [0, 1] */
    dropCompletedTasksPercentage: number;

    /** @returns a list of completed tasks, possibly only containing a limited number of the most recently completed tasks based on the max tasks completed limit.
     * @see #getMaxTasksCompletedSize()
     */
    getCompletedTasks(): { name: string; task: TaskResults.Task<T, S> }[]

    /** Clear the completed tasks array and reset the completed task count to 0 */
    clearCompletedTasks(): void;

    /** This is the total number of tasks completed regardless of the max tasks completed limit */
    getCompletedTaskCount(): number;

    /** Check whether a specific task or, if no name is provided, if any tasks, are currently in progress
     * @param [taskName] optional name of the task to check
     */
    isRunning(taskName?: string): boolean;

    /** All of the currently in progress tasks flattened into an array of objects with 'name' and 'task' properties */
    getInProgressTasks(): { name: string; task: TaskResults.Task<T, S> }[];

    /** All of the currently in-progress tasks */
    getTasks(): Map<string, TaskResults.Task<T, S>>;

    /** Return an array of promises from all of the currently in-progress tasks */
    getPromises(): PsPromise<T, S>[];

    /** Start a task based on a promise, the task is started and added to this task set's internal list of in-progress tasks
     * @param taskName the name of the task
     * @param taskPromise the promise which the new task will be based on, when this promise completes/fails, the task will complete/fail
     */
    startTask(taskName: string, task: (() => T) | PsPromise<T, S>): TaskResults.Task<T, S>;

    getTaskStartedCallback(): ((taskName: string) => void) | undefined;
    getTaskCompletedCallback(): ((taskName: string) => void) | undefined;
    getTaskFailedCallback(): ((taskName: string) => void) | undefined;

    setTaskStartedCallback(cb: (taskname: string) => void): void;
    setTaskCompletedCallback(cb: (taskname: string) => void): void;
    setTaskFailedCallback(cb: (taskname: string) => void): void;
}

type _TaskSet<T, S> = TaskSet<T, S>;


declare module TaskResults {
    export type Task<R, S> = _Task<R, S>;
    export type TaskSet<R, S> = _TaskSet<R, S>;
    export type TaskState = _TaskState;
}