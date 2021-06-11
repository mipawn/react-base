import type { UserAction, UserState } from './type'
import actionType from './constant'

export type { UserAction } from './type'

export const userSaveAction = (userState: UserState): UserAction => ({
  type: actionType.USER_SAVE,
  ...userState,
})
