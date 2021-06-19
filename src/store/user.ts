import { ActionModuleType, ActionType } from './utils'

/**
 * token 和 user 不一定有，因为权限目前由后端状态码
 * 控制，后面根据需求或者安全考虑可以加强
 */
export interface UserState {
  token?: string,
  user?: string,
  isLogin?: boolean,
}

export const USER_SAVE: ActionType<'USER_SAVE', 'USER'> = 'USER/USER_SAVE'
export const USER_LOGOUT: ActionType<'USER_LOGOUT', 'USER'> = 'USER/USER_LOGOUT'

const actionType = {
  USER_SAVE,
  USER_LOGOUT,
}
export type UserActionType = ActionModuleType<typeof actionType, 'USER'>

export interface UserAction extends UserState {
  type: UserActionType,
}

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
    case 'USER/USER_LOGOUT':
      return CountState
    default:
      return state
  }
}

export default reducer
