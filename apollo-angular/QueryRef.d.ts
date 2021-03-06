import { ApolloQueryResult, ObservableQuery, ApolloError, FetchMoreQueryOptions, FetchMoreOptions, SubscribeToMoreOptions, UpdateQueryOptions, ApolloCurrentResult } from 'apollo-client';
import { Observable } from 'rxjs';
import { R } from './types';
export declare class QueryRef<T, V = R> {
    private obsQuery;
    valueChanges: Observable<ApolloQueryResult<T>>;
    constructor(obsQuery: ObservableQuery<T>);
    result(): Promise<ApolloQueryResult<T>>;
    currentResult(): ApolloCurrentResult<T>;
    getLastResult(): ApolloQueryResult<T>;
    getLastError(): ApolloError;
    resetLastResults(): void;
    refetch(variables?: V): Promise<ApolloQueryResult<T>>;
    fetchMore<K extends keyof V>(fetchMoreOptions: FetchMoreQueryOptions<V, K> & FetchMoreOptions<T, V>): Promise<ApolloQueryResult<T>>;
    subscribeToMore(options: SubscribeToMoreOptions): () => void;
    updateQuery(mapFn: (previousQueryResult: T, options: UpdateQueryOptions<V>) => T): void;
    stopPolling(): void;
    startPolling(pollInterval: number): void;
    setOptions(opts: any): Promise<ApolloQueryResult<T>>;
    setVariables(variables: V, tryFetch?: boolean, fetchResults?: boolean): Promise<ApolloQueryResult<T>>;
}
