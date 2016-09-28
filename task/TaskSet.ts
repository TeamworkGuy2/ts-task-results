/// <reference path="../../ts-promises/ts-promises.d.ts" />

import Defer = require("../../ts-promises/Defer");
import Task = require("./Task");

/** A set of tasks where all tasks return the same result type.
 * The advantage of a TaskSet over a Promise[] is that a task set provides listeners for start, completion, and failure events to be intercepted for logging or other purposes
 * @since 2016-09-24
 * @param <T> the type of result returned by the tasks in this task set
 * @param <S> the type of error throw by the tasks in this task set
 */
class TaskSet<T, S> {
    /** The maximum number of completed tasks which can be saved by this task set and retrieved via {@code getCompletedTasks()}.
     * If this value is 0, then no task history is kept.
     * If this value is -1, then all task history is kept
     */
    public maxCompletedTasks: number = 200;
    /** The percentage of 'maxCompletedTasks' to drop from the 'tasksCompleted' array when it becomes full. Must be between [0, 1]
     */
    public dropCompletedTasksPercentage: number = 0.5;

    private tasksInProgress: Map<string, Task<T, S>>;
    private tasksCompleted: { name: string; task: Task<T, S> }[];
    private tasksCompletedCount: number = 0;
    private taskStartedCallback: (taskName: string) => void;
    private taskCompletedCallback: (taskName: string) => void;
    private taskFailedCallback: (taskName: string) => void;


    /** Create an empty task set with option started, completed, and failed callbacks
     * @param [taskStartedCb] a function to call when a task starts (i.e. when startTask() is called)
     * @param [taskCompletedCb] a function to call when a task completes
     * @param [taskFailedCb] a function to call when a task fails
     */
    constructor(taskStartedCb?: (taskName: string) => void, taskCompletedCb?: (taskName: string) => void, taskFailedCb?: (taskName: string) => void) {
        this.tasksInProgress = new Map<string, Task<T, S>>();
        this.tasksCompleted = [];
        this.taskStartedCallback = taskStartedCb;
        this.taskCompletedCallback = taskCompletedCb;
        this.taskFailedCallback = taskFailedCb;
    }


    public getTaskStartedCallback(): (taskName: string) => void {
        return this.taskStartedCallback;
    }


    public setTaskStartedCallback(cb: (taskname: string) => void): void {
        TaskSet.checkCallback(cb, "task started");
        this.taskStartedCallback = cb;
    }


    public getTaskCompletedCallback(): (taskName: string) => void {
        return this.taskCompletedCallback;
    }


    public setTaskCompletedCallback(cb: (taskname: string) => void): void {
        TaskSet.checkCallback(cb, "task completed");
        this.taskCompletedCallback = cb;
    }


    public getTaskFailedCallback(): (taskName: string) => void {
        return this.taskFailedCallback;
    }


    public setTaskFailedCallback(cb: (taskname: string) => void): void {
        TaskSet.checkCallback(cb, "task failed");
        this.taskFailedCallback = cb;
    }


    /** @return a list of completed tasks, possibly only containing a limited number of the most recently completed tasks based on the max tasks completed limit.
     * @ee #getMaxTasksCompletedSize()
     */
    public getCompletedTasks(): { name: string; task: Task<T, S> }[] {
        return this.tasksCompleted;
    }


    /** Clear the completed tasks array and reset the completed task count to 0
     */
    public clearCompletedTasks(): void {
        this.tasksCompleted = [];
        this.tasksCompletedCount = 0;
    }


    /** This is the total number of tasks completed regardless of the max tasks completed limit
     */
    public getCompletedTaskCount(): number {
        return this.tasksCompletedCount;
    }


    /** Check whether a specific task or, if no name is provided, if any tasks, are currently in progress
     * @param [taskName] optional name of the task to check
     */
    public isRunning(taskName?: string): boolean {
        if (taskName != null) {
            return this.tasksInProgress.get(taskName) != null ? this.tasksInProgress.get(taskName).status.isRunning() : false;
        }
        else {
            return this.tasksInProgress.size > 0;
        }
    }


    /** All of the currently in progress tasks flattened into an array of objects with 'name' and 'task' properties
     */
    public getInProgressTasks(): { name: string; task: Task<T, S> }[] {
        var res: { name: string; task: Task<T, S> }[] = [];
        this.tasksInProgress.forEach((task, name) => {
            res.push({ name, task });
        });
        return res;
    }


    /** All of the currently in-progress tasks
     */
    public getTasks(): Map<string, Task<T, S>> {
        return this.tasksInProgress;
    }


    /** Return an array of promises from all of the currently in-progress tasks
     */
    public getPromises(): PsPromise<T, S>[] {
        var promises: Task.Promise<T, S>[] = [];
        this.tasksInProgress.forEach((task) => promises.push(task.getPromise()));
        return promises;
    }


    /** Start a task based on a promise, the task is started and added to this task set's internal list of in-progress tasks
     * @param taskName the name of the task
     * @param taskPromise the promise which the new task will be based on, when this promise completes/fails, the task will complete/fail
     */
    public startTask(taskName: string, task: (() => T) | PsPromise<T, S>): Task<T, S> {
        var that = this;

        function taskDone<E1>(res: E1): E1 {
            // keep a log of completed tasks
            that.saveCompletedTask(taskName, newTask);

            // remove the completed task
            that.tasksInProgress.delete(taskName);
            that.callTaskCompleted(taskName);

            return res;
        }

        function taskError<E1>(err: E1): E1 {
            // remove failed task
            that.tasksInProgress.delete(taskName);
            that.callTaskFailed(taskName);

            throw err;
        }

        // handle promises or functions
        var taskWrapped = Task.isPromise(task) ? task.then(taskDone, taskError) : function taskWrapper() {
            try {
                var res = task();
                return taskDone(res);
            } catch (e) {
                taskError(e);
            }
        };

        // create and start the task
        var newTask = new Task<T, S>(taskName, taskWrapped);

        newTask.start();

        this.tasksInProgress.set(taskName, newTask);
        this.callTaskStarted(taskName);

        return newTask;
    }


    private saveCompletedTask(taskName: string, newTask: Task<T, S>) {
        this.tasksCompletedCount++;

        if (this.maxCompletedTasks !== 0) {
            this.tasksCompleted.push({
                name: taskName,
                task: newTask
            });
            // drop the older half of the task history array when full
            var taskCount = this.tasksCompleted.length;
            if (this.maxCompletedTasks > -1 && taskCount > this.maxCompletedTasks) {
                var mustDrop = taskCount - this.maxCompletedTasks;
                var percentCount = Math.round(this.maxCompletedTasks * this.dropCompletedTasksPercentage);
                this.tasksCompleted = this.tasksCompleted.slice(mustDrop + percentCount, taskCount);
            }
        }
    }


    private callTaskStarted(taskName: string): void {
        if (this.taskStartedCallback) {
            try {
                this.taskStartedCallback(taskName);
            } catch (e) {
                // Do nothing
            }
        }
    }


    private callTaskCompleted(taskName: string): void {
        if (this.taskCompletedCallback) {
            try {
                this.taskCompletedCallback(taskName);
            } catch (e) {
                // Do nothing
            }
        }
    }


    private callTaskFailed(taskName: string): void {
        if (this.taskFailedCallback) {
            try {
                this.taskFailedCallback(taskName);
            } catch (e) {
                // Do nothing
            }
        }
    }


    /** Check if a function argument is a non-null function */
    private static checkCallback(cb: any, msg: string) {
        if (typeof cb !== "function") {
            throw new Error(msg + " callback argument must be a function");
        }
    }

}

export = TaskSet;