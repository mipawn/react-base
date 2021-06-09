import type { CountAction, State } from './type'

export const CountState: State = {
  num: 0,
}

function reducer(state = CountState, action: CountAction): State {
  const { type, num } = action
  switch (type) {
    case 'COUNT/COUNT_SAVE':
      return { ...state, num }
    default:
      return state
  }
}

export default reducer
