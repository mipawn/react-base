import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

function About() {
  const history = useHistory()
  function goIndex() {
    history.push('/')
  }
  return (
    <div onClick={goIndex}>
      {/* <Link className="App-link" to='/'>首页</Link> */}
      {/* <Link className="App-link" to='/about'>about</Link> */}
      首页
    </div>
  )
}

export default About
