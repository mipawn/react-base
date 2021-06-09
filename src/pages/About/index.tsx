import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { State } from 'store/index'
import type { State as CountState } from 'store/count/type'
import { plusAction, minusAction } from 'store/count/action'

import type { RouteComponent } from 'types/index'

const About: RouteComponent = () => {
  const [id, setId] = useState(0)

  const { num } = useSelector<State, CountState>((state) => state.count)
  const dispatch = useDispatch()
  const history = useHistory()

  function goIndex(): void {
    setId(id + 1)
    history.push(`/about/${num}`)
  }

  function add() {
    console.log('add')
    dispatch(plusAction(num + 1))
  }
  function minus() {
    console.log('minus')
    dispatch(minusAction(num - 1))
  }
  return (
    <div>
      <div onClick={goIndex}>{num}</div>
      <div onClick={add}>add</div>
      <div onClick={minus}>miuns</div>
    </div>
  )
}

export default About
