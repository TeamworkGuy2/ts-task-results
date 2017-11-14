"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Tasks = require("../task/Tasks");
var TaskState = require("../task/TaskState");
var asr = chai.assert;
suite("Task", function TaskTest() {
    test("task-success", function taskSuccessTest(done) {
        // test success
        var res1 = Tasks.newTask("a", function () { return "a-success"; });
        asr.equal(res1.name, "a");
        asr.equal(res1.state, TaskState.CREATED);
        res1.getPromise().then(function (res) {
            asr.equal(res, "a-success");
            asr.equal(res1.getResult(), "a-success");
            asr.equal(res1.state, TaskState.COMPLETED);
            done();
        }, function (err) {
            asr.equal(true, false, "task " + res1.name + " failed unexpectedly");
            done();
        });
        res1.start();
    });
    test("task-failure", function taskFailureTest(done) {
        // test failure
        var res1 = Tasks.newTask("a", function () { throw "a-error"; });
        asr.equal(res1.name, "a");
        asr.equal(res1.state, TaskState.CREATED);
        res1.getPromise().then(function (res) {
            asr.equal(true, false, "task " + res1.name + " succeeded unexpectedly");
            done();
        }, function (err) {
            asr.equal(err, "a-error");
            asr.equal(res1.getError(), "a-error");
            asr.equal(res1.state, TaskState.ERRORED);
            done();
        });
        res1.start();
    });
});
