import type { CountAction, State } from './type'

export const CountState: State = {
  token: '',
}

function reducer(state = CountState, action: CountAction): State {
  const { type, token } = action
  switch (type) {
    case 'COUNT/COUNT_SAVE':
      return { ...state, token }
    default:
      return state
  }
}

export default reducer
