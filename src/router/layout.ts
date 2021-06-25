import { RouteRecordRaw, RouteComponent } from 'vue-router'

const DashBoard = (): RouteComponent => import('@/pages/Dashboard/index.vue')

const File = (): RouteComponent => import('@/pages/File/index.vue')
const FileArea = (): RouteComponent => import('@/pages/File/Area.vue')
const FileFolder = (): RouteComponent => import('@/pages/File/Folder.vue')

const AdminUser = (): RouteComponent => import('@/pages/Admin/User.vue')
const AdminUserGroup = (): RouteComponent => import('@/pages/Admin/UserGroup.vue')

const Logs = (): RouteComponent => import('@/pages/Utils/Logger.vue')


const layout: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: DashBoard,
    meta: {
      title: '仪表盘',
      icon: 'el-icon-menu'
    }
  },
  {
    path: '/file',
    name: 'file',
    component: File,
    meta: {
      title: '文件柜',
      icon: 'el-icon-folder-opened'
    },
    redirect: '/file/all',
    children: [
      {
        path: ':path(.*)+',
        name: 'fileFolder',
        props: true,
        meta: {
          title: '文件柜',
          icon: 'el-icon-folder-opened',
          menus: 'fileChildren'
        },
        component: FileFolder,
      },
      {
        path: 'all',
        name: 'fileAll',
        component: FileArea
      },
    ]
  },
  {
    path: '/admin/user',
    name: 'adminUser',
    component: AdminUser
  },
  {
    path: '/admin/user-group',
    name: 'adminUserGroup',
    component: AdminUserGroup
  },
  {
    path: '/logs',
    name: 'logs',
    component: Logs,
    meta: {
      title: '日志',
      icon: 'el-icon-data-analysis'
    }
  }
]

export default layout
