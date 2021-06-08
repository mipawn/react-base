import {
  fork, put, takeEvery, all,
} from 'redux-saga/effects'

import { createPlusAction, IPlusAction } from '../actions/test'

function* plusReducer(action: IPlusAction) {
  try {
    yield put(createPlusAction(action.num).sync)
  } catch (error) {
    console.log(error)
  }
}

function* plus() {
  yield takeEvery(createPlusAction().async.type, plusReducer)
}

function* testSaga(): Generator {
  yield all([
    fork(plus),
  ])
}

export default testSaga
