import type { CountAction } from './type'
import actionType from './constant'

export type { CountAction } from './type'

export const plusAction = (token: string): CountAction => ({
  type: actionType.COUNT_PLUS,
  token,
})

export const minusAction = (token: string): CountAction => ({
  type: actionType.COUNT_MINUS,
  token,
})

export const saveAction = (token: string): CountAction => ({
  type: actionType.COUNT_SAVE,
  token,
})
