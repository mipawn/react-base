<template>
  <div>
    <section class="dialog-upload" :class="dialogStatus">
      <header class="upload-header">
        <div class="title">
          <span>已上传</span>
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
            v-for="(item, index) in fileList"
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
                <i
                  class="el-icon-success"
                  v-if="item.status === 'success'"
                />
                <i
                  class="el-icon-error"
                  v-else-if="['cancel', 'fail'].includes(item.status)"
                />
                <span v-else-if="item.status === 'on'">
                  <span style="margin-right: 8px">{{item.percentage}}%</span>
                  <span v-if="item.status === 'on'">{{item.speed}}</span>
                </span>
                <span style="margin-left: 8px">
                  {{uploadStatusTextMap[item.status]}}
                </span>
              </span>
            </div>
            <div class="file-actions">
              <span v-if="item.size > 16777216">
                <i
                  v-if="item.status === 'on'"
                  class="el-icon-video-pause"
                  @click="pauseUpload(index)"
                />
                <i
                  v-if="item.status === 'pause'"
                  class="el-icon-video-play"
                  @click="reUpload(index)"
                />
              </span>
              <span v-else class="empty">
              </span>
              <i
                v-if="['on', 'pause', 'ready'].includes(item.status)"
                class="el-icon-close"
                @click="removeUpload(index)"
              />
              <i
                v-if="['fail', 'cancel'].includes(item.status)"
                class="el-icon-refresh"
                @click="reUpload(index)"
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
import {
  uploadObject,
  uploadPreCreate,
  createUploadChunk,
  uploadMerge as uploadMergeApi,
} from '@/api/bucket'
import { niceBytes } from '@/utils/format'

