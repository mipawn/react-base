<template>
  <div>
    <div class="actions">
      <div class="tips">操作：</div>
      <i class="el-icon-share" @click="openShare"></i>
      <i class="el-icon-download" @click="down"></i>
      <i class="el-icon-delete" @click="del"></i>
    </div>
    <div class="tags">
      <div class="tips">标签：</div>
      <el-button type="primary" size="small">添加标签</el-button>
    </div>
    <file-share
      v-model:show="isShowShare"
      :bucketName="type"
      :file="details"
    />
  </div>
</template>

<script lang="ts">
import { 
  defineComponent,
  onMounted,
  ref
} from 'vue'
import { getObjectDetails, delObject } from '@/api/bucket'
import { error } from '@/utils/error'
import { downloadObject } from '@/utils/download'
import { useRouter, useRoute } from 'vue-router'

import {
  ElButton,
  ElMessageBox as messageBox,
  ElMessage as message,
} from 'element-plus'
import FileShare from './Share.vue'

export default defineComponent({
  name: 'fileDetails',
  props: {
    type: String,
    extraPath: String
  },
  components: {
    ElButton,
    FileShare
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()

    const details = ref<any>({})
    onMounted(() => {
      getObjectDetails({
        extraPath: props.extraPath ? `?prefix=${props.extraPath}` : '',
        bucketName: props.type
      })
        .then(res => {
          details.value = res.data.objects[0]
        })
        .catch(error)
    })

    const down = () => {
      downloadObject(
        props.type || '',
        props.extraPath || '',
        details.value.version_id
      )
    }
    const del = () => {
      messageBox({
        title: '提示',
        type: 'info',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        showCancelButton: true,
        message: `确定删除${props.extraPath}`
      })
      .then(action => {
        if (action === 'confirm') {
          delObject({
            selectedBucket: props.type || '',
            selectedObject: props.extraPath || '',
            recursive: false
          })
            .then(() => {
              message.success('删除成功')
              const backUrl = route.path.split('/').slice(0, -1).join('/')
              router.replace(backUrl)
            })
            .catch(error)
        }
      }).catch(() => {}) 
    }

    const isShowShare = ref(false)

    const openShare = () => {
      isShowShare.value = !isShowShare.value
    }

    return {
      isShowShare,
      details,
      down,
      del,
      openShare,
    }
  },
})
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  align-items: center;
  .tips {
    margin-right: 10px;
  }
  i {
    font-size: 18px;
    margin: 0 4px;
    cursor: pointer;
  }
}
.tags {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>
