import { ApolloError } from 'apollo-client';
var isApolloError = function (err) {
    return err && err.hasOwnProperty('graphQLErrors');
};
var ɵ0 = isApolloError;
var TestOperation = /** @class */ (function () {
    function TestOperation(operation, observer) {
        this.operation = operation;
        this.observer = observer;
    }
    TestOperation.prototype.flush = function (result) {
        if (isApolloError(result)) {
            this.observer.error(result);
        }
        else {
            this.observer.next(result);
            this.observer.complete();
        }
    };
    TestOperation.prototype.networkError = function (error) {
        var apolloError = new ApolloError({
            networkError: error,
        });
        this.flush(apolloError);
    };
    TestOperation.prototype.graphqlErrors = function (errors) {
        this.flush({
            errors: errors,
        });
    };
    return TestOperation;
}());
export { TestOperation };
export { ɵ0 };
//# sourceMappingURL=operation.js.map