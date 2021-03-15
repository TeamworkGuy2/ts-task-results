import chai = require("chai");
import mocha = require("mocha");
import Q = require("q");
import Defer = require("ts-promises/Defer");
import Tasks = require("../task/Tasks");
import TaskSet = require("../task/TaskSet");

var asr = chai.assert;

suite("TaskSet", function TaskSetTest() {

    function createTaskRes1<E1>(res: E1) {
        return <PsPromise<E1, any>>Q.resolve(res);
    }

    function createTaskRes2<E1>(res: E1, waitMillis: number) {
        var dfd = Q.defer<E1>();
        setTimeout(() => dfd.resolve(res), waitMillis);
        return <PsPromise<E1, any>>dfd.promise;
    }

    function createTaskErr1<E1>(res: E1) {
        return <PsPromise<any, E1>>Q.reject(res);
    }

    function createTaskErr2<E1>(res: E1, waitMillis: number) {
        var dfd = Q.defer<E1>();
        setTimeout(() => dfd.reject(res), waitMillis);
        return <PsPromise<any, E1>>dfd.promise;
    }


    function startTasks(taskSet: TaskSet<string, string>, namePrefix: string, resMsgPrefix: string, count: number): Task<string, string>[] {
        var tasks: Task<string, string>[] = [];
        for (var i = 0; i < count; i++) {
            var rr = Math.random() < 0.5 ? createTaskRes1(resMsgPrefix + i) : createTaskRes2(resMsgPrefix + i, Math.round(Math.random() * 10));
            var t = taskSet.startTask(namePrefix + i, rr);
            tasks.push(t);
        }
        return tasks;
    }


    test("README-example", function README_exampleTest(done) {
        var taskSet = new TaskSet<string, string>(null, (name) => console.log("success:", name), (name) => console.log("failure:", name));
        taskSet.startTask("task-1", Tasks.startTask<string, string>("a", createTaskRes1("result a")).getPromise());
        taskSet.startTask("task-2", createTaskRes1("result b"));
        taskSet.startTask("task-3", createTaskRes1("error c"));

        Q.all(<PromiseLike<any>[]>taskSet.getPromises())
            .then((results) => { console.log("done:", results); done(); }, (err) => { console.error("error:", err); done(); });
    });


    test("task-set-function-and-promise-task-mix", function taskSetFunctionAndPromiseTaskMixTest(done) {
        var taskSet = new TaskSet<string, string>(null, null, null);
        taskSet.startTask("task-1", createTaskRes1("result a"));
        taskSet.startTask("task-2", Tasks.startTask<string, string>("b", createTaskRes1("result b")).getPromise());
        taskSet.startTask("task-3", createTaskRes1("result c"));
        taskSet.startTask("task-4", createTaskErr1("error d"));

        asr.equal(taskSet.getTasks().size, 4);
        asr.equal(taskSet.getPromises().length, taskSet.getTasks().size);

        Q.all(<PromiseLike<any>[]>taskSet.getPromises()).done((results) => {
            done("unexpected success");
        }, (err) => {
            Q.all(<PromiseLike<any>[]>taskSet.getPromises()).done((results) => {
                var allResults = taskSet.getCompletedTasks().map((t) => t.task.getResult());
                asr.deepEqual(allResults.sort(), ["result a", "result b", "result c"]);
                asr.equal(err, "error d");
                done();
            }, (err2) => {
                done("unexpected 2nd error");
            });
        });
    });


    test("task-set-success", function taskSetSuccessTest(done) {
        // test success
        var taskSet = new TaskSet<string, string>();
        var task1 = taskSet.startTask("task-res-1", createTaskRes1("success-1"));
        var task2 = taskSet.startTask("task-res-2", createTaskRes2("success-2", 10));

        Defer.when(taskSet.getPromises()).then(function (res) {
            asr.deepEqual(res.sort(), ["success-1", "success-2"]);

            asr.equal(task1.getResult(), "success-1");
            asr.equal(task1.state, "COMPLETED");

            asr.equal(task2.getResult(), "success-2");
            asr.equal(task2.state, "COMPLETED");
            done();
        }, function (err) {
            done("unexpected error");
        });
    });


    test("task-set-failure", function taskSetFailureTest(done) {
        // test success
        var taskSet = new TaskSet<string, string>();
        var task1 = taskSet.startTask("task-res-1", createTaskRes1("success-1"));
        var task2 = taskSet.startTask("task-res-2", createTaskRes2("success-2", 10));
        var task3 = taskSet.startTask("task-err-1", createTaskErr1("error-1"));
        var task4 = taskSet.startTask("task-err-2", createTaskErr2("error-2", 10));

        Defer.when(taskSet.getPromises()).then(function (res) {
            done("unexpected success");
        }, function (err) {
            asr.isTrue(err == "error-1" || err == "error-2");
            done();
        });
    });


    test("task-drop-completed", function taskSetDropCompleted(done) {
        var taskSet = new TaskSet<string, string>();
        // test 4 tasks, limit 3, drop 25%
        taskSet.maxCompletedTasks = 3;
        taskSet.dropCompletedTasksPercentage = 0.25;
        startTasks(taskSet, "task-res-", "success-", 4);

        Defer.when(taskSet.getPromises()).then(function (res) {
            asr.equal(taskSet.getCompletedTasks().length, 2);
            taskSet.clearCompletedTasks();
        }).then(function () {
            // test 6 tasks, limit 5, drop 60%
            taskSet.maxCompletedTasks = 5;
            taskSet.dropCompletedTasksPercentage = 0.6;
            startTasks(taskSet, "task-res-", "success-", 6);

            return <Q.IPromise<string[]>>Defer.when(taskSet.getPromises());
        }).then(function (res) {
            asr.equal(taskSet.getCompletedTasks().length, 2);
            taskSet.clearCompletedTasks();
            done();
        }, function (err) {
            done("unexpected error");
        });
    });

});
