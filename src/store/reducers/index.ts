// combineReducers 是一个高阶函数。主要作用是合并多个 reducer
import { combineReducers } from 'redux'

import test from './test'

const reducers = combineReducers({
  test,
})

export default reducers
