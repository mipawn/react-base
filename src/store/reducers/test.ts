import type { Action, Reducer } from 'redux'

const initialState = {
  num: 0,
  loading: true,
}

interface ITodoAction extends Action {
  num: number
}

function reducer(state = initialState, action: ITodoAction) {
  const { type, num } = action
  switch (type) {
    case 'testSync/plus':
      return { ...state, num: state.num + num, loading: false }
    case 'minus':
      return { ...state, num: state.num - num, loading: false }
    default:
      return state
  }
}

export default reducer
