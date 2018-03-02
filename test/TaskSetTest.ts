import chai = require("chai");
import mocha = require("mocha");
import Q = require("q");
import TaskSet = require("../task/TaskSet");
import TaskState = require("../task/TaskState");


var asr = chai.assert;


suite("TaskSet", function TaskSetTest() {

    function createTaskRes1<E1>(res: E1) {
        return () => res;
    }

    function createTaskRes2<E1>(res: E1, waitMillis: number) {
        var dfd = Q.defer<E1>();
        setTimeout(() => dfd.resolve(res), waitMillis);
        return dfd.promise;
    }

    function createTaskErr1<E1>(res: E1) {
        return () => res;
    }

    function createTaskErr2<E1>(res: E1, waitMillis: number) {
        var dfd = Q.defer<E1>();
        setTimeout(() => dfd.reject(res), waitMillis);
        return dfd.promise;
    }


    function startTasks(taskSet: TaskSet<string, string>, namePrefix: string, resMsgPrefix: string, count: number): Task<string, string>[] {
        var tasks: Task<string, string>[] = [];
        for (var i = 0; i < count; i++) {
            var t = taskSet.startTask(namePrefix + i, Math.random() < 0.5 ? createTaskRes1(resMsgPrefix + i) : createTaskRes2(resMsgPrefix + i, Math.round(Math.random() * 10)));
            tasks.push(t);
        }
        return tasks;
    }


    test("task-set-success", function taskSetSuccessTest(done) {
        // test success
        var taskSet = new TaskSet<string, string>();
        var task1 = taskSet.startTask("task-res-1", createTaskRes1("success-1"));
        var task2 = taskSet.startTask("task-res-2", createTaskRes2("success-2", 10));

        Q.all(taskSet.getPromises()).done(function (res) {
            asr.deepEqual(res.sort(), ["success-1", "success-2"]);

            asr.equal(task1.getResult(), "success-1");
            asr.equal(task1.state, TaskState.COMPLETED);

            asr.equal(task2.getResult(), "success-2");
            asr.equal(task2.state, TaskState.COMPLETED);
            done();
        }, function (err) {
            asr.equal(true, false, "unexpected error");
            done();
        });
    });


    test("task-set-failure", function taskSetFailureTest(done) {
        // test success
        var taskSet = new TaskSet<string, string>();
        var task1 = taskSet.startTask("task-res-1", createTaskRes1("success-1"));
        var task2 = taskSet.startTask("task-res-2", createTaskRes2("success-2", 10));
        var task3 = taskSet.startTask("task-err-1", createTaskErr1("error-1"));
        var task4 = taskSet.startTask("task-err-2", createTaskErr2("error-2", 10));

        Q.all(taskSet.getPromises()).done(function (res) {
            asr.equal(true, false, "unexpected success");
            done();
        }, function (err) {
            asr.equal(true, err == "error-1" || err == "error-2");
            done();
        });
    });


    test("task-drop-completed", function taskSetDropCompleted(done) {
        var taskSet = new TaskSet<string, string>();
        // test 4 tasks, limit 3, drop 25%
        taskSet.maxCompletedTasks = 3;
        taskSet.dropCompletedTasksPercentage = 0.25;
        startTasks(taskSet, "task-res-", "success-", 4);

        Q.all(taskSet.getPromises()).then(function (res) {
            asr.equal(taskSet.getCompletedTasks().length, 2);
            taskSet.clearCompletedTasks();
        }).then(function () {
            // test 6 tasks, limit 5, drop 60%
            taskSet.maxCompletedTasks = 5;
            taskSet.dropCompletedTasksPercentage = 0.6;
            startTasks(taskSet, "task-res-", "success-", 6);

            return <Q.IPromise<string[]>>Q.all(taskSet.getPromises());
        }).done(function (res) {
            asr.equal(taskSet.getCompletedTasks().length, 2);
            taskSet.clearCompletedTasks();
            done();
        }, function (err) {
            asr.equal(false, true, "unexpected error");
            done();
        });
    });

});
