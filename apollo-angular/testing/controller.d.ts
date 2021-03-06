import { Operation } from 'apollo-link';
import { DocumentNode } from 'graphql';
import { TestOperation } from './operation';
export declare type MatchOperationFn = (op: Operation) => boolean;
export declare type MatchOperation = string | DocumentNode | Operation | MatchOperationFn;
/**
 * Controller to be injected into tests, that allows for mocking and flushing
 * of operations.
 *
 *
 */
export declare abstract class ApolloTestingController {
    /**
     * Search for operations that match the given parameter, without any expectations.
     */
    abstract match(match: MatchOperation): TestOperation[];
    /**
     * Expect that a single  has been made which matches the given URL, and return its
     * mock.
     *
     * If no such  has been made, or more than one such  has been made, fail with an
     * error message including the given  description, if any.
     */
    abstract expectOne(operationName: string, description?: string): TestOperation;
    /**
     * Expect that a single  has been made which matches the given parameters, and return
     * its mock.
     *
     * If no such  has been made, or more than one such  has been made, fail with an
     * error message including the given  description, if any.
     */
    abstract expectOne(op: Operation, description?: string): TestOperation;
    /**
     * Expect that a single  has been made which matches the given predicate function, and
     * return its mock.
     *
     * If no such  has been made, or more than one such  has been made, fail with an
     * error message including the given  description, if any.
     */
    abstract expectOne(matchFn: MatchOperationFn, description?: string): TestOperation;
    /**
     * Expect that a single  has been made which matches the given condition, and return
     * its mock.
     *
     * If no such  has been made, or more than one such  has been made, fail with an
     * error message including the given  description, if any.
     */
    abstract expectOne(match: MatchOperation, description?: string): TestOperation;
    /**
     * Expect that no operations have been made which match the given URL.
     *
     * If a matching  has been made, fail with an error message including the given
     * description, if any.
     */
    abstract expectNone(operationName: string, description?: string): void;
    /**
     * Expect that no operations have been made which match the given parameters.
     *
     * If a matching  has been made, fail with an error message including the given
     * description, if any.
     */
    abstract expectNone(op: Operation, description?: string): void;
    /**
     * Expect that no operations have been made which match the given predicate function.
     *
     * If a matching  has been made, fail with an error message including the given
     * description, if any.
     */
    abstract expectNone(matchFn: MatchOperationFn, description?: string): void;
    /**
     * Expect that no operations have been made which match the given condition.
     *
     * If a matching  has been made, fail with an error message including the given
     * description, if any.
     */
    abstract expectNone(match: MatchOperation, description?: string): void;
    /**
     * Verify that no unmatched operations are outstanding.
     *
     * If any operations are outstanding, fail with an error message indicating which operations were not
     * handled.
     */
    abstract verify(): void;
}
