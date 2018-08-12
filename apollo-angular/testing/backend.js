import { Injectable } from '@angular/core';
import { Observable as LinkObservable, } from 'apollo-link';
import { print } from 'graphql/language/printer';
import { TestOperation } from './operation';
/**
 * A testing backend for `Apollo`.
 *
 * `ApolloTestingBackend` works by keeping a list of all open operations.
 * As operations come in, they're added to the list. Users can assert that specific
 * operations were made and then flush them. In the end, a verify() method asserts
 * that no unexpected operations were made.
 */
var ApolloTestingBackend = /** @class */ (function () {
    function ApolloTestingBackend() {
        /**
         * List of pending operations which have not yet been expected.
         */
        this.open = [];
    }
    /**
     * Handle an incoming operation by queueing it in the list of open operations.
     */
    ApolloTestingBackend.prototype.handle = function (op) {
        var _this = this;
        return new LinkObservable(function (observer) {
            var testOp = new TestOperation(op, observer);
            _this.open.push(testOp);
        });
    };
    /**
     * Helper function to search for operations in the list of open operations.
     */
    ApolloTestingBackend.prototype._match = function (match) {
        var _this = this;
        if (typeof match === 'string') {
            return this.open.filter(function (testOp) { return testOp.operation.operationName === match; });
        }
        else if (typeof match === 'function') {
            return this.open.filter(function (testOp) { return match(testOp.operation); });
        }
        else {
            if (this.isDocumentNode(match)) {
                return this.open.filter(function (testOp) { return print(testOp.operation.query) === print(match); });
            }
            return this.open.filter(function (testOp) { return _this.matchOp(match, testOp); });
        }
    };
    ApolloTestingBackend.prototype.matchOp = function (match, testOp) {
        var variables = JSON.stringify(match.variables);
        var extensions = JSON.stringify(match.extensions);
        var sameName = this.compare(match.operationName, testOp.operation.operationName);
        var sameVariables = this.compare(variables, testOp.operation.variables);
        var sameQuery = print(testOp.operation.query) === print(match.query);
        var sameExtensions = this.compare(extensions, testOp.operation.extensions);
        return sameName && sameVariables && sameQuery && sameExtensions;
    };
    ApolloTestingBackend.prototype.compare = function (expected, value) {
        var prepare = function (val) {
            return typeof val === 'string' ? val : JSON.stringify(val);
        };
        var received = prepare(value);
        return !expected || received === expected;
    };
    /**
     * Search for operations in the list of open operations, and return all that match
     * without asserting anything about the number of matches.
     */
    ApolloTestingBackend.prototype.match = function (match) {
        var _this = this;
        var results = this._match(match);
        results.forEach(function (result) {
            var index = _this.open.indexOf(result);
            if (index !== -1) {
                _this.open.splice(index, 1);
            }
        });
        return results;
    };
    /**
     * Expect that a single outstanding request matches the given matcher, and return
     * it.
     *
     * operations returned through this API will no longer be in the list of open operations,
     * and thus will not match twice.
     */
    ApolloTestingBackend.prototype.expectOne = function (match, description) {
        description = description || this.descriptionFromMatcher(match);
        var matches = this.match(match);
        if (matches.length > 1) {
            throw new Error("Expected one matching operation for criteria \"" + description + "\", found " + matches.length + " operations.");
        }
        if (matches.length === 0) {
            throw new Error("Expected one matching operation for criteria \"" + description + "\", found none.");
        }
        return matches[0];
    };
    /**
     * Expect that no outstanding operations match the given matcher, and throw an error
     * if any do.
     */
    ApolloTestingBackend.prototype.expectNone = function (match, description) {
        description = description || this.descriptionFromMatcher(match);
        var matches = this.match(match);
        if (matches.length > 0) {
            throw new Error("Expected zero matching operations for criteria \"" + description + "\", found " + matches.length + ".");
        }
    };
    /**
     * Validate that there are no outstanding operations.
     */
    ApolloTestingBackend.prototype.verify = function () {
        var open = this.open;
        if (open.length > 0) {
            // Show the methods and URLs of open operations in the error, for convenience.
            var operations = open
                .map(function (testOp) { return testOp.operation.operationName; })
                .join(', ');
            throw new Error("Expected no open operations, found " + open.length + ": " + operations);
        }
    };
    ApolloTestingBackend.prototype.isDocumentNode = function (docOrOp) {
        return !docOrOp.operationName;
    };
    ApolloTestingBackend.prototype.descriptionFromMatcher = function (matcher) {
        if (typeof matcher === 'string') {
            return "Match operationName: " + matcher;
        }
        else if (typeof matcher === 'object') {
            if (this.isDocumentNode(matcher)) {
                return "Match DocumentNode";
            }
            var name_1 = matcher.operationName || '(any)';
            var variables = JSON.stringify(matcher.variables) || '(any)';
            return "Match operation: " + name_1 + ", variables: " + variables;
        }
        else {
            return "Match by function: " + matcher.name;
        }
    };
    ApolloTestingBackend.decorators = [
        { type: Injectable },
    ];
    return ApolloTestingBackend;
}());
export { ApolloTestingBackend };
//# sourceMappingURL=backend.js.map