import type { CountAction } from './type'
import actionType from './constant'

export type { CountAction } from './type'

export const plusAction = (num: number): CountAction => ({
  type: actionType.COUNT_PLUS,
  num,
})

export const minusAction = (num: number): CountAction => ({
  type: actionType.COUNT_MINUS,
  num,
})

export const saveAction = (num: number): CountAction => ({
  type: actionType.COUNT_SAVE,
  num,
})
