<template>
  <div>
    <section class="dialog-upload" :class="dialogStatus">
      <header class="upload-header">
        <div class="title">上传成功</div>
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
                  <span>2.85%</span>
                  <span>8.3MB/s</span>
                </span>
                <span v-else>已暂停</span>
              </span>
            </div>
            <div class="file-actions">
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
} from 'vue'
import {
  UPLOAD_STATUS,
  DIALOG_STATUS,
  CHANGE_DIALOG_STATUS,
  UPLOAD_ADD_FILE,
  UPDATE_UPLOAD_URL,
} from '@/lib/event-bus/upload'
import Bus from '@/lib/event-bus'
import { useRouter } from 'vue-router'
import { uploadObject } from '@/api/bucket'
import { niceBytes } from '@/utils/format'

import {
  ElLink,
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
      changeDialogStatus('close')
      fileList.length = 0
    }

    // 添加文件
    const addFile = (file: any) => {
      fileList.push(file)
    }
    Bus.on(UPLOAD_ADD_FILE, addFile)

    // upload
    const upload = (uploadOptions: any) => {
      const { file } = uploadOptions
      const formData = new FormData()

      const fileName = file.name
      const blobFile = new Blob([file])
      formData.append(fileName, blobFile)

      uploadObject({
        url: uploadUrl.value,
        data: formData,
        onProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.floor(
            progressEvent.loaded / progressEvent.total,
          )
          // NProgress.set(progress / 100)
        },
      })
        .then(() => {
          // message.success('file.upload.uploadSuccess')
          // context.emit('success')
        })
        .catch((err) => {
          console.log(err)
          // NProgress.done()
          // message({
          //   message: 'file.upload.uploadFail',
          //   type: 'error',
          // })
        })
        .finally(() => {
          // NProgress.done()
        })
    }

    const go = (path: string) => {
      router.push(path)
      return false
    }

    onUnmounted(() => {
      Bus.off(UPDATE_UPLOAD_URL, setUploadUrl)
      Bus.off(CHANGE_DIALOG_STATUS, changeDialogStatus)
      Bus.off(UPLOAD_ADD_FILE, addFile)
    })

    return {
      dialogStatus,
      fileList,

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
  width: 9%;

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
