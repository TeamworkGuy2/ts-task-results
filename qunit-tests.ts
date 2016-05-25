/// <reference path="../definitions/node/node.d.ts" />
/// <reference path="../definitions/node/node-modules-custom.d.ts" />
/// <reference path="../definitions/lib/qunit.d.ts" />
/// <reference path="../definitions/lib/Q.d.ts" />
var testRunner = require("qunit");


function callback() {
    console.log("done a test: ", JSON.stringify(arguments, undefined, "  "));
}


testRunner.setup({
    log: {
        errors: true,
        tests: true,
        summary: true,
        globalSummary: true,
        coverage: true,
        globalCoverage: true,
        testing: true
    }
});


testRunner.run({
    code: "./task/Task",
    tests: "./test/task/TaskTest.js"
}, callback);
