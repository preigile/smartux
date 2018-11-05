export class Dispatcher {

    constructor(
        private store: any
    ) {};

    register(store): (cons: (store: any) => void, noInit: boolean) => void {
        if (!store || !store.update) {
            throw new Error('You should provide a store that has an `update` method.');
        } else {
            let consumers = [];

            let change = () => {
                consumers.forEach((consumer) => {
                    consumer(store);
                });
            };

            let subscribe = (consumer) => {
                consumers = consumers.concat(consumer);
                consumers.forEach((c) => {
                    c(store);
                });
            };

            this.store = {state: store, change: change};

            return subscribe;
        }
    }

    dispatch(action): any {
        if (this.store) {
            this.store.state.update(action, this.store.change);
        }
    }
}

export class Smartux {

    constructor(
        private dispatcher: Dispatcher
    ) {}

    create(): any {
        return {
            createAction: (type) => {
                if (!type) {
                    throw new Error('Please, provide action\'s type.');
                } else {
                    return (payload) => {
                        return this.dispatcher.dispatch({type: type, payload: payload});
                    }
                }
            },

            createSubscriber: (store) => {
                return this.dispatcher.register(store);
            }
        }
    }
}
