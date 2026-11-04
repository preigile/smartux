import { useEffect, useState } from 'react'
// Local copy of the Smartux primitives for this React example
import { Smartux, Dispatcher } from './smartux'
import './App.css'

// Action types
const INCREASE = 'INCREASE'
const DECREASE = 'DECREASE'

// Store: mirrors the example's store API
const store = {
  _state: { value: 0 },
  getValue() {
    return this._state.value
  },
  update(action: { type: string; payload: number }, change: () => void) {
    if (action.type === INCREASE) {
      this._state.value += action.payload
    } else if (action.type === DECREASE) {
      this._state.value -= action.payload
    }
    change()
  },
}

// Smartux wiring
const { createAction, createSubscriber } = new Smartux(new Dispatcher(store)).create()
const storeSubscriber = createSubscriber(store)
const actions = {
  increase: createAction(INCREASE, 1),
  decrease: createAction(DECREASE, 2),
}

function App() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    // Subscribe to store updates and initialize value immediately
    storeSubscriber([(s: typeof store) => setValue(s.getValue())])
  }, [])

  return (
    <div id="counter" style={{ display: 'grid', gap: 12, placeItems: 'start' }}>
      <span style={{ fontSize: 24 }}>Value: {value}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => actions.increase()}>increase</button>
        <button onClick={() => actions.decrease()}>decrease</button>
      </div>
    </div>
  )
}

export default App
