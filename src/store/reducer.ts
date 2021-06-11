import {
  combineReducers,
} from 'redux'

import countReducer from './count/reducer'
import userReducer from './user/reducer'

import type { State as CountState } from './count/type'
import type { UserState } from './user/type'

const reducers = combineReducers({
  count: countReducer,
  user: userReducer,
})

export interface State {
  count: CountState,
  user: UserState
}

export default reducers
