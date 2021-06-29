/**
 * 1. 针对路由中的动态路径参数生成菜单在此处手动处理
 * 2. 针对需提前处理的 menu
 */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fileChildren = (account: string) => [
  {
    path: 'all',
    name: 'fileAll',
    meta: {
      title: 'All Zone',
      type: 'all',
    },
  },
  {
    path: `${account}.hot`,
    name: 'fileHot',
    meta: {
      title: 'Hot Zone',
      type: 'hot',
    },
  },
  {
    path: `${account}.freezer`,
    name: 'fileFreezer',
    meta: {
      title: 'Freezer Zone',
      type: 'freezer',
    },
  },
  {
    path: `${account}.shared`,
    name: 'fileShared',
    meta: {
      title: 'Shared Zone',
      type: 'shared',
    },
  },
  {
    path: `${account}.recycle`,
    name: 'fileRecycle',
    meta: {
      title: 'Recycle Bin',
      type: 'recycle',
    },
  },
]
