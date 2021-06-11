import {
  fork, put, takeEvery, all,
} from 'redux-saga/effects'

import {
  userSaveAction,
  UserAction,
} from './action'
import actionType from './constant'

function* logoutReducer({ type, ...state } : UserAction) {
  try {
    yield put(userSaveAction(state))
  } catch (error) {
    console.log(error)
  }
}

function* logout() {
  yield takeEvery(actionType.USER_LOGOUT, logoutReducer)
}

function* countSaga(): Generator {
  yield all([
    fork(logout),
  ])
}

export default countSaga
