import { all } from 'redux-saga/effects'
import countSaga from './count/saga'

/**
 * redux-saga
 * https://redux-saga-in-chinese.js.org/
 */

function* rootSage(): Generator {
  yield all([
    countSaga(),
  ])
}

export default rootSage
