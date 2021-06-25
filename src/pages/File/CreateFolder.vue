<template>
  <div>
    <el-dialog
      title="创建文件夹"
      v-model="isShow"
      width="30%"
      @close="close"
      >
      <div>
        <div>当前位置：{{path}}</div>
        <div class="input">
          <el-input
            type="text"
            v-model="newPath"
            placeholder="输入文件夹名字"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="create">创 建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch
} from 'vue'
import { useRouter, useRoute } from 'vue-router'

import {
  ElDialog,
  ElButton,
  ElInput,
} from 'element-plus'

export default defineComponent({
  name: 'FolderCreate',
  components: {
    ElDialog,
    ElButton,
    ElInput,
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ''
    }
  },
  emits: ['update:show'],
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()

    const isShow = ref(props.show)
    watch(
      () => props.show,
      (show) => {
        isShow.value = show
      }
    )
    const newPath = ref('')
    const close = () => {
      newPath.value = ''
      context.emit('update:show', false)
    }
    const create = () => {
      router.push(`${route.fullPath}/${newPath.value}`)
      close()
    }
    return {
      isShow,
      newPath,

      close,
      create,
    }
  },
})
</script>

<style lang="scss" scoped>
.input {
  margin-top: 20px;
}
</style>
