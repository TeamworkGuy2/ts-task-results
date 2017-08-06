import chai = require("chai");
import mocha = require("mocha");
import Task = require("../task/Task");
import TaskState = require("../task/TaskState");


var asr = chai.assert;


suite("Task", function TaskTest() {

    test("task-success", function taskSuccessTest(done) {
        // test success
        var res1 = Task.newTask("a", () => "a-success");

        asr.equal(res1.name, "a");
        asr.equal(res1.state, TaskState.CREATED);

        res1.getPromise().then((res) => {
            asr.equal(res, "a-success");
            asr.equal(res1.getResult(), "a-success");
            asr.equal(res1.state, TaskState.COMPLETED);
            done();
        }, (err) => {
            asr.equal(true, false, "task " + res1.name + " failed unexpectedly");
            done();
        });

        res1.start();
    });


    test("task-failure", function taskFailureTest(done) {
        // test failure
        var res1 = Task.newTask("a", () => { throw "a-error"; });

        asr.equal(res1.name, "a");
        asr.equal(res1.state, TaskState.CREATED);

        res1.getPromise().then((res) => {
            asr.equal(true, false, "task " + res1.name + " succeeded unexpectedly");
            done();
        }, (err) => {
            asr.equal(err, "a-error");
            asr.equal(res1.getError(), "a-error");
            asr.equal(res1.state, TaskState.ERRORED);
            done();
        });

        res1.start();
    });

});
