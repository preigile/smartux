export class Dispatcher {
  private store: { state: any; change: () => void } | null

  constructor(store: any) {
    this.store = { state: store, change: () => {} }
  }

  register(store: any) {
    if (!store || !store.update) {
      throw new Error('You should provide a store that has an `update` method.')
    } else {
      let consumers: Array<(s: any) => void> = []

      const change = () => {
        consumers.forEach((consumer) => {
          consumer(store)
        })
      }

      const subscribe = (consumer: ((s: any) => void) | Array<(s: any) => void>) => {
        consumers = consumers.concat(consumer as any)
        consumers.forEach((c) => {
          c(store)
        })
      }

      this.store = { state: store, change }
      return subscribe
    }
  }

  dispatch(action: any) {
    if (this.store) {
      this.store.state.update(action, this.store.change)
    }
  }
}

export class Smartux {
  private dispatcher: Dispatcher

  constructor(dispatcher: Dispatcher) {
    this.dispatcher = dispatcher
  }

  create() {
    return {
      createAction: (type: string, payload: any) => {
        if (!type) {
          throw new Error("Please, provide action's type.")
        } else {
          return () => {
            return this.dispatcher.dispatch({ type, payload })
          }
        }
      },
      createSubscriber: (store: any) => {
        return this.dispatcher.register(store)
      },
    }
  }
}

