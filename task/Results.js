"use strict";
/** Results module for creating return values containing results and/or errors for tasks/functions
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
var Results;
(function (Results) {
    function error(error) {
        return {
            hasResult: false,
            result: null,
            error: error
        };
    }
    Results.error = error;
    function result(value) {
        return {
            hasResult: true,
            result: value,
            error: null
        };
    }
    Results.result = result;
    function resultOrError(value, error) {
        //if (value != null && error != null) {
        //    throw new Error("cannot create a result with both a non-null value and non-null error");
        //}
        return {
            hasResult: error == null,
            result: value,
            error: error
        };
    }
    Results.resultOrError = resultOrError;
    function resultsAndErrors(values, errors) {
        return {
            results: values,
            errors: errors
        };
    }
    Results.resultsAndErrors = resultsAndErrors;
})(Results || (Results = {}));
module.exports = Results;
