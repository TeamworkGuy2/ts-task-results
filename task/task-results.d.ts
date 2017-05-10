/// <reference types="q" />

/**
 * @template R the result type
 * @template E the error type
 */
interface ResultOrError<R, E> {
    hasResult: boolean;
    result: R;
    error: E;
}


/**
 * @template R the result array element type
 * @template E the error array element type
 */
interface ResultsAndErrors<R, E> {
    results: R[];
    errors: E[];
}
