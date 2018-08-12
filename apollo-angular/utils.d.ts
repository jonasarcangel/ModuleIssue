import { ObservableQuery } from 'apollo-client';
import { Observable as ApolloObservable } from 'apollo-client/util/Observable';
import { Observable, Subscription, SchedulerLike, SchedulerAction } from 'rxjs';
export declare function fromPromise<T>(promiseFn: () => Promise<T>): Observable<T>;
export declare class ZoneScheduler implements SchedulerLike {
    private zone;
    constructor(zone: Zone);
    now: () => number;
    schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay?: number, state?: T): Subscription;
}
export declare function fixObservable<T>(obs: ObservableQuery<T> | ApolloObservable<T>): ObservableQuery<T> | ApolloObservable<T>;
export declare function wrapWithZone<T>(obs: Observable<T>): Observable<T>;
