<template>
  <div>
    <template v-for="item in menusList" :key="item.name">
      <el-submenu :index="formatPath(prePath, item.path)" v-if="item.children">
        <template #title>
          <i :class="item.meta && item.meta.icon"></i>
          <span>{{item.meta && t(`menu.${item.meta.title}`)}}</span>
        </template>
        <menu-tree :menusList="item.children" :prePath="formatPath(prePath, item.path)"></menu-tree>
      </el-submenu>
      <el-menu-item v-else :index="formatPath(prePath, item.path)">
        <i :class="(item.meta && item.meta.icon) || ''"></i>
        <span>{{item.meta && t(`menu.${item.meta.title}`)}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  ElMenuItem,
  ElSubmenu,
} from 'element-plus'

export default defineComponent({
  name: 'menuTree',
  props: {
    menusList: {
      type: Array,
      default: () => [],
      required: true,
    },
    prePath: {
      type: String,
      default: '',
    },
  },
  components: {
    ElMenuItem,
    ElSubmenu,
  },
  setup() {
    const { t } = useI18n()

    const formatPath = (prePath: string, path: string) => {
      if (!prePath) return path
      return `${prePath}/${path}`
    }

    return {
      formatPath,
      t,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
