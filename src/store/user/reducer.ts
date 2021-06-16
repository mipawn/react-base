import type { UserAction, UserState } from './type'

export const CountState: UserState = {
  token: '',
  user: '',
  isLogin: false,
}

function reducer(state = CountState, action: UserAction): UserState {
  const { type, ...newState } = action
  switch (type) {
    case 'USER/USER_SAVE':
      return { ...state, ...newState }
    default:
      return state
  }
}

export default reducer
