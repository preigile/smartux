class Dispatcher {
    constructor() {}

    private stores: Array<any>;

    register(store): any {
        if (!store || !store.update) {
            throw new Error('You should provide a store that has an `update` method.');
        } else {
            let consumers = [];
            let change = function () {
                consumers.forEach(function (consumer) {
                    consumer(store);
                });
            };
            let subscribe = function (consumer, noInit) {
                consumer = consumer.constructor === Array ? consumer : [consumer];
                consumers = consumers.concat(consumer);
                if (!noInit) {
                    consumer.forEach(function (c) {
                        c(store);
                    });
                }
            };

            this.stores.push({ store: store, change: change });
            return subscribe;
        }
    }

    dispatch(action): any {
        if (this.stores.length > 0) {
            this.stores.forEach(function (entry) {
                entry.store.update(action, entry.change);
            });
        }
    }
}

export class Smartux {
    constructor(private dispatcher: Dispatcher) {}

    createAction(type): any {
        if (!type) {
            throw new Error('Please, provide action\'s type.');
        } else {
            return (payload) => {
                return this.dispatcher.dispatch({ type: type, payload: payload });
            }
        }
    }

    createSubscriber(store): any {
        return this.dispatcher.register(store);
    }
}
