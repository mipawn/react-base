<template>
  <el-upload
    :show-file-list="false"
    :name="type"
    :auto-upload="false"
    :on-change="onChange"
    action=""
    multiple
    >
    <slot />
  </el-upload>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  ref,
  computed,
} from 'vue'
import Bus from '@/lib/event-bus'
import {
  UPLOAD_ADD_FILE,
  CHANGE_DIALOG_STATUS,
} from '@/lib/event-bus/upload'
import { useRoute } from 'vue-router'

import {
  ElUpload,
} from 'element-plus'

export default defineComponent({
  name: 'UploadFile',
  components: {
    ElUpload,
  },
  props: {
    type: {
      type: String,
      default: 'file',
    },
    uploadUrl: {
      type: String,
      default: '',
    },
    pathName: {
      type: String,
      default: '',
    },
  },
  emits: ['success'],
  setup(props) {
    const isShowProgress = ref(true)
    const route = useRoute()

    const onChange = (file: any) => {
      file.url = props.uploadUrl
      file.path = route.path
      file.pathName = props.pathName
      Bus.emit(CHANGE_DIALOG_STATUS, 'show')
      Bus.emit(UPLOAD_ADD_FILE, file)
    }

    onMounted(() => {
      // 添加上传文件夹
      nextTick(() => {
        const uploadDirElList = document.querySelectorAll('.el-upload__input[name="dir"]')
        uploadDirElList.forEach((item: any) => {
          item.webkitdirectory = true
        })
      })
    })

    return {
      isShowProgress,
      onChange,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
