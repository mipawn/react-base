/**
 * @导出全局 store 基于 redux-sage
 * @format
 */
// redux-devtools-extension 可以在浏览器里面查看 store 的状态

import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux'

import createSagaMiddleware from 'redux-saga'
import rootSaga from './saga'
import middlewaresList from './middleware'
import reducers from './reducer'

const sagasMiddleware = createSagaMiddleware()
const middlewares = [sagasMiddleware, ...middlewaresList]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancer = composeEnhancers(applyMiddleware(...middlewares))

const store = createStore(
  reducers,
  enhancer,
)
sagasMiddleware.run(rootSaga)

export type { State } from './reducer'

export type Store = typeof store

export default store
