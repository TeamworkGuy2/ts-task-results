"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Q = require("q");
var Tasks = require("../task/Tasks");
var asr = chai.assert;
suite("Task", function TaskTest() {
    test("task-success", function taskSuccessTest(done) {
        // test success
        var res1 = Tasks.startTask("a", Q.resolve("a-success"));
        asr.equal(res1.name, "a");
        asr.equal(res1.state, "RUNNING");
        res1.getPromise().then(function (res) {
            asr.equal(res, "a-success");
            asr.equal(res1.getResult(), "a-success");
            asr.equal(res1.state, "COMPLETED");
            done();
        }, function (err) {
            asr.equal(true, false, "task " + res1.name + " failed unexpectedly");
            done();
        });
    });
    test("task-failure", function taskFailureTest(done) {
        // test failure
        var res1 = Tasks.startTask("a", Q.reject("a-error"));
        asr.equal(res1.name, "a");
        asr.equal(res1.state, "RUNNING");
        res1.getPromise().then(function (res) {
            asr.equal(true, false, "task " + res1.name + " succeeded unexpectedly");
            done();
        }, function (err) {
            asr.equal(err, "a-error");
            asr.equal(res1.getError(), "a-error");
            asr.equal(res1.state, "ERRORED");
            done();
        });
    });
});
