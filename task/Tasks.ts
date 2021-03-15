/// <reference path="./task-results.d.ts" />
import Task = require("./Task");
import TaskSet = require("./TaskSet");

module Tasks {

    /** Create a task
     * @param name the name of the task
     * @param action the unit of work performed by this task, a function or promise 
     * @param dfd IDeferred for tracking the completion/failure of the task, if not provided a default will be created using 'Q.defer()'
     */
    export function startTask<R1, S1>(name: string, action: PsPromise<R1, S1>): TaskResults.Task<R1, S1> {
        return Task.startTask(name, action);
    }


    /** Create a task set
     * @param name the name of the task set
     * @param action the unit of work performed by this task, a function or promise 
     * @param [dfd] an optional Deferred to use for tracking the completion/failure of the task, if not provided a default will be created using 'Q.defer()'
     */
    export function newTaskSet<R1, S1>(taskStartedCb?: (taskName: string) => void, taskCompletedCb?: (taskName: string) => void, taskFailedCb?: (taskName: string) => void): TaskResults.TaskSet<R1, S1> {
        return new TaskSet<R1, S1>(taskStartedCb, taskCompletedCb, taskFailedCb);
    }

}

export = Tasks;