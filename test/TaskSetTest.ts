/// <reference path="../../definitions/chai/chai.d.ts" />
/// <reference path="../../definitions/mocha/mocha.d.ts" />

import chai = require("chai");
import mocha = require("mocha");
import Q = require("q");
import Task = require("../task/Task");
import TaskSet = require("../task/TaskSet");
import TaskStatus = require("../task/TaskStatus");


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


    test("task-set-success", function taskSetSuccessTest(done) {
        // test success
        var taskSet = new TaskSet<string, string>();
        var task1 = taskSet.startTask("task-res-1", createTaskRes1("success-1"));
        var task2 = taskSet.startTask("task-res-2", createTaskRes2("success-2", 10));

        Q.all(taskSet.getPromises()).done(function (res) {
            asr.deepEqual(res.sort(), ["success-1", "success-2"]);

            asr.equal(task1.getResult(), "success-1");
            asr.equal(task1.status, TaskStatus.COMPLETED);

            asr.equal(task2.getResult(), "success-2");
            asr.equal(task2.status, TaskStatus.COMPLETED);
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

});
