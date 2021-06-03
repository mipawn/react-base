import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { RouteComponent } from '../../type/index'

const About: RouteComponent = (props) => {
  const [id, setId] = useState(0)
  console.log(props)
  const history = useHistory()
  function goIndex() {
    setId(id + 1)
    history.push('/about/' + id)
  }
  return (
    <div onClick={goIndex}>
      {/* <Link className="App-link" to='/'>首页</Link> */}
      {/* <Link className="App-link" to='/about'>about</Link> */}
      {id}
    </div>
  )
}

export default About
