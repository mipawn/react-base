<template>
  <div>
    <el-container>
      <el-aside
        style="
          display: flex;
          width: auto;
        ">
        <Menu></Menu>
      </el-aside>
      <el-container class="page-container">
        <el-header :height="headerHeight">
          <Header></Header>
        </el-header>
        <el-main v-loading="loading" class="main">
          <router-view v-model:loading="loading"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <Upload></Upload>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watchEffect,
  ref,
  onUnmounted,
} from 'vue'
import { getSession } from '@/api/user'
import { error } from '@/utils/error'
import Bus from '@/lib/event-bus'
import { useStore } from 'vuex'

import {
  ElContainer,
  ElHeader,
  ElMain,
  ElAside,
} from 'element-plus'
import Menu from './Menu.vue'
import Header from './Header.vue'
import Upload from '../Upload.vue'

export default defineComponent({
  name: 'layout',
  components: {
    ElContainer,
    ElHeader,
    ElMain,
    ElAside,
    Menu,
    Header,
    Upload,
  },
  setup() {
    const store = useStore()

    const loading = ref(false)
    watchEffect(async () => {
      await getSession()
      await store.dispatch('bucket/updateBucket')
    })
    const setLoading = (status: any): void => {
      loading.value = status
    }
    Bus.on('setPageLoading', setLoading)
    onUnmounted(() => {
      Bus.off('setPageLoading', setLoading)
    })

    return {
      loading,
      headerHeight: '48px',
    }
  },
})
</script>

<style lang="scss" scoped>
$header-height: 48px;

.header {
  border-bottom: 1px solid #EEE;
  height: $header-height;
}

.main {
  max-height: calc(100vh - #{$header-height});
  overflow: auto;
}

.page-container {
  min-width: 1000px;
}
</style>
