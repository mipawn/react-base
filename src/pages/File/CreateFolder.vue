<template>
  <div>
    <el-dialog
      :title="t('file.createFolder')"
      v-model="isShow"
      width="30%"
      @close="close"
      >
      <div>
        <div>{{t('file.currentPath')}}：{{path}}</div>
        <div class="input">
          <el-input
            type="text"
            v-model="newPath"
            :placeholder="t('file.createFolderPlaceholder')"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">{{t('file.cancel')}}</el-button>
          <el-button type="primary" @click="create">{{t('file.create')}}</el-button>
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
import { useI18n } from 'vue-i18n'

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
    const { t }= useI18n()
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
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
.input {
  margin-top: 20px;
}
</style>
