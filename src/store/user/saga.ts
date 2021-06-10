import {
  fork, put, takeEvery, all,
} from 'redux-saga/effects'

import { saveAction, CountAction } from './action'
import actionType from './constant'

function* plusReducer(action: CountAction) {
  try {
    yield put(saveAction(action.num))
  } catch (error) {
    console.log(error)
  }
}
function* miunsReducer(action: CountAction) {
  try {
    yield put(saveAction(action.num))
  } catch (error) {
    console.log(error)
  }
}

function* plus() {
  yield takeEvery(actionType.COUNT_PLUS, plusReducer)
}
function* minus() {
  yield takeEvery(actionType.COUNT_MINUS, miunsReducer)
}

function* countSaga(): Generator {
  yield all([
    fork(plus),
    minus(),
  ])
}

export default countSaga
