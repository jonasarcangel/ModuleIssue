import { observeOn } from 'rxjs/operators';
import { Observable, queueScheduler, observable, } from 'rxjs';
export function fromPromise(promiseFn) {
    return new Observable(function (subscriber) {
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
            return queueScheduler.schedule(work, delay, state);
        });
    };
    return ZoneScheduler;
}());
export { ZoneScheduler };
// XXX: Apollo's QueryObservable is not compatible with RxJS
// TODO: remove it in one of future releases
// https://github.com/ReactiveX/rxjs/blob/9fb0ce9e09c865920cf37915cc675e3b3a75050b/src/internal/util/subscribeTo.ts#L32
export function fixObservable(obs) {
    obs[observable] = function () { return obs; };
    return obs;
}
export function wrapWithZone(obs) {
    return obs.pipe(observeOn(new ZoneScheduler(Zone.current)));
}
//# sourceMappingURL=utils.js.map