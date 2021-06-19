import { RouteProps } from './type'

const menus: RouteProps[] = [
  {
    path: '/', name: 'dashboard', title: '仪表盘', icon: '',
  },
  {
    path: '/file',
    name: 'file',
    title: '文件柜',
    icon: '',
    children: [
      {
        path: '/all', name: 'fileAll', title: '全部', icon: '',
      },
      {
        path: '/hot', name: 'fileHot', title: '常温区', icon: '',
      },
      {
        path: '/freezer', name: 'filefreezer', title: '冷冻区', icon: '',
      },
    ],
  },
]
export default menus
