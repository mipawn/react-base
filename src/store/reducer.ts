import {
  combineReducers,
} from 'redux'

import userReducer from './user'

import type { UserState } from './user'

const reducers = combineReducers({
  user: userReducer,
})

export interface State {
  user: UserState
}

export default reducers
