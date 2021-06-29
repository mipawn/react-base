<template>
  <div class="folder" :key="uniqurKey">
    <template v-if="currentType === 'folder'">
      <div class="header">
        <el-input
          v-model="searchKey"
          :placeholder="t('file.searchObjects')"
          prefix-icon="el-icon-search"
          @input="search"
        />
        <el-button
          circle
          icon="el-icon-refresh-right"
          style="border-style: none;
  font-size: 24px;"
          @click="setObjectsList"
        />
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="toggleFolderCeateModel"
          >
          {{t('file.createFolder')}}
        </el-button>
        <el-upload
          :http-request="upload"
          :show-file-list="false"
          action=""
          class="upload-demo"
          multiple
        >
          <el-button
            style="margin-left: 15px;"
            icon="el-icon-plus"
            type="primary"
            >
            {{t('file.File')}}
          </el-button>
        </el-upload>
      </div>
      <div class="body">
        <el-table
          :data="objectsList"
          stripe
          style="margin-top: 30px;
  width: 100%;"
          row-class-name="table-row"
          @row-click="rowClick"
          >
          <el-table-column
            prop="name"
            :label="t('file.name')"
            >
            <template #default="scope">
              <i v-if="scope.row.type === 'folder'" class="icon-type el-icon-folder"></i>
              <i v-else-if="scope.row.type === 'file'" class="icon-type el-icon-tickets"></i>
              <span>{{formatName(scope.row.name, scope.row.type )}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last_modified"
            :label="t('file.lastModified')"
            >
            <template #default="scope">
              <span v-if="scope.row.type === 'file'">{{dateFormat(scope.row.last_modified)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            width="200"
            :label="t('file.size')"
            >
            <template #default="scope">
              <span v-if="scope.row.type === 'file'">{{niceBytes(scope.row.size)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            :label="t('file.options')"
            >
            <template #default="scope">
              <el-button
                v-if="scope.row.type === 'file'"
                type="text"
                @click="(e) => down(scope.row, e)"
                >
                {{t('file.download')}}
              </el-button>
              <el-button
                type="text"
                @click="(e) => del(scope.row, e)"
                >
                {{t('file.delButton')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <folder-create
        v-model:show="isShowFolderCeate"
        :path="currentPath"
      />
    </template>
    <file-details
      v-else-if="currentType === 'file'"
      :extraPath="currentPath"
      :type="bucketName"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getObjectsList, delObject, uploadObject } from '@/api/bucket'
import { error } from '@/utils/error'
import { niceBytes, dateFormat } from '@/utils/format'
import { downloadObject } from '@/utils/download'

import { v4 as uuidv4 } from 'uuid'
import NProgress from 'nprogress'
import Bus from '@/lib/event-bus'
import 'nprogress/nprogress.css'
import { useI18n } from 'vue-i18n'

import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElMessage as message,
  ElMessageBox as messageBox,
  ElUpload,
} from 'element-plus'
import FolderCreate from './CreateFolder.vue'
import FileDetails from './details.vue'

export default defineComponent({
  name: 'file-folder',
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput,
    ElUpload,
    FolderCreate,
    FileDetails,
  },
  props: {
    path: {
      type: Array,
      default: () => [''],
    },
  },
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore()
    const uniqurKey = ref('')
    const account = computed(() => store.state.user.userInfo.account)
    const currentPath = computed(() => props.path && props.path.slice(1).join('/'))
    const bucketName = computed(() => props.path[0])
    const uploadUrl = computed(() => {
      let url = `buckets/${bucketName.value}/objects/upload`
      if (currentPath.value !== '') {
        url = `${url}?prefix=${currentPath.value}/`
      }
      return url
    })

    const objectsList = ref([])
    const objectsListRaw = ref([])
    const currentType = ref('folder')

    const verifyIfIsFile = () => {
      if (props.path.length < 2) {
        return
      }
      const extraPath = currentPath.value
        ? `?prefix=${currentPath.value}`
        : ''
      getObjectsList({
        bucketName: bucketName.value as string,
        extraPath,
      })
        .then((res) => {
          if (res.data.objects !== null) {
            currentType.value = 'file'
          } else {
            objectsList.value = []
            objectsListRaw.value = []
          }
        })
        .catch(error)
    }
    const setObjectsList = () => {
      const extraPath = currentPath.value
        ? `?prefix=${currentPath.value}/`
        : ''
      currentType.value = 'folder'
      getObjectsList({
        bucketName: bucketName.value as string,
        extraPath,
      })
        .then((res) => {
          if (res.data.objects == null) {
            verifyIfIsFile()
            return
          }
          let list = res.data.objects || []
          list = list.map((item : any) => {
            item.type = item.name.endsWith('/')
              ? 'folder'
              : 'file'
            return item
          })
          objectsList.value = list
          objectsListRaw.value = list
        })
        .catch(error)
    }
    watch(
      () => currentPath.value,
      () => {
        setObjectsList()
      },
      {
        immediate: true,
      },
    )

    const searchKey = ref('')
    const search = () => {
      if (!searchKey.value) {
        objectsList.value = objectsListRaw.value
        return
      }
      objectsList.value = objectsListRaw
        .value
        .filter((item: any) => item.name.includes(searchKey.value))
    }

    const goFolder = (object: any) => {
      const name = object.name.endsWith('/')
        ? object.name.slice(0, -1)
        : object.name
      router.push({ path: `/file/${bucketName.value}/${name}` })
    }

    const del = async (object: any, e: Event) => {
      e.stopPropagation()
      const action = await messageBox({
        title: t('file.del.delTitle'),
        type: 'warning',
        message: `${t('file.del.delMessage')} ${object.name}`,
        showCancelButton: true,
        cancelButtonText: t('file.cancel'),
        confirmButtonText: t('file.delButton'),
      }).catch(error)
      if (action !== 'confirm') return
      delObject({
        selectedBucket: bucketName.value as string,
        selectedObject: object.name,
        recursive: object.type === 'folder',
      })
        .then(() => {
          message.success(t('file.del.delSuccess'))
          setObjectsList()
        })
        .catch(error)
    }
    const down = (object: any, e: Event) => {
      e.stopPropagation()
      if (object.size > 104857600) {
        // If file is bigger than 100MB we show a notification
      }

      downloadObject(
        bucketName.value as string,
        object.name,
        object.version_id,

      )
    }

    const formatName = (name: string, type: string) => {
      if (type === 'folder') {
        return name.replaceAll('/', '')
      }
      const nameArr = name.split('/')
      return nameArr[nameArr.length - 1]
    }

    const isShowFolderCeate = ref(false)
    const toggleFolderCeateModel = () => {
      isShowFolderCeate.value = !isShowFolderCeate.value
    }

    const rowClick = (row: any) => {
      goFolder(row)
    }

    const upload = (uploadOptions: any) => {
      Bus.emit('setPageLoading', true)
      NProgress.start()

      const { file } = uploadOptions
      const formData = new FormData()

      const fileName = file.name
      const blobFile = new Blob([file])
      formData.append(fileName, blobFile)

      uploadObject({
        url: uploadUrl.value,
        data: formData,
        onProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          NProgress.set(progress / 100)
          if (progress >= 100) {
            NProgress.done()
            message.success(t('file.upload.uploadSuccess'))
            setObjectsList()
          }
        },
      })
        .catch((err) => {
          console.log(err)
          Bus.emit('setPageLoading', false)
          NProgress.done()
          message({
            message: t('file.upload.uploadFail'),
            type: 'error',
          })
        })
        .finally(() => {
          Bus.emit('setPageLoading', false)
          NProgress.done()
        })
    }

    return {
      objectsList,
      account,
      searchKey,
      bucketType: new Date(),
      isShowFolderCeate,
      currentPath,
      uploadUrl,
      currentType,
      bucketName,
      uniqurKey,

      setObjectsList,
      niceBytes,
      goFolder,
      search,
      dateFormat,
      del,
      down,
      upload,
      formatName,
      toggleFolderCeateModel,
      uuid: uuidv4,
      rowClick,
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  align-items: center;
  display: flex;
}

.icon-type {
  margin-right: 8px;
}

:deep(.table-row) {
  cursor: pointer;
}

</style>
