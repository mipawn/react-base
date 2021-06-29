import { RouteRecordRaw, RouteComponent } from 'vue-router'

const DashBoard = (): RouteComponent => import('@/pages/Dashboard/index.vue')

const File = (): RouteComponent => import('@/pages/File/index.vue')
const FileArea = (): RouteComponent => import('@/pages/File/Area.vue')
const FileFolder = (): RouteComponent => import('@/pages/File/Folder.vue')

// const Admin = (): RouteComponent => import('@/pages/Admin/index.vue')
// const AdminUser = (): RouteComponent => import('@/pages/Admin/User.vue')
// const AdminUserGroup = (): RouteComponent => import('@/pages/Admin/UserGroup.vue')

const Utils = (): RouteComponent => import('@/pages/Utils/index.vue')
const Logs = (): RouteComponent => import('@/pages/Utils/Logger.vue')

const layout: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: DashBoard,
    meta: {
      title: 'dashboard',
      icon: 'el-icon-menu',
    },
  },
  {
    path: '/file',
    name: 'file',
    component: File,
    meta: {
      title: 'fileCabinet',
      icon: 'el-icon-folder-opened',
    },
    redirect: '/file/all',
    children: [
      {
        path: ':path(.*)+',
        name: 'fileFolder',
        props: true,
        meta: {
          title: 'fileCabinet',
          icon: 'el-icon-folder-opened',
          menus: 'fileChildren',
        },
        component: FileFolder,
      },
      {
        path: 'all',
        name: 'fileAll',
        component: FileArea,
      },
    ],
  },
  /* {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: {
      title: '管理员',
      icon: 'el-icon-user'
    },
    children: [
      {
        path: 'admin/user',
        name: 'adminUser',
        component: AdminUser,
        meta: {
          title: '用户',
          icon: ''
        },
      },
      {
        path: 'admin/user-group',
        name: 'adminUserGroup',
        component: AdminUserGroup,
        meta: {
          title: '用户组',
          icon: ''
        },
      },
    ]
  }, */
  {
    path: '/utils',
    name: 'utils',
    component: Utils,
    redirect: '/utils/logs',
    meta: {
      title: 'utils',
      icon: 'el-icon-s-tools',
    },
    children: [
      {
        path: 'logs',
        name: 'logs',
        component: Logs,
        meta: {
          title: 'log',
        },
      },
    ],
  },
]

export default layout
