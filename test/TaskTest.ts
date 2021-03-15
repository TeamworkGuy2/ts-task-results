import chai = require("chai");
import mocha = require("mocha");
import Q = require("q");
import Tasks = require("../task/Tasks");

var asr = chai.assert;

suite("Task", function TaskTest() {

    test("task-success", function taskSuccessTest(done) {
        // test success
        var res1 = Tasks.startTask("a", <any>Q.resolve("a-success"));

        asr.equal(res1.name, "a");
        asr.equal(res1.state, "RUNNING");

        res1.getPromise().then((res) => {
            asr.equal(res, "a-success");
            asr.equal(res1.getResult(), "a-success");
            asr.equal(res1.state, "COMPLETED");
            done();
        }, (err) => {
            asr.equal(true, false, "task " + res1.name + " failed unexpectedly");
            done();
        });
    });


    test("task-failure", function taskFailureTest(done) {
        // test failure
        var res1 = Tasks.startTask("a", <any>Q.reject("a-error"));

        asr.equal(res1.name, "a");
        asr.equal(res1.state, "RUNNING");

        res1.getPromise().then((res) => {
            asr.equal(true, false, "task " + res1.name + " succeeded unexpectedly");
            done();
        }, (err) => {
            asr.equal(err, "a-error");
            asr.equal(res1.getError(), "a-error");
            asr.equal(res1.state, "ERRORED");
            done();
        });
    });

});
