/** Results module for creating return values containing results and/or errors for tasks/functions
 * @author TeamworkGuy2
 * @since 2016-5-24
 */
module Results {

    export function error<E>(error: E): ResultOrError<any, E> {
        return {
            hasResult: false,
            result: null,
            error: error
        };
    }


    export function result<R>(value: R): ResultOrError<R, any> {
        return {
            hasResult: true,
            result: value,
            error: null
        };
    }


    export function resultOrError<R, E>(value: R, error: E): ResultOrError<R, E> {
        //if (value != null && error != null) {
        //    throw new Error("cannot create a result with both a non-null value and non-null error");
        //}
        return {
            hasResult: value != null,
            result: value,
            error: error
        };
    }


    export function resultsAndErrors<R, E>(values: R[], errors: E[]): ResultsAndErrors<R, E> {
        return {
            results: values,
            errors: errors
        };
    }

}

export = Results;
