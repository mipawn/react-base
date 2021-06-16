import type { Dispatch } from 'redux'
import { ActionModuleType, ActionType } from '../type'

export type NoticeItem = {
  id: string;
  type: string;
  status: string;
}
// } & NoticeIconData;

export interface GlobalState {
  collapsed?: boolean,
  notices?: NoticeItem[]
}

export const CHNAGE_COLLAPSED: ActionType<'CHNAGE_COLLAPSED', 'GLOBAL'> = 'GLOBAL/CHNAGE_COLLAPSED'

const actionType = {
  CHNAGE_COLLAPSED,
}
export type IType = ActionModuleType<typeof actionType, 'GLOBAL'>

export interface GlobalAction extends GlobalState {
  type: IType,
}

export type GlobalDispatch = Dispatch<GlobalAction>

export default actionType
