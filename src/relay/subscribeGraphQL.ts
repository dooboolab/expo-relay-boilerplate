import { Observable, SubscribeFunction } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const SUBSCRIPTION_URL = 'ws://hackatalk.azurewebsites.net/graphql';

const subscriptionClient = new SubscriptionClient(SUBSCRIPTION_URL, {
  reconnect: true,
});

function subscribeGraphQL(request, variables, cacheConfig): SubscribeFunction {
  const subscribeObservable = subscriptionClient.request({
    query: request.text,
    operationName: request.name,
    variables,
  });
  console.log('Listening...');

  return Observable.from(subscribeObservable);
}

export default subscribeGraphQL;
