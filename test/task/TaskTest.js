"use strict";
//import QUnit = require("qunit"); // implicitly setup by 'qunit-tests' in root of project, run using node.js
var Task = require("../../task/Task");
var TaskStatus = require("../../task/TaskStatus");
QUnit.module("Task", {});
QUnit.test("task-success", function taskSuccessTest(sr) {
    // test success
    var res1 = Task.newInst("a", function () { return "a-success"; });
    sr.equal(res1.name, "a");
    sr.equal(res1.status, TaskStatus.CREATED);
    res1.getPromise().then(function (res) {
        start();
        sr.equal(res, "a-success");
        sr.equal(res1.getResult(), "a-success");
        sr.equal(res1.status, TaskStatus.COMPLETED);
    }, function (err) {
        start();
        sr.equal(true, false, "task " + res1.name + " failed unexpectedly");
    });
    res1.start();
    stop();
});
QUnit.test("task-failure", function taskFailureTest(sr) {
    // test failure
    var res1 = Task.newInst("a", function () { throw "a-error"; });
    sr.equal(res1.name, "a");
    sr.equal(res1.status, TaskStatus.CREATED);
    res1.getPromise().then(function (res) {
        start();
        sr.equal(true, false, "task " + res1.name + " succeeded unexpectedly");
    }, function (err) {
        start();
        sr.equal(err, "a-error");
        sr.equal(res1.getError(), "a-error");
        sr.equal(res1.status, TaskStatus.ERRORED);
    });
    res1.start();
    stop();
});
