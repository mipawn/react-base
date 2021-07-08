<template>
  <div>
    <section class="dialog-upload" :class="dialogStatus">
      <header class="upload-header">
        <div class="title">
          <span>{{uploadStatusText}}</span>
          <span>（{{uploadSuccessLength}}/{{fileList.length}}）</span>
        </div>
        <div class="actions">
          <i
            v-if="dialogStatus === 'show'"
            class="el-icon-minus"
            @click="changeDialogStatus('hidden')"
          />
          <i
            v-else
            class="el-icon-full-screen"
            @click="changeDialogStatus('show')"
          />
          <i class="el-icon-close" @click="close"></i>
        </div>
      </header>
      <main class="upload-body">
        <ul class="upload-list">
          <li
            v-for="item in fileList"
            :key="item.uid"
            class="upload-file"
            >
            <div
              class="file-progress"
              :style="`width: ${item.percentage}%;`"
            />
            <div class="file-info">
              <div class="file-name">
                <i class="el-icon-tickets"></i>
                <span class="file-name-text">{{item.name}}</span>
              </div>
              <span class="file-size">{{niceBytes(item.size)}}</span>
              <span class="file-path">
                <el-link
                  class="el-link"
                  type="primary"

                  @click.prevent="go(item.path)"
                  >
                  {{item.pathName}}
                </el-link>
              </span>
              <span class="file-status">
                <i class="el-icon-success" v-if="item.status === 'success'"></i>
                <i class="el-icon-error" v-else-if="item.status === 'fail'"></i>
                <span v-else-if="item.status === 'on'">
                  <span style="margin-right: 8px">{{item.percentage}}%</span>
                  <span v-if="item.status === 'on'">{{item.speed}}</span>
                </span>
                <span v-else-if="item.status === 'pause'">已暂停</span>
              </span>
            </div>
            <div class="file-actions" v-if="item.size > 16777216">
              <i
                v-if="item.status === 'on'"
                class="el-icon-video-pause"
              />
              <i
                v-if="item.status === 'pause'"
                class="el-icon-video-play"
              />
              <i
                v-if="['on', 'pause'].includes(item.status)"
                class="el-icon-close"
              />
              <i
                v-if="item.status === 'fail'"
                class="el-icon-refresh"
              />
            </div>
          </li>
        </ul>
      </main>
    </section>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onUnmounted,
  reactive,
  computed,
} from 'vue'
import {
  UPLOAD_STATUS,
  DIALOG_STATUS,
  CHANGE_DIALOG_STATUS,
  UPLOAD_ADD_FILE,
  UPDATE_UPLOAD_URL,
  UPLOAD_SUCCESS,
} from '@/lib/event-bus/upload'
import Bus from '@/lib/event-bus'
import { useRouter } from 'vue-router'
import { uploadObject } from '@/api/bucket'
import { niceBytes } from '@/utils/format'

import {
  ElLink,
  ElMessageBox as messageBox,
} from 'element-plus'

