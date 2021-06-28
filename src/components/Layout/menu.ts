/**
 * 1. 针对路由中的动态路径参数生成菜单在此处手动处理
 * 2. 针对需提前处理的 menu
 */

export const fileChildren = (account: string) => [
  {
    path: 'all',
    name: 'fileAll',
    meta: {
      title: '全部',
      type: 'all'
    },
  },
  {
    path: `${account}.hot`,
    name: 'fileHot',
    meta: {
      title: '常温区',
      type: 'hot'
    },
  },
  {
    path: `${account}.freezer`,
    name: 'fileFreezer',
    meta: {
      title: '冷冻区',
      type: 'freezer'
    }
  },
  {
    path: `${account}.shared`,
    name: 'fileShared',
    meta: {
      title: '共享区',
      type: 'shared'
    }
  },
  {
    path: `${account}.recycle`,
    name: 'fileRecycle',
    meta: {
      title: '回收区',
      type: 'recycle'
    }
  },
]