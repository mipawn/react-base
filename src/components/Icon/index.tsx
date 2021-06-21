import * as AllIcons from '@ant-design/icons'
import { createElement, CSSProperties } from 'react'
import { FC } from 'types/index'

// TODO: icontfont 图标判断加入

interface IconProps {
  type?: IconType,
  size?: string
}

// icon
type AllIconsType = keyof typeof AllIcons
export type IconType<T = AllIconsType> = T extends `${infer a}Outlined` ? a : never

const Icon: FC<IconProps> = (props) => {
  const { type, size = '16px', ...otherProps } = props
  const IconProps = {
    style: { fontSize: size, verticalAlign: 'middle' },
    ...otherProps,
  }
  if (!type) return (<></>)

  const iconType: AllIconsType = `${type}Outlined`

  const DynamicIcon = createElement(AllIcons[iconType], IconProps)
  return (
    <>{DynamicIcon}</>
  )
}

export default Icon
