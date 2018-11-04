// type of actions
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

// The store defined as a singleton
const CounterStore = {
    _data: { value: 0 },

    getValue: function () {
        return this._data.value;
    },

    update: function (action, change) {
        if (action.type === INCREASE) {
            this._data.value += 1;
        } else if (action.type === DECREASE) {
            this._data.value -= 1;
        }
        change();
    }
};

// the view accepts a store subscriber and two actions
const Counter = function (subscribeToStore, increase, decrease) {
    const el = document.querySelector('#counter');
    const display = el.querySelector('span');
    const [ increaseBtn, decreaseBtn ] = Array.from(el.querySelectorAll('button'));
    let value = null;

    let render = () => display.innerHTML = value;
    let updateState = (store) => value = store.getValue();

    subscribeToStore([updateState, render]);

    increaseBtn.addEventListener('click', increase);
    decreaseBtn.addEventListener('click', decrease);
};

// Smartux API
const { createAction, createSubscriber } = Smartux.create();

// creating the subscribers and the actions
const counterStoreSubscriber = createSubscriber(CounterStore);
const actions = {
    increase: createAction(INCREASE),
    decrease: createAction(DECREASE)
};


Counter(counterStoreSubscriber, actions.increase, actions.decrease);
