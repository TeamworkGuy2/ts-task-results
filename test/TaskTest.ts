/// <reference path="../../definitions/chai/chai.d.ts" />
/// <reference path="../../definitions/mocha/mocha.d.ts" />

import chai = require("chai");
import mocha = require("mocha");
import Task = require("../task/Task");
import TaskStatus = require("../task/TaskStatus");


var asr = chai.assert;


suite("Task", function TaskTest() {

    test("task-success", function taskSuccessTest(done) {
        // test success
        var res1 = Task.newInst("a", () => "a-success");

        asr.equal(res1.name, "a");
        asr.equal(res1.status, TaskStatus.CREATED);

        res1.getPromise().then((res) => {
            asr.equal(res, "a-success");
            asr.equal(res1.getResult(), "a-success");
            asr.equal(res1.status, TaskStatus.COMPLETED);
            done();
        }, (err) => {
            asr.equal(true, false, "task " + res1.name + " failed unexpectedly");
            done();
        });

        res1.start();
    });


    test("task-failure", function taskFailureTest(done) {
        // test failure
        var res1 = Task.newInst("a", () => { throw "a-error"; });

        asr.equal(res1.name, "a");
        asr.equal(res1.status, TaskStatus.CREATED);

        res1.getPromise().then((res) => {
            asr.equal(true, false, "task " + res1.name + " succeeded unexpectedly");
            done();
        }, (err) => {
            asr.equal(err, "a-error");
            asr.equal(res1.getError(), "a-error");
            asr.equal(res1.status, TaskStatus.ERRORED);
            done();
        });

        res1.start();
    });

});
