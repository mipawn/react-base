import { Spin } from 'antd'
import type { SpinProps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { FC } from 'types/index'

import styles from './index.module.scss'

interface IProps extends SpinProps{
  fontSize?: number,
}

const Loading: FC<SpinProps> = ({ fontSize = 24, ...spinProps }: IProps) => {
  const antIcon = <LoadingOutlined style={{ fontSize }} spin />
  return (
    <div className={styles['loading-container']}>
      <Spin indicator={antIcon} {...spinProps} />
    </div>
  )
}

export default Loading
