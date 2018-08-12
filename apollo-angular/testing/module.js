import { ApolloModule, Apollo } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { NgModule } from '@angular/core';
import { ApolloTestingController } from './controller';
import { ApolloTestingBackend } from './backend';
var ApolloTestingModule = /** @class */ (function () {
    function ApolloTestingModule(apollo, backend) {
        var link = new ApolloLink(function (operation) { return backend.handle(operation); });
        var cache = new InMemoryCache({
            addTypename: false,
        });
        apollo.create({ link: link, cache: cache });
    }
    ApolloTestingModule.decorators = [
        { type: NgModule, args: [{
                    imports: [ApolloModule],
                    providers: [
                        ApolloTestingBackend,
                        { provide: ApolloTestingController, useExisting: ApolloTestingBackend },
                    ],
                },] },
    ];
    /** @nocollapse */
    ApolloTestingModule.ctorParameters = function () { return [
        { type: Apollo },
        { type: ApolloTestingBackend }
    ]; };
    return ApolloTestingModule;
}());
export { ApolloTestingModule };
//# sourceMappingURL=module.js.map