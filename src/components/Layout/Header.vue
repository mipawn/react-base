<template>
  <div class="header">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in breadcrumb.list"
          :key="item.name"
          :to="{ name: item.name, params: item.params }"
          >
         {{te(`menu.${item.meta.title}`) ? t(`menu.${item.meta.title}`) : item.meta.title}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="menus">
      <el-dropdown @command="handleUserCommand">
        <div class="user">
          <el-avatar :size="30" :src="avatarDefault" />
          <span>{{user.account}}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">{{t('global.logout')}}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <Lang />
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  watchEffect,
  computed,
  reactive,
} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElAvatar,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from 'element-plus'
import avatarDefault from '@/assets/img/common/user-default.png'
import Lang from '../Lang.vue'

import * as dynamicMenusModules from './menu'

export default defineComponent({
  name: 'Header',
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElAvatar,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    Lang,
  },
  setup() {
    const { t, te } = useI18n()

    const breadcrumb = reactive({
      list: [],
    })
    const route = useRoute()
    const store = useStore()
    const user = computed(() => store.state.user.userInfo)

    watchEffect(() => {
      const ExtraPath = []
      breadcrumb.list = route.matched.map((routeItem) => {
        let { meta } = routeItem
        const { name } = routeItem
        let { params } = route
        if (name === 'fileFolder' && route.params.path) {
          const path = route.params.path[0]
          params = { path: route.params.path.slice(0, 1) }
          const type = path.split('.').slice(-1).join('')
          const menus = dynamicMenusModules.fileChildren(user.value.account)
          const menu = menus.find((menuItem) => menuItem.path.includes(type))
          meta = menu.meta
          if (route.params.path.length > 1) {
            route.params.path.slice(1).forEach((item, index) => {
              ExtraPath.push({
                name: 'fileFolder',
                meta: {
                  title: item,
                },
                params: { path: route.params.path.slice(0, index + 2) },
              })
            })
          }
        }
        return {
          name,
          meta,
          params,
        }
      })

      if (ExtraPath.length) {
        breadcrumb.list.push(...ExtraPath)
      }
      if (route.name === 'fileAll') {
        breadcrumb.list.splice(breadcrumb.list.length - 1, 1)
      }
    })

    const handleUserCommand = (command) => {
      switch (command) {
        case 'logout':
          store.dispatch('user/logout')
          break
        default:
      }
    }

    return {
      breadcrumb,
      avatarDefault,
      user,

      t,
      te,
      handleUserCommand,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: space-between;
}

.menus {
  align-items: center;
  display: flex;
}

.user {
  align-items: center;
  color: #333;
  display: flex;

  span {
    margin-left: 10px;
  }
}
</style>
