import { FC } from 'types/index'
import { Link } from 'react-router-dom'
import Logo from 'assets/img/logo/logo.png'
import './logo.scss'

interface LogoProps {
  to?: string,
  title?: string,
  logo?: string,
  collapsed: boolean
}
const MenuLogo: FC<LogoProps> = (props) => {
  const {
    to = '/', logo = Logo, title = 'Console', collapsed,
  } = props
  return (
    <Link className="logo" to={to}>
      <img src={logo} alt="Console" />
      {!collapsed && (<div className="title">{title}</div>)}
    </Link>
  )
}

export default MenuLogo
