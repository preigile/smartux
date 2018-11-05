import {Smartux} from "../index";
import {Dispatcher} from "../index";

// type of actions
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

// The store defined as a singleton
const store = {
    _state: {value: 0},

    getValue: function () {
        return this._state.value;
    },

    update: function (action, change) {
        if (action.type === INCREASE) {
            this._state.value += 1;
        } else if (action.type === DECREASE) {
            this._state.value -= 1;
        }
        change();
    }
};

// the view accepts a store subscriber and two actions
const Counter = function (subscribeToStore, increase, decrease) {
    const el = document.querySelector('#counter');
    const number = el.querySelector('span');
    const [increaseBtn, decreaseBtn] = Array.from(el.querySelectorAll('button'));
    let value = 0;

    let render = () => number.innerHTML = value;
    let updateState = (store) => value = store.getValue();

    subscribeToStore([updateState, render]);

    increaseBtn.addEventListener('click', increase);
    decreaseBtn.addEventListener('click', decrease);
};

// Smartux API
const {createAction, createSubscriber} = new Smartux(new Dispatcher(store)).create();

// creating the subscribers and the actions
const storeSubscriber = createSubscriber(store);
const actions = {
    increase: createAction(INCREASE),
    decrease: createAction(DECREASE)
};

Counter(storeSubscriber, actions.increase, actions.decrease);
