import type { GlobalState, GlobalAction } from './type'

const initialState: GlobalState = {
  collapsed: false,
  notices: [],
}

function reducer(state = initialState, action: GlobalAction): GlobalState {
  const { type, ...newState } = action
  switch (type) {
    case 'GLOBAL/CHNAGE_COLLAPSED':
      return { ...state, ...newState }
    default:
      return state
  }
}

export default reducer
