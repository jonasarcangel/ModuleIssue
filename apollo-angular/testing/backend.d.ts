import { Operation, FetchResult, Observable as LinkObservable } from 'apollo-link';
import { ApolloTestingController, MatchOperation } from './controller';
import { TestOperation } from './operation';
/**
 * A testing backend for `Apollo`.
 *
 * `ApolloTestingBackend` works by keeping a list of all open operations.
 * As operations come in, they're added to the list. Users can assert that specific
 * operations were made and then flush them. In the end, a verify() method asserts
 * that no unexpected operations were made.
 */
export declare class ApolloTestingBackend implements ApolloTestingController {
    /**
     * List of pending operations which have not yet been expected.
     */
    private open;
    /**
     * Handle an incoming operation by queueing it in the list of open operations.
     */
    handle(op: Operation): LinkObservable<FetchResult>;
    /**
     * Helper function to search for operations in the list of open operations.
     */
    private _match(match);
    private matchOp(match, testOp);
    private compare(expected?, value?);
    /**
     * Search for operations in the list of open operations, and return all that match
     * without asserting anything about the number of matches.
     */
    match(match: MatchOperation): TestOperation[];
    /**
     * Expect that a single outstanding request matches the given matcher, and return
     * it.
     *
     * operations returned through this API will no longer be in the list of open operations,
     * and thus will not match twice.
     */
    expectOne(match: MatchOperation, description?: string): TestOperation;
    /**
     * Expect that no outstanding operations match the given matcher, and throw an error
     * if any do.
     */
    expectNone(match: MatchOperation, description?: string): void;
    /**
     * Validate that there are no outstanding operations.
     */
    verify(): void;
    private isDocumentNode(docOrOp);
    private descriptionFromMatcher(matcher);
}
