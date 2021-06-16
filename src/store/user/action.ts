import type { UserAction, UserState } from './type'

export const userSaveAction = (userState: UserState): UserAction => ({
  type: 'USER/USER_SAVE',
  ...userState,
})
