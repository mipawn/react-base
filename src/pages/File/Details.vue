<template>
  <div>
    <div class="actions">
      <div class="tips">{{t('file.options')}}：</div>
      <i class="el-icon-share" @click="openShare"></i>
      <i class="el-icon-download" @click="down"></i>
      <i class="el-icon-delete" @click="del"></i>
    </div>
    <div class="tags">
      <div class="tips">{{t('file.label')}}：</div>
      <el-button type="primary" size="small">{{t('file.addLabel')}}</el-button>
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
  ref,
} from 'vue'
import { getObjectDetails, delObject } from '@/api/bucket'
import { error } from '@/utils/error'
import { downloadObject } from '@/utils/download'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import {
  ElButton,
  ElMessageBox as messageBox,
  ElMessage as message,
} from 'element-plus'
import FileShare from './components/Share.vue'

export default defineComponent({
  name: 'fileDetails',
  props: {
    type: String,
    extraPath: String,
  },
  components: {
    ElButton,
    FileShare,
  },
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()

    const details = ref<any>({})
    onMounted(() => {
      getObjectDetails({
        extraPath: props.extraPath ? `?prefix=${props.extraPath}` : '',
        bucketName: props.type,
      })
        .then((res) => {
          const [detailsInfo] = res.data.objects
          details.value = detailsInfo
        })
        .catch(error)
    })

    const down = () => {
      downloadObject(
        props.type || '',
        props.extraPath || '',
        details.value.version_id,
      )
    }
    const del = () => {
      messageBox({
        title: t('file.del.delTitle'),
        type: 'info',
        confirmButtonText: t('file.del.confirm'),
        cancelButtonText: t('file.del.cancel'),
        showCancelButton: true,
        message: `${t('file.del.delMessage')} ${props.extraPath}`,
      })
        .then((action) => {
          if (action === 'confirm') {
            delObject({
              selectedBucket: props.type || '',
              selectedObject: props.extraPath || '',
              recursive: false,
            })
              .then(() => {
                message.success(t('file.del.delSuccess'))
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
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
.actions {
  align-items: center;
  display: flex;

  .tips {
    margin-right: 10px;
  }

  i {
    cursor: pointer;
    font-size: 18px;
    margin: 0 4px;
  }
}

.tags {
  align-items: center;
  display: flex;
  margin-top: 10px;
}
</style>
