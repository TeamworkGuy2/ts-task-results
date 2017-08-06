"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Q = require("q");
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
    test("task-set-success", function taskSetSuccessTest(done) {
        // test success
        var taskSet = new TaskSet();
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
        var taskSet = new TaskSet();
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
        var taskSet = new TaskSet();
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
            return Q.all(taskSet.getPromises());
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
