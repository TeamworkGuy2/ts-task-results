/// <reference path="../../definitions/lib/Q.d.ts" />

/**
 * @param <R> the result type
 * @param <E> the error type
 */
interface ResultOrError<R, E> {
    hasResult: boolean;
    result: R;
    error: E;
}


/**
 * @param <R> the result array element type
 * @param <E> the error array element type
 */
interface ResultsAndErrors<R, E> {
    results: R[];
    errors: E[];
}
