import { Button, ButtonProps } from 'antd'
import { FC } from 'types/index'

interface IProps extends ButtonProps {
  to?: string,
}

const Link: FC<IProps> = (props) => {
  const {
    to,
    href,
    children,
    ...others
  } = props
  const addressLink = to || href || ''
  return (
    <Button type="link" href={addressLink} {...others}>{children}</Button>
  )
}

export default Link
