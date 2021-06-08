import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import type { RouteComponent } from 'type/index'

const About = (props: any) => {
  const [id, setId] = useState(0)
  console.log(props)
  const { num, loading } = useSelector<any, any>((state) => state.test)
  const dispatch = useDispatch()
  const history = useHistory()

  function goIndex(): void {
    setId(id + 1)
    history.push(`/about/${id}`)
  }

  function add() {
    console.log('add')
    dispatch({
      type: 'testAsync/plus',
      num: 1,
    })
  }
  function minus() {
    console.log('minus')
    dispatch({
      type: 'minus',
      num: 1,
    })
  }
  return (
    <div>
      <div>{num}</div>
      <div>{loading}</div>
      <div onClick={add}>add</div>
      <div onClick={minus}>miuns</div>
    </div>
  )
}

export default About
