/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { createAction, ActionDefaultProps as Action } from './type'

const nameSpace = 'test'

export interface IPlusAction extends Action {
  num: number
}

export const createPlusAction = (num = 0) => createAction<IPlusAction>({ type: 'plus', num, nameSpace })