import {
  ElLink,
  ElMessageBox as messageBox,
  ElMessage as message,
} from 'element-plus'
import { error } from '@/utils/error'
import { source } from '@/utils/http'
import axios from 'axios'

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
    const fileList = reactive<any[]>([]) // 文件列表
    const isUploading = ref(false)

    const uploadStatusTextMap: Record<UPLOAD_STATUS, string> = {
      on: '上传中',
      success: '上传成功',
      pause: '已暂停',
      fail: '上传失败',
      ready: '已就绪',
      cancel: '已取消',
    }

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
            source.cancel()
            fileList.length = 0
          }
        })
    }
    // 获取上传速度
    interface getSpeedParams {
      progressEvent: ProgressEvent,
      decimal?: number,
      lastTime: number,
      lastSize: number
    }
    const getSpeed = ({
      progressEvent,
      decimal = 2,
      lastTime,
      lastSize,
    }: getSpeedParams) => {
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
      return `${speed.toFixed(decimal)}${speedUnit}`
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
    // 获取分片策略
    const preUpload = async (fileOpions: any): Promise<any> => {
      const {
        bucketName,
        targetPath,
        size,
        name,
        uid,
      } = fileOpions
      const res = await uploadPreCreate({
        bucketName,
        targetPath,
        objectName: name,
        size,
      })
      if (res && res.status === 200) return res.data
      const index = fileList.findIndex((file: any) => file.uid === uid)
      if (index > -1) {
        fileList[index].status = 'fail'
      }
      isUploading.value = false
      return ''
    }

    // 分片上传
    const uploadChunks = async (
      partInfoList: any[],
      file: File,
      uid: number,
      uploadID: string,
    ) => {
      const index = fileList.findIndex((fileItem: any) => {
        return fileItem.uid === uid
      })
      fileList[index].partInfoList = partInfoList
      fileList[index].uploadID = uploadID

      let lastTime = new Date().getTime()
      let lastSize = 0

      for (let i = 0; i < partInfoList.length; i++) {
        const item = partInfoList[i]
        const data = i === partInfoList.length - 1
          ? file.slice(i * item.contentLength, item.contentLength)
          : file.slice(-item.contentLength)
        const formData = new FormData()
        formData.append(`chunk${item.partNumber}`, data)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { 'User-Agent': _, ...headers } = item.headers
        let cancelToken: null | typeof axios.CancelToken = axios.CancelToken
        let sourceItem:
          null | ReturnType<
            typeof axios.CancelToken.source
          > = cancelToken.source()
        fileList[index].source = sourceItem

        // eslint-disable-next-line no-await-in-loop
        const res = await createUploadChunk({
          url: item.uploadUrl,
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
          // eslint-disable-next-line no-loop-func
          onProgress(progressEvent: ProgressEvent) {
            fileList[index].speed = getSpeed({
              progressEvent,
              lastTime,
              lastSize,
            })

            lastSize = progressEvent.loaded
            lastTime = new Date().getTime()
          },
          cancelToken: sourceItem && sourceItem.token,
        }).catch((err: any) => err)
        if (res.message === 'cancel') {
          fileList[index].status = fileList[index].status === 'pause'
            ? 'pause'
            : 'cancel'
          break
        }
        const { etag } = res.headers
        if (!etag) {
          fileList[index].status = 'fail'
          break
        }
        partInfoList[i].etag = JSON.parse(etag)
        const percentage = ((i + 1) * 100 / partInfoList.length).toFixed(2)
        fileList[index].percentage = percentage
        if (i === partInfoList.length - 1) {
          (fileList[index].status = 'success')
        }
        cancelToken = null
        sourceItem = null
      }
      if (['success', 'cancel'].includes(fileList[index].status)) {
        fileList[index].partInfoList = ''
      }
      return true
    }
    // 分片合并
    const uploadMerge = async (data: any) => {
      return uploadMergeApi(data)
        .then(() => {
          upadteFileList()
        })
        .catch(() => {
          isUploading.value = false
        })
    }

    // 大文件上传
    const uploadSlice = async (fileOpions: any) => {
      let { partInfoList, uploadID } = fileOpions
      const { percentage, lastTime } = fileOpions
      const interval = new Date().getTime() - lastTime
      const maxTime = 24 * 60 * 60 * 1000 // 24h 会清除未上传完成的
      if (percentage > 0 && interval < maxTime && partInfoList) {
        const index = Math.floor(partInfoList.length * percentage / 100)
        partInfoList = partInfoList.slice(index)
      }
      let uploadInfo
      if (!partInfoList) {
        // 获取分片策略
        uploadInfo = await preUpload(fileOpions)
        if (!uploadInfo) {
          message.error('上传失败')
          return
        }
        partInfoList = uploadInfo.partInfoList
        uploadID = uploadInfo.uploadID
      }
      const {
        bucketName,
        targetPath,
        name,
      } = fileOpions
      // 开始上传
      const res = await uploadChunks(
        partInfoList,
        fileOpions.raw,
        fileOpions.uid,
        uploadID,
      )
      if (!res) return
      const complMultipartUpload = partInfoList.map((item: any) => {
        return {
          partNumber: item.partNumber,
          ETag: item.etag,
        }
      })
      await uploadMerge({
        bucketName,
        uploadID,
        targetPath,
        objectName: name,
        complMultipartUpload,
      })
    }
    // 上传
    const upload = async (uploadOptions: any) => {
      const {
        raw,
        size,
        url,
        uid,
      } = uploadOptions
      const index = fileList.findIndex((file: any) => file.uid === uid)
      fileList[index].status = 'on'
      // 大于 16M，就是大文件
      if (size > 16777216) {
        await uploadSlice(uploadOptions).catch((err) => {
          console.log(err)
          if (!fileList || !fileList.length) return
          fileList[index].status = 'fail'
          isUploading.value = false
        })
        return
      }

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
          const progress = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100,
          )
          fileList[index].percentage = progress
          fileList[index].speed = getSpeed({
            progressEvent,
            lastTime,
            lastSize,
          })

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
          isUploading.value = false
        })
        .finally(() => {
          upadteFileList()
        })
    }
    // 上传控制
    const uploadProcessing: any = async () => {
      // 每次上传一个，方便控制
      const target = fileList.find((file: any) => file.status === 'ready')
      if (!target) {
        isUploading.value = false
        return
      }
      await upload(target)
      // eslint-disable-next-line consistent-return
      return uploadProcessing()
    }
    // 移除上传
    const removeUpload = (index: number) => {
      const target = fileList[index]
      const { status } = target
      if (status === 'on') {
        target.source && target.source.cancel()
      }
      fileList[index].status = 'cancel'
    }
    // 重新上传
    const reUpload = (index: number) => {
      fileList[index].status = 'ready'
      if (isUploading.value === false) {
        isUploading.value = true
        uploadProcessing()
      }
    }
    // 暂停
    const pauseUpload = (index: number) => {
      const target = fileList[index]
      fileList[index].status = 'pause'
      fileList[index].lastTime = new Date().getTime()
      target.source && target.source.cancel()
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
      if (!isUploading.value) {
        isUploading.value = true
        uploadProcessing()
      }
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
      isUploading,

      changeDialogStatus,
      close,
      niceBytes,
      go,
      removeUpload,
      reUpload,
      pauseUpload,
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
  .empty {
    display: inline-block;
    width: 14px;
  }
}

.el-icon-success {
  color: green; /* stylelint-disable-line color-named */
}

.el-icon-error {
  color: red; /* stylelint-disable-line color-named */
}
</style>
