<template>
  <div class="folder" :key="uniqurKey">
    <template v-if="currentType === 'folder'">
      <div class="header">
        <div class="actions">
          <el-dropdown>
            <el-button type="primary">
              <i class="el-icon-upload2"></i>
              {{t('file.upload.uploadButton')}}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <Upload
                    type="file"
                    :uploadUrl="uploadUrl"
                    :pathName="pathName"
                    @success="uploadSuccess"
                    >
                  {{t('file.upload.uploadFile')}}
                  </Upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <Upload
                    type="dir"
                    :uploadUrl="uploadUrl"
                    :pathName="pathName"
                    @success="uploadSuccess"
                    >
                  {{t('file.upload.uploadFolder')}}
                  </Upload>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown>
            <el-button plain>
              <i class="el-icon-folder-add"></i>
              {{ t('file.new.newButton') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="toggleFolderCeateModel"
                  >
                  {{ t('file.new.newFolder') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="search">
          <el-input
            v-model="searchKey"
            :placeholder="t('file.searchObjects')"
            prefix-icon="el-icon-search"
            @input="search"
          />
        </div>
      </div>
      <div class="body">
        <el-table
          :data="objectsList"
          style="
            margin-top: 30px;
            width: 100%;
          "
          row-class-name="table-row"
          >
          <el-table-column
            prop="name"
            :label="t('file.name')"
            >
            <template #default="scope">
              <i
                v-if="scope.row.type === 'folder'"
                class="icon-type el-icon-folder"
                >
              </i>
              <i
                v-else-if="scope.row.type === 'file'"
                class="icon-type el-icon-tickets"
                >
              </i>
              <el-link
                :underline="false"
                @click.prevent="rowClick(scope.row)"
                >
                <span>{{formatName(scope.row.name, scope.row.type )}}</span>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('file.sign')"
            >
            <template #default="scope">
              <el-tooltip
                v-if="scope.row.type === 'file'"
                class="item"
                effect="dark"
                :content="scope.row.etag"
                placement="top"
                >
                <span
                  class="text-ellipsis-oneline"
                  >
                  {{scope.row.etag}}
                </span>
              </el-tooltip>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            :label="t('file.fileType')"
            >
            <template #default="scope">
              <span v-if="scope.row.type === 'file'">{{scope.row.suffix}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
           <el-table-column
            width="150"
            :label="t('file.storageType')"
            >
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template #default="scope">
              <span>-</span>
              <!-- <span
                v-if="scope.row.type === 'file'"
                >
                {{scope.row.suffix}}
              </span>
              <span v-else>-</span> -->
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            prop="last_modified"
            :label="t('file.lastModified')"
            >
            <template #default="scope">
              <span
                v-if="scope.row.type === 'file'"
                >
                {{dateFormat(scope.row.last_modified)}}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            prop="size"
            :label="t('file.size')"
            >
            <template #default="scope">
              <span
                v-if="scope.row.type === 'file'"
                >
                {{niceBytes(scope.row.size)}}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            :label="t('file.options')"
            >
            <template #default="scope">
              <el-button
                type="text"
                @click="(e) => down(scope.row, e)"
                >
                <i
                  v-if="scope.row.downLoading"
                  class="icon-action el-icon-loading"
                />
                <i
                  v-else
                  class="icon-action el-icon-download"
                />
              </el-button>
              <el-button
                type="text"
                @click="(e) => del(scope.row, e)"
                >
                <i class="icon-action el-icon-delete"></i>
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
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getObjectsList, delObject } from '@/api/bucket'
import { error } from '@/utils/error'
import { niceBytes, dateFormat } from '@/utils/format'
import { downloadObject } from '@/utils/download'
import { fileChildren } from '@/components/Layout/menu' // file menus

import { v4 as uuidv4 } from 'uuid'
import { useI18n } from 'vue-i18n'

import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElMessage as message,
  ElMessageBox as messageBox,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElTooltip,
  ElLink,
} from 'element-plus'
import FolderCreate from './components/CreateFolder.vue'
import FileDetails from './Details.vue'
import Upload from './components/Upload.vue'

export default defineComponent({
  name: 'file-folder',
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElTooltip,
    ElLink,

    FolderCreate,
    FileDetails,
    Upload,
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
    const route = useRoute()
    const store = useStore()

    const account = computed(() => store.state.user.userInfo.account)
    const pathName = computed(() => {
      if (props.path.length === 1) {
        const menus = fileChildren(account.value)
        const splitPath = (props.path[0] as string).split('.')
        const truePath = splitPath[splitPath.length - 1]
        return menus.find((menu) => menu.path.includes(truePath))?.meta.title
      }
      return props.path[props.path.length - 1]
    })

    const uploadTimer = ref<undefined | number>(undefined)

    const uniqurKey = ref('')
    const currentPath = computed(
      () => props.path && props.path.slice(1).join('/'),
    )
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
          if (res.data.objects == null && props.path.length >= 2) {
            verifyIfIsFile()
            return
          }
          let list = res.data.objects || []
          list = list.map((item : any) => {
            item.type = item.name.endsWith('/')
              ? 'folder'
              : 'file'

            // 设置 下载loading
            item.downLoading = false
            return item
          })
          objectsList.value = list
          objectsListRaw.value = list
        })
        .catch(error)
    }
    watch(
      () => bucketName.value + currentPath.value,
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
      object.downLoading = true
      if (object.type === 'folder') {
        console.log('文件夹下载')
        return
      }
      if (object.size > 104857600) {
        message.info(t('file.down.downBigTips'))
      }
      // 文件下载
      downloadObject(
        bucketName.value as string,
        object.name,
        object.version_id,
        () => {
          object.downLoading = false
        },
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

    const uploadSuccess = () => {
      if (uploadTimer.value !== undefined) {
        window.clearTimeout(uploadTimer.value)
        uploadTimer.value = undefined
      }
      uploadTimer.value = window.setTimeout(() => {
        setObjectsList()
      }, 300)
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
      pathName,

      setObjectsList,
      niceBytes,
      goFolder,
      search,
      dateFormat,
      del,
      down,
      formatName,
      toggleFolderCeateModel,
      uuid: uuidv4,
      rowClick,
      t,
      uploadSuccess,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  align-items: center;
  display: flex;
  justify-content: space-between;

  :deep(.el-dropdown) {
    margin-left: 15px;

    &:first-child {
      margin-left: 0;
    }
  }
}

.icon-type {
  margin-right: 8px;
}

:deep(.table-row) {
  // cursor: pointer;
}

.icon-action {
  font-size: 18px;
}

</style>
