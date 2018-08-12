import { ApolloClient, QueryOptions, WatchQueryOptions, MutationOptions, ApolloQueryResult, SubscriptionOptions, ApolloClientOptions } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { Observable } from 'rxjs';
import { QueryRef } from './QueryRef';
import { TypedVariables, ExtraSubscriptionOptions, R } from './types';
export declare class ApolloBase<TCacheShape = any> {
    private _client;
    constructor(_client?: ApolloClient<TCacheShape>);
    watchQuery<T, V = R>(options: WatchQueryOptions & TypedVariables<V>): QueryRef<T>;
    query<T, V = R>(options: QueryOptions & TypedVariables<V>): Observable<ApolloQueryResult<T>>;
    mutate<T, V = R>(options: MutationOptions & TypedVariables<V>): Observable<FetchResult<T>>;
    subscribe(options: SubscriptionOptions, extra?: ExtraSubscriptionOptions): Observable<any>;
    getClient(): ApolloClient<TCacheShape>;
    setClient(client: ApolloClient<TCacheShape>): void;
    private readonly client;
    private beforeEach();
    private checkInstance();
}
export declare class Apollo extends ApolloBase<any> {
    private map;
    constructor(apolloOptions?: ApolloClientOptions<any>);
    create<TCacheShape>(options: ApolloClientOptions<TCacheShape>, name?: string): void;
    default(): ApolloBase<any>;
    use(name: string): ApolloBase<any>;
    createDefault<TCacheShape>(options: ApolloClientOptions<TCacheShape>): void;
    createNamed<TCacheShape>(name: string, options: ApolloClientOptions<TCacheShape>): void;
}
