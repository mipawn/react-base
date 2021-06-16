import {
  combineReducers,
} from 'redux'

import userReducer from './user/reducer'

import type { UserState } from './user/type'

const reducers = combineReducers({
  user: userReducer,
})

export interface State {
  user: UserState
}

export default reducers
