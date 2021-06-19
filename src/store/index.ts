import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux'

import reducers from './reducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancer = composeEnhancers(applyMiddleware())

const store = createStore(
  reducers,
  enhancer,
)

export type { State } from './reducer'

export type Store = typeof store

export default store
