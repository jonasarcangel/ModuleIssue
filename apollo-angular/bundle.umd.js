(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/operators'), require('rxjs'), require('@angular/core'), require('apollo-client')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs/operators', 'rxjs', '@angular/core', 'apollo-client'], factory) :
    (factory((global.apollo = global.apollo || {}, global.apollo.core = {}),global.rxjs.operators,global.rxjs,global.ng.core,global.apollo));
}(this, (function (exports,operators,rxjs,core,apolloClient) { 'use strict';

    function fromPromise(promiseFn) {
        return new rxjs.Observable(function (subscriber) {
            promiseFn().then(function (result) {
                if (!subscriber.closed) {
                    subscriber.next(result);
                    subscriber.complete();
                }
            }, function (error) {
                if (!subscriber.closed) {
                    subscriber.error(error);
                }
            });
            return function () { return subscriber.unsubscribe(); };
        });
    }
    var ZoneScheduler = /** @class */ (function () {
        function ZoneScheduler(zone) {
            this.zone = zone;
            this.now = Date.now ? Date.now : function () { return +new Date(); };
        }
        ZoneScheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) { delay = 0; }
            return this.zone.run(function () {
                return rxjs.queueScheduler.schedule(work, delay, state);
            });
        };
        return ZoneScheduler;
    }());
    // XXX: Apollo's QueryObservable is not compatible with RxJS
    // TODO: remove it in one of future releases
    // https://github.com/ReactiveX/rxjs/blob/9fb0ce9e09c865920cf37915cc675e3b3a75050b/src/internal/util/subscribeTo.ts#L32
    function fixObservable(obs) {
        obs[rxjs.observable] = function () { return obs; };
        return obs;
    }
    function wrapWithZone(obs) {
        return obs.pipe(operators.observeOn(new ZoneScheduler(Zone.current)));
    }

    var QueryRef = /** @class */ (function () {
        function QueryRef(obsQuery) {
            this.obsQuery = obsQuery;
            this.valueChanges = wrapWithZone(rxjs.from(fixObservable(this.obsQuery)));
        }
        // ObservableQuery's methods
        QueryRef.prototype.result = function () {
            return this.obsQuery.result();
        };
        QueryRef.prototype.currentResult = function () {
            return this.obsQuery.currentResult();
        };
        QueryRef.prototype.getLastResult = function () {
            return this.obsQuery.getLastResult();
        };
        QueryRef.prototype.getLastError = function () {
            return this.obsQuery.getLastError();
        };
        QueryRef.prototype.resetLastResults = function () {
            return this.obsQuery.resetLastResults();
        };
        QueryRef.prototype.refetch = function (variables) {
            return this.obsQuery.refetch(variables);
        };
        QueryRef.prototype.fetchMore = function (fetchMoreOptions) {
            return this.obsQuery.fetchMore(fetchMoreOptions);
        };
        QueryRef.prototype.subscribeToMore = function (options) {
            return this.obsQuery.subscribeToMore(options);
        };
        QueryRef.prototype.updateQuery = function (mapFn) {
            return this.obsQuery.updateQuery(mapFn);
        };
        QueryRef.prototype.stopPolling = function () {
            return this.obsQuery.stopPolling();
        };
        QueryRef.prototype.startPolling = function (pollInterval) {
            return this.obsQuery.startPolling(pollInterval);
        };
        QueryRef.prototype.setOptions = function (opts) {
            return this.obsQuery.setOptions(opts);
        };
        QueryRef.prototype.setVariables = function (variables, tryFetch, fetchResults) {
            if (tryFetch === void 0) { tryFetch = false; }
            if (fetchResults === void 0) { fetchResults = true; }
            return this.obsQuery.setVariables(variables, tryFetch, fetchResults);
        };
        return QueryRef;
    }());

    var APOLLO_OPTIONS = new core.InjectionToken('[apollo-angular] options');

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var ApolloBase = /** @class */ (function () {
        function ApolloBase(_client) {
            this._client = _client;
        }
        ApolloBase.prototype.watchQuery = function (options) {
            return new QueryRef(this.client.watchQuery(__assign({}, options)));
        };
        ApolloBase.prototype.query = function (options) {
            var _this = this;
            return fromPromise(function () {
                return _this.client.query(__assign({}, options));
            });
        };
        ApolloBase.prototype.mutate = function (options) {
            var _this = this;
            return fromPromise(function () {
                return _this.client.mutate(__assign({}, options));
            });
        };
        ApolloBase.prototype.subscribe = function (options, extra) {
            var obs = rxjs.from(fixObservable(this.client.subscribe(__assign({}, options))));
            return extra && extra.useZone !== true ? obs : wrapWithZone(obs);
        };
        ApolloBase.prototype.getClient = function () {
            return this._client;
        };
        ApolloBase.prototype.setClient = function (client) {
            if (this._client) {
                throw new Error('Client has been already defined');
            }
            this._client = client;
        };
        Object.defineProperty(ApolloBase.prototype, "client", {
            get: function () {
                this.beforeEach();
                return this._client;
            },
            enumerable: true,
            configurable: true
        });
        ApolloBase.prototype.beforeEach = function () {
            this.checkInstance();
        };
        ApolloBase.prototype.checkInstance = function () {
            if (!this._client) {
                throw new Error('Client has not been defined yet');
            }
        };
        return ApolloBase;
    }());
    var Apollo = /** @class */ (function (_super) {
        __extends(Apollo, _super);
        function Apollo(apolloOptions) {
            var _this = _super.call(this) || this;
            _this.map = new Map();
            if (apolloOptions) {
                _this.createDefault(apolloOptions);
            }
            return _this;
        }
        Apollo.prototype.create = function (options, name) {
            if (name && name !== 'default') {
                this.createNamed(name, options);
            }
            else {
                this.createDefault(options);
            }
        };
        Apollo.prototype.default = function () {
            return this;
        };
        Apollo.prototype.use = function (name) {
            if (name === 'default') {
                return this.default();
            }
            return this.map.get(name);
        };
        Apollo.prototype.createDefault = function (options) {
            if (this.getClient()) {
                throw new Error('Apollo has been already created.');
            }
            return this.setClient(new apolloClient.ApolloClient(options));
        };
        Apollo.prototype.createNamed = function (name, options) {
            if (this.map.has(name)) {
                throw new Error("Client " + name + " has been already created");
            }
            this.map.set(name, new ApolloBase(new apolloClient.ApolloClient(options)));
        };
        Apollo.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        Apollo.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [APOLLO_OPTIONS,] }] }
        ]; };
        return Apollo;
    }(ApolloBase));

    var SelectPipe = /** @class */ (function () {
        function SelectPipe() {
        }
        SelectPipe.prototype.transform = function (obj, name) {
            if (name === void 0) { name = ''; }
            if (name !== '') {
                return obj && obj.data && obj.data[name];
            }
        };
        SelectPipe.decorators = [
            { type: core.Pipe, args: [{
                        name: 'select',
                    },] },
        ];
        return SelectPipe;
    }());

    var PROVIDERS = [Apollo];
    var DECLARATIONS = [SelectPipe];
    var ApolloModule = /** @class */ (function () {
        function ApolloModule() {
        }
        ApolloModule.decorators = [
            { type: core.NgModule, args: [{
                        providers: PROVIDERS,
                        declarations: DECLARATIONS,
                        exports: DECLARATIONS,
                    },] },
        ];
        return ApolloModule;
    }());

    exports.Apollo = Apollo;
    exports.ApolloBase = ApolloBase;
    exports.QueryRef = QueryRef;
    exports.SelectPipe = SelectPipe;
    exports.ApolloModule = ApolloModule;
    exports.APOLLO_OPTIONS = APOLLO_OPTIONS;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
