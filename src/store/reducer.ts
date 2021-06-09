import {
  combineReducers,
} from 'redux'
import countReducer from './count/reducer'

import type { State as CountState } from './count/type'

const reducers = combineReducers({
  count: countReducer,
})

export interface State {
  count: CountState
}

export default reducers
