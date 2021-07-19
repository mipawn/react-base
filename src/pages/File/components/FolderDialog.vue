<template>
  <el-dialog
    v-model="show"
    :title="title"
    :close-on-click-modal="false"
    @close="close"
  >
  <el-tree
    lazy
    :load="loadData"
    :props="propsTree"
    >
  </el-tree>
  <template #footer>
    <el-button>取 消</el-button>
    <el-button type="primary">选 择</el-button>
  </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watchEffect,
  PropType,
} from 'vue'
import {
  getBucketsList,
  getObjectsList,
} from '@/api/bucket'
import { useStore } from 'vuex'
import { error } from '@/utils/error'

import {
  ElDialog,
  ElTree,
  ElButton,
} from 'element-plus'

const titleMap = {
  copy: '复制到',
  move: '移动到',
}

export default defineComponent({
  name: 'FolderDialog',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'copy',
    },
    info: {
      type: Object,
      default: () => {},
    },
    path: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  emits: ['update:isShow'],
  components: {
    ElDialog,
    ElTree,
    ElButton,
  },
  setup(props, context) {
    const propsTree = {
      label: 'name',
    }

    const store = useStore()

    const show = ref(props.isShow)
    const account = computed<string>(() => store.state.user.userInfo.account)

    const title = computed(() => {
      return titleMap[props.type as keyof typeof titleMap] || '提示'
    })

    const close = () => {
      context.emit('update:isShow', false)
    }

    watchEffect(() => {
      show.value = props.isShow
    })

    // eslint-disable-next-line consistent-return
    const loadData = async (node: any, resolve: any) => {
      if (node.level === 0) { // 桶
        const res = await getBucketsList().catch(error)
        if (!res || res.status !== 200) return resolve([])
        const data = account.value === 'admin'
          ? res.data.buckets
          : res.data.buckets
            .filter((bucket: any) => bucket.name.includes(account.value))
            .map((bucket: any) => {
              bucket.name = bucket.name.split('.').slice(1).join('')
              return bucket
            })
        return resolve(data)
      }
      return resolve([])
    }

    return {
      show,
      title,
      propsTree,
      account,

      close,
      loadData,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
