/**
 * 1. 针对路由中的动态路径参数生成菜单在此处手动处理
 * 2. 针对需提前处理的 menu
 */

import store from '@/store/index'
const account = (store as any ).state.user.userInfo.account
const filePre = `${account}.`

export const fileChildren = [
  {
    path: 'all',
    name: 'fileAll',
    meta: {
      title: '全部',
      type: 'all'
    },
  },
  {
    path: `${filePre}hot`,
    name: 'fileHot',
    meta: {
      title: '常温区',
      type: 'hot'
    },
  },
  {
    path: `${filePre}freezer`,
    name: 'fileFreezer',
    meta: {
      title: '冷冻区',
      type: 'freezer'
    }
  },
  {
    path: `${filePre}shared`,
    name: 'fileShared',
    meta: {
      title: '共享区',
      type: 'shared'
    }
  },
  {
    path: `${filePre}recycle`,
    name: 'fileRecycle',
    meta: {
      title: '回收区',
      type: 'recycle'
    }
  },
]