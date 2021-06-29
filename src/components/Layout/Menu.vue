<template>
  <div>
    <el-menu
      :default-active="fullPath"
      style="height: 100vh;
  width: 200px;"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      >
      <menu-tree :menusList="menusList"></menu-tree>
    </el-menu>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watchEffect,
  computed,
} from 'vue'
import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router'
import layoutList from '@/router/layout'
import { useStore } from 'vuex'

import {
  ElMenu,
} from 'element-plus'
import * as dynamicMenusModules from './menu'
import MenuTree from './MenuTree.vue'

export default defineComponent({
  name: 'Menu',
  components: {
    ElMenu,
    MenuTree,
  },
  setup() {
    const route = useRoute()
    const fullPath = ref('/')
    const store = useStore()
    const user = computed(() => store.state.user.userInfo)

    const setFullPath = (routeInfo: RouteLocationNormalizedLoaded) => {
      const { meta, path, params } = routeInfo
      const type = params.path
        ? params.path[0].split('.').slice(-1).join('')
        : path.split('.').slice(-1).join('')
      if (meta && meta.menus === 'fileChildren') {
        const menus = dynamicMenusModules.fileChildren(user.value.account)
        const menu = menus.find((menuItem) => menuItem.path.includes(type))
        fullPath.value = `/file/${menu?.path}`
        return
      }
      fullPath.value = route.path
    }
    watchEffect(() => {
      setFullPath(route)
    })
    const filterObj = (item: any, key: keyof any, val: unknown) => {
      if (item.meta && item.meta[key] === val) return true
      if (item.children) {
        item.children = item
          .children
          .filter((child: any) => filterObj(child, key, val))
      }
      return false
    }
    const menusList = layoutList
      .filter((routeItem) => filterObj(routeItem, 'hidden', undefined))
      .map((routeItem) => {
        if (routeItem.path === '/file') {
          routeItem.children = dynamicMenusModules
            .fileChildren(user.value.account) as any
        }
        return routeItem
      })
    return {
      menusList,
      fullPath,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
