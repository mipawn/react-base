/**
 * redux-saga 中文文档地址
 * https://redux-saga-in-chinese.js.org/
 */

import { all } from 'redux-saga/effects'
import testSaga from './test'

function* rootSage(): Generator {
  yield all([
    testSaga(),
  ])
}

export default rootSage
