<template>
  <div>
    <el-dialog
      v-model="isShow"
      title="文件分享"
      width="50%"
      @close="close"
      >
      <div>
        <div class="header">
          <span>自定义有效期(默认7天)  </span>
          <el-switch v-model="isCustomUtil" />
          <el-date-picker
            style="margin-left: 20px"
            v-model="customDate"
            v-if="isCustomUtil" 
            type="date"
            placeholder="选择日期"
            :disabledDate="disabledDate"
            @change="setDate"
          />
        </div>
        <div class=""></div>
        <div class="body">
          <el-input type="text" v-model="url" readonly />
          <el-button
            type="primary"
            v-clipboard:copy="url"
            v-clipboard:success="copySuccess"
            v-clipboard:error="copyError"
            >
            复制
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch
} from 'vue'
import { shareObject } from '@/api/bucket'

import {
  ElDialog,
  ElInput,
  ElButton,
  ElSwitch,
  ElDatePicker,
  ElMessage as message
} from 'element-plus'
import { error } from '@/utils/error'

export default defineComponent({
  name: 'ShareFile',
  components: {
    ElDialog,
    ElInput,
    ElButton,
    ElSwitch,
    ElDatePicker,
  },
  emits: ['update:show'],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    bucketName: {
      type: String,
      default: ''
    },
    file: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, context) {
    const isShow = ref(props.show)
    const isCustomUtil = ref(false)
    const customDate = ref('')
    const url = ref('')

    watch(
      () => props.show,
      (val) => {
        isShow.value = val
        if (val) {
          shareObject({
            bucketName: props.bucketName,
            diffDate: '',
            file: props.file
          })
          .then(res => {
            url.value = res.data
          })
          .catch(error)
        }
      }
    )

    const close = () => {
      isCustomUtil.value = false
      customDate.value = ''
      url.value = ''
      context.emit('update:show', false)
    }

    const disabledDate = (date: any) => {
      const curentDate = new Date(date).getTime()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayTime = today.getTime()
      const maxDay = new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      if (curentDate < todayTime || curentDate > maxDay) {
        return true
      }
      return false
    }
    const setDate = (date: any) => {
      let time = new Date(date).getTime() - new Date().getTime()
      if (time > 604800000) {
        time = 604800000
      }
      shareObject({
        bucketName: props.bucketName,
        diffDate: time,
        file: props.file
      })
      .then(res => {
        url.value = res.data
      })
      .catch(error)
    }

    const copySuccess = () => {
      message.success('复制成功')
    }
    const copyError = () => {
      message.warning('浏览器不支持')
    }

    return {
      isShow,
      isCustomUtil,
      customDate,
      url,

      close,
      disabledDate,
      setDate,
      copySuccess,
      copyError,
    }
  },
})
</script>

<style lang="scss" scoped>
.body {
  margin-top: 10px;
  display: flex;
  align-items: center;
  button {
    margin-left: 20px;
  }
}
.header {
  line-height: 40px;
  span {
    margin-right: 10px;
  }
}
</style>