export default defineComponent({
  name: 'UploadDialog',
  props: {
    status: {
      type: String,
      default: 'close',
    },
  },
  components: {
    ElLink,
  },
  setup(props) {
    const router = useRouter()

    const dialogStatus = ref<DIALOG_STATUS>(props.status as DIALOG_STATUS)
    const fileList = reactive<any[]>([])

    const uploadStatusTextMap: Record<UPLOAD_STATUS, string> = {
      on: '上传中',
      success: '上传成功',
      pause: '已暂停',
      fail: '上传失败',
    }
    const uploadStatusText = ref(uploadStatusTextMap.on)

    // uploadurl
    const uploadUrl = ref('')
    const setUploadUrl = (url: any) => {
      uploadUrl.value = url
    }
    Bus.on(UPDATE_UPLOAD_URL, setUploadUrl)

    // 设置dialog状态
    const changeDialogStatus = (status: any) => {
      dialogStatus.value = status
    }
    Bus.on(CHANGE_DIALOG_STATUS, changeDialogStatus)

    const close = () => {
      if (!fileList.find((file: any) => ['on', 'pause'].includes(file.status))) {
        changeDialogStatus('close')
        fileList.length = 0
        return
      }

      messageBox({
        title: '提示',
        message: '还有文件正在上传，是否确认关闭',
        showCancelButton: true,
        cancelButtonText: '取 消',
        confirmButtonText: '确 认',
      })
        .then((action) => {
          if (action === 'confirm') {
            changeDialogStatus('close')
            fileList.length = 0
          }
        })
    }

    // 更新文件列表
    const upadteFileTimer = ref<undefined | number>(undefined)
    const upadteFileList = () => {
      if (upadteFileTimer.value) {
        window.clearTimeout(upadteFileTimer.value)
        upadteFileTimer.value = undefined
      }
      upadteFileTimer.value = window.setTimeout(() => {
        Bus.emit(UPLOAD_SUCCESS)
      }, 300)
    }
    // upload
    const upload = (uploadOptions: any) => {
      const {
        raw,
        size,
        url,
        uid,
      } = uploadOptions
      const index = fileList.findIndex((file: any) => file.uid === uid)
      fileList[index].status = 'on'

      // 大于 16M，就是大文件
      // if (size > 16777216) {
      //   console.log('大文件上传')
      //   return
      // }

      // 小文件上传
      const formData = new FormData()

      const fileName = uploadOptions.name
      formData.append(fileName, raw)
      let lastSize = 0
      let lastTime = new Date().getTime()
      uploadObject({
        url,
        data: formData,
        onProgress: (progressEvent: ProgressEvent) => {
          // console.log(progressEvent)
          const progress = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100,
          )
          fileList[index].percentage = progress

          const intervalSize = (progressEvent.loaded - lastSize) / 1024
          const intervalTime = (new Date().getTime() - lastTime) / 1000
          let speed: number | string = intervalSize / intervalTime
          let speedUnit = 'K/S'
          if (speed * 1 > 1000) {
            speed /= 1024
            speedUnit = 'M/S'
          } else if (speed * 1 > 2000) {
            speed /= 1024 ** 2
            speedUnit = 'G/S'
          }
          speed = `${speed.toFixed(2)}${speedUnit}`
          fileList[index].speed = speed

          lastSize = progressEvent.loaded
          lastTime = new Date().getTime()
        },
      })
        .then(() => {
          fileList[index].status = 'success'
        })
        .catch((err) => {
          console.log(err)
          fileList[index].status = 'fail'
        })
        .finally(() => {
          upadteFileList()
        })
    }

    const go = (path: string) => {
      router.push(path)
      return false
    }

    const uploadSuccessLength = computed(() => {
      return fileList.filter((file: any) => file.status === 'success').length
    })

    // 添加文件
    const addFile = (file: any) => {
      fileList.push(file)
      upload(file)
    }
    Bus.on(UPLOAD_ADD_FILE, addFile)
    onUnmounted(() => {
      Bus.off(UPDATE_UPLOAD_URL, setUploadUrl)
      Bus.off(CHANGE_DIALOG_STATUS, changeDialogStatus)
      Bus.off(UPLOAD_ADD_FILE, addFile)
    })

    return {
      dialogStatus,
      fileList,
      uploadStatusTextMap,
      uploadSuccessLength,
      uploadStatusText,

      changeDialogStatus,
      close,
      niceBytes,
      go,
    }
  },
})
</script>

<style lang="scss" scoped>
.dialog-upload {
  background: #FFF;
  border: 1px solid #E2E2E2;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  bottom: 0;
  box-shadow: 0 0 10px #CCC;
  height: 430px;
  position: fixed;
  right: 30px;
  transition: all 0.8s;
  width: 720px;
  z-index: 2;

  &.hidden {
    bottom: calc(-430px + 44px);
  }

  &.show {
    bottom: 0;
  }

  &.close {
    bottom: -430px;
    display: none;
  }
}

.upload-header {
  align-items: center;
  display: flex;
  height: 44px;
  justify-content: space-between;
  padding: 0 20px;

  .title {
    color: #666;
    font-size: 14px;
  }

  .actions {
    i {
      cursor: pointer;
      margin-left: 10px;
    }
  }
}

.upload-list {
  height: 386px;
  overflow-y: auto;

  &::after {
    content: "";
    display: block;
    height: 30px;
  }
}

.upload-file {
  align-items: center;
  border-bottom: 1px solid #F2F6FD;
  display: flex;
  font-size: 12px;
  height: 50px;
  justify-content: space-between;
  line-height: 50px;
  padding: 0 20px;
  position: relative;
}

.file-progress {
  background: #E2EEFF;
  height: 100%;
  left: 0;
  position: absolute;
  width: 0%;
  z-index: -1;
}

.file-info {
  align-items: center;
  display: flex;
  width: 90%;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 35%;

  .file-name-text {
    margin-left: 10px;
  }

}

.file-size {
  text-align: center;
  text-indent: 10px;
  width: 9%;
}

.file-path {
  display: block;
  line-height: 1;
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 12%;

  .el-link {
    display: inline;
  }
}

.file-status {
  i {
    font-size: 14px;
  }
}

.file-actions {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 8%;

  i {
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
  }
}

.el-icon-success {
  color: green; /* stylelint-disable-line color-named */
}

.el-icon-error {
  color: red; /* stylelint-disable-line color-named */
}
</style>
