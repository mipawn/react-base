import type { Dispatch } from 'redux'
import { ActionModuleType, ActionType } from '../type'

/**
 * token 和 user 不一定有，因为权限目前由后端状态码
 * 控制，后面根据需求或者安全考虑可以加强
 */
export interface UserState {
  token?: string,
  user?: string,
  isLogin: boolean,
}

export const USER_SAVE: ActionType<'USER_SAVE', 'USER'> = 'USER/USER_SAVE'
export const USER_LOGIN: ActionType<'USER_LOGIN', 'USER'> = 'USER/USER_LOGIN'
export const USER_LOGOUT: ActionType<'USER_LOGOUT', 'USER'> = 'USER/USER_LOGOUT'

const actionType = {
  USER_SAVE,
  USER_LOGIN,
  USER_LOGOUT,
}
export type IType = ActionModuleType<typeof actionType, 'USER'>

export interface UserAction extends UserState {
  type: IType,
}

export type UserDispatch = Dispatch<UserAction>

export default actionType
