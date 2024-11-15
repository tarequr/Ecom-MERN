import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount, reset } from '../../app/features/counter/counterSlice';

function Counter() {
    const { count } = useSelector((state) => state.counterR);

    const dispatch = useDispatch();

    const handleIncrement = () => {
        dispatch(increment());
    }

    const handleIncrementBy5 = () => {
        dispatch(incrementByAmount(5));
    }
    const handleReset = () => {
        dispatch(reset());
    }

    const handleDecrement = () => {
        dispatch(decrement());
    }
  return (
    <div>
      <h2>Count : { count }</h2>

      <button onClick={ handleIncrement }>+</button>
      <button onClick={ handleReset }>0</button>
      <button onClick={ handleDecrement }>-</button>
      <button onClick={ handleIncrementBy5 }>+5</button>
    </div>
  )
}

export default Counter;
