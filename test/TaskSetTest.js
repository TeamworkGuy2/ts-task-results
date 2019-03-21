"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Q = require("q");
var Defer = require("ts-promises/Defer");
var Tasks = require("../task/Tasks");
var TaskSet = require("../task/TaskSet");
var TaskState = require("../task/TaskState");
var asr = chai.assert;
suite("TaskSet", function TaskSetTest() {
    function createTaskRes1(res) {
        return function () { return res; };
    }
    function createTaskRes2(res, waitMillis) {
        var dfd = Q.defer();
        setTimeout(function () { return dfd.resolve(res); }, waitMillis);
        return dfd.promise;
    }
    function createTaskErr1(res) {
        return function () { return res; };
    }
    function createTaskErr2(res, waitMillis) {
        var dfd = Q.defer();
        setTimeout(function () { return dfd.reject(res); }, waitMillis);
        return dfd.promise;
    }
    function startTasks(taskSet, namePrefix, resMsgPrefix, count) {
        var tasks = [];
        for (var i = 0; i < count; i++) {
            var t = taskSet.startTask(namePrefix + i, Math.random() < 0.5 ? createTaskRes1(resMsgPrefix + i) : createTaskRes2(resMsgPrefix + i, Math.round(Math.random() * 10)));
            tasks.push(t);
        }
        return tasks;
    }
    test("README-example", function README_exampleTest(done) {
        var taskSet = new TaskSet(null, function (name) { return console.log("success:", name); }, function (name) { return console.log("failure:", name); });
        taskSet.startTask("task-1", Tasks.newTask("a", function () { return "result a"; }).start());
        taskSet.startTask("task-2", Q.resolve("result b"));
        taskSet.startTask("task-3", Q.reject("error c"));
        Q.all(taskSet.getPromises())
            .then(function (results) { console.log("done:", results); done(); }, function (err) { console.error("error:", err); done(); });
    });
    test("task-set-function-and-promise-task-mix", function taskSetFunctionAndPromiseTaskMixTest(done) {
        var taskSet = new TaskSet(null, null, null);
        taskSet.startTask("task-1", function () { return "result a"; });
        taskSet.startTask("task-2", Tasks.newTask("b", function () { return "result b"; }).start());
        taskSet.startTask("task-3", Q.resolve("result c"));
        taskSet.startTask("task-4", Q.reject("error d"));
        asr.equal(taskSet.getTasks().size, 4);
        asr.equal(taskSet.getPromises().length, taskSet.getTasks().size);
        Q.all(taskSet.getPromises()).done(function (results) {
            done("unexpected success");
        }, function (err) {
            Q.all(taskSet.getPromises()).done(function (results) {
                var allResults = taskSet.getCompletedTasks().map(function (t) { return t.task.getResult(); });
                asr.deepEqual(allResults.sort(), ["result a", "result b", "result c"]);
                asr.equal(err, "error d");
                done();
            }, function (err2) {
                done("unexpected 2nd error");
            });
        });
    });
    test("task-set-success", function taskSetSuccessTest(done) {
        // test success
        var taskSet = new TaskSet();
        var task1 = taskSet.startTask("task-res-1", createTaskRes1("success-1"));
        var task2 = taskSet.startTask("task-res-2", createTaskRes2("success-2", 10));
        Defer.when(taskSet.getPromises()).done(function (res) {
            asr.deepEqual(res.sort(), ["success-1", "success-2"]);
            asr.equal(task1.getResult(), "success-1");
            asr.equal(task1.state, TaskState.COMPLETED);
            asr.equal(task2.getResult(), "success-2");
            asr.equal(task2.state, TaskState.COMPLETED);
            done();
        }, function (err) {
            done("unexpected error");
        });
    });
    test("task-set-failure", function taskSetFailureTest(done) {
        // test success
        var taskSet = new TaskSet();
        var task1 = taskSet.startTask("task-res-1", createTaskRes1("success-1"));
        var task2 = taskSet.startTask("task-res-2", createTaskRes2("success-2", 10));
        var task3 = taskSet.startTask("task-err-1", createTaskErr1("error-1"));
        var task4 = taskSet.startTask("task-err-2", createTaskErr2("error-2", 10));
        Defer.when(taskSet.getPromises()).done(function (res) {
            done("unexpected success");
        }, function (err) {
            asr.isTrue(err == "error-1" || err == "error-2");
            done();
        });
    });
    test("task-drop-completed", function taskSetDropCompleted(done) {
        var taskSet = new TaskSet();
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
            return Defer.when(taskSet.getPromises());
        }).done(function (res) {
            asr.equal(taskSet.getCompletedTasks().length, 2);
            taskSet.clearCompletedTasks();
            done();
        }, function (err) {
            done("unexpected error");
        });
    });
});
