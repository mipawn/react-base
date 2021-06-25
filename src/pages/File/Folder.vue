<template>
  <div class="folder" :key="uniqurKey">
    <template v-if="currentType === 'folder'">
      <div class="header">
        <el-input
          v-model="searchKey"
          placeholder="搜索区域"
          prefix-icon="el-icon-search"
          @input="search"
        />
        <el-button
          circle
          icon="el-icon-refresh-right"
          style="border: none;font-size: 24px"
          @click="setObjectsList"
        />
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="toggleFolderCeateModel"
          >
          创建文件夹
        </el-button>
        <el-upload
          :http-request="upload"
          :show-file-list="false"
          action=""
          class="upload-demo"
          multiple
        >
          <el-button
            style="margin-left: 15px"
            icon="el-icon-plus"
            type="primary"
            >
            文件
          </el-button>
        </el-upload>
      </div>
      <div class="body">
        <el-table
          :data="objectsList"
          stripe
          style="width: 100%;margin-top: 30px;"
          row-class-name="table-row"
          @row-click="rowClick"
          >
          <el-table-column
            prop="name"
            label="名称"
            >
            <template #default="scope">
              <i v-if="scope.row.type === 'folder'" class="icon-type el-icon-folder"></i>
              <i v-else-if="scope.row.type === 'file'" class="icon-type el-icon-tickets"></i>
              <span>{{formatName(scope.row.name, scope.row.type )}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last_modified"
            label="最后修改时间"
            >
            <template #default="scope">
              <span v-if="scope.row.type === 'file'">{{dateFormat(scope.row.last_modified)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            width="200"
            label="大小"
            >
            <template #default="scope">
              <span v-if="scope.row.type === 'file'">{{niceBytes(scope.row.size)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="操作"
            >
            <template #default="scope">
              <el-button
                v-if="scope.row.type === 'file'"
                type="text"
                @click="(e) => down(scope.row, e)"
                >
                下载
              </el-button>
              <el-button
                type="text"
                @click="(e) => del(scope.row, e)"
                >
                删除
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
import { getObjectsList, delObject } from '@/api/bucket'
import { error } from '@/utils/error'
import { niceBytes, dateFormat } from '@/utils/format'
import { downloadObject } from '@/utils/download'
import { uploadObject } from '@/api/bucket'
import { v4 as uuidv4 } from 'uuid'

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
      default: () => ['']
    },
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const uniqurKey = ref('')
    const account = computed(() => store.state.user.userInfo.account)
    const currentPath = computed(() => props.path && props.path.slice(1).join('/'))
    const bucketName = computed(() => props.path[0])
    const uploadUrl = computed(() => {
      let uploadUrl = `buckets/${bucketName.value}/objects/upload`
      if (currentPath.value !== '') {
        uploadUrl = `${uploadUrl}?prefix=${currentPath.value}/`;
      }
      return uploadUrl
    })
    
    const upload = (uploadOptions: any) => {
      const { file } = uploadOptions
      const formData = new FormData();

      const fileName = file.name
      const blobFile = new Blob([file]);
      formData.append(fileName, blobFile);
      uploadObject({
        url: uploadUrl.value,
        data: formData,
        onProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          if (progress >= 100) {
            message.success('文件上传成功')
            setObjectsList()
          }
        }
      })
    }

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
        extraPath
      })
      .then(res => {
        if (res.data.objects !== null ) {
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
        extraPath
      })
        .then(res => {
          if (res.data.objects == null ) {
            verifyIfIsFile()
            return
          } 
          let list =  res.data.objects || []
          list = list.map((item : any) => {
            item.name.endsWith('/')
              ? item.type = 'folder'
              : item.type = 'file'
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
        immediate: true
      }
    )

    const searchKey = ref('')
    const search = () => {
      if (!searchKey.value) {
        objectsList.value = objectsListRaw.value
        return
      }
      objectsList.value = objectsListRaw.value.filter((item: any) => {
        return item.name.includes(searchKey.value)
      })
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
        title: '提示',
        type: 'warning',
        message: `确认删除 ${object.name}`,
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).catch(error)
      if (action !== 'confirm') return
      delObject({
        selectedBucket: bucketName.value as string,
        selectedObject: object.name,
        recursive: object.type === 'folder'
      })
        .then(() => {
          message.success('删除成功')
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
      uniqurKey,
      rowClick
    }
  },
})
</script>


<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
}
.icon-type {
  margin-right: 8px;
}
:deep(.table-row) {
  cursor: pointer;
}
</style>