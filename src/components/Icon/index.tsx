import * as AllIcons from '@ant-design/icons'
import { createElement } from 'react'
import { FC } from 'types/index'

// TODO: icontfont 图标判断加入

interface IconProps {
  type?: IconType
}

// icon
type AllIconsType = keyof typeof AllIcons
export type IconType<T = AllIconsType> = T extends `${infer a}Outlined` ? a : never

const Icon: FC<IconProps> = (props) => {
  const { type } = props
  if (!type) return (<></>)

  const iconType: AllIconsType = `${type}Outlined`

  const DynamicIcon = createElement(AllIcons[iconType])
  return (
    <>{DynamicIcon}</>
  )
}

export default Icon
