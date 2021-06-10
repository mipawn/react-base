import { ActionModuleType, ActionType } from '../type'

export interface State {
  token: string,
}

export const COUNT_PLUS: ActionType<'COUNT_PLUS', 'COUNT'> = 'COUNT/COUNT_PLUS'
export const COUNT_MINUS: ActionType<'COUNT_MINUS', 'COUNT'> = 'COUNT/COUNT_MINUS'
export const COUNT_SAVE: ActionType<'COUNT_SAVE', 'COUNT'> = 'COUNT/COUNT_SAVE'

const actionType = {
  COUNT_PLUS,
  COUNT_MINUS,
  COUNT_SAVE,
}
export type IType = ActionModuleType<typeof actionType, 'COUNT'>

export interface CountAction extends State {
  type: IType,
}

export default actionType
