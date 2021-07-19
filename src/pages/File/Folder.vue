<template>
  <div class="folder" :key="uniqurKey">
    <template v-if="currentType === 'folder'">
      <div class="header">
        <div class="actions">

          <!-- 上传 -->
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
                    :bucketName="bucketName"
                    :targetPath="path.slice(1).join('/')"
                    >
                  {{t('file.upload.uploadFile')}}
                  </Upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <Upload
                    type="dir"
                    :uploadUrl="uploadUrl"
                    :pathName="pathName"
                    :bucketName="bucketName"
                    :targetPath="path.slice(1).join('/')"
                    >
                  {{t('file.upload.uploadFolder')}}
                  </Upload>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 新建 -->
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

          <!-- 其他操作 -->
          <div class="actions-other" v-if="rowSelected && rowSelected.length">
            <div class="is-link">
              <i class="el-icon-share"></i>
              <span>分享</span>
            </div>
            <div class="is-link">
              <i class="el-icon-download"></i>
              <span>下载</span>
            </div>
            <div class="is-link" @click="del">
              <i class="el-icon-delete"></i>
              <span>删除</span>
            </div>
            <div
              class="is-link"
              :class="{ disabled: !isCanRename }"
              @click="showRenameEdit"
              >
              重命名
            </div>
            <div class="is-link" @click="toogleFolderDialog('copy')">复制到</div>
            <div class="is-link" @click="toogleFolderDialog('move')">移动到</div>
          </div>
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
          cell-class-name="table-cell"
          @selection-change="handleSelectionChange"
          >
          <!-- 多选框 -->
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            :label="t('file.name')"
            prop="name"
            class-name="table-name"
            >
            <template #default="scope">
              <div class="table-name-info">
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
                <el-input
                  v-if="scope.row.isEditName"
                  v-model="scope.row.newName"
                  autofocus
                  ref="renameInput"
                  @blur="rename(scope.row)"
                  >
                </el-input>
                <span
                  v-else
                  class="is-link text-ellipsis-oneline"
                  style="width: auto"
                  @click.prevent="goFolder(scope.row)"
                  >
                  {{formatName(scope.row.name, scope.row.type )}}
                </span>

              </div>

              <div class="row-actions">
                <i
                  class="el-icon-share is-link primary"
                  :class="{ disabled: scope.row.type === 'folder' }"
                  @click="showShare(scope.row.name)"
                />
                <i
                  v-if="scope.row.downLoading"
                  class="el-icon-loading is-link primary"
                />
                <i
                  v-if="!scope.row.downLoading"
                  class="el-icon-download is-link primary"
                  @click="(e) => down(scope.row, e)"
                />
                <i
                  class="el-icon-more is-link primary"
                />
                <!-- <el-dropdown trigger="hover">
                  <i
                    class="el-icon-more is-link primary"
                  />
                  <template #dropdown>
                    <el-dropdown-menu
                      @mouseenter="dropdownEnter(scope.row)"
                      @mouseleave="dropdownLeave(scope.row)"
                      >
                      <el-dropdown-item>移动到</el-dropdown-item>
                      <el-dropdown-item>复制到</el-dropdown-item>
                      <el-dropdown-item>重命名</el-dropdown-item>
                      <el-dropdown-item
                        @click="(e) => del(scope.row, e)"
                        >
                        删除
                      </el-dropdown-item>
                      <el-dropdown-item>冷冻</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown> -->
              </div>
            </template>
          </el-table-column>

          <el-table-column
            :label="t('file.sign')"
            width="200"
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

          <!-- <el-table-column
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
          </el-table-column> -->
        </el-table>
      </div>

      <folder-create
        v-model:show="isShowFolderCeate"
        :path="currentPath"
      />
    </template>
    <!-- 文件详情 -->
    <file-details
      v-else-if="currentType === 'file'"
      :extraPath="currentPath"
      :type="bucketName"
    />
    <!-- 文件分享 -->
    <file-share
      v-model:show="isShowShare"
      :bucketName="bucketName"
      :file="fileDetails"
    />
    <!-- 树状文件夹弹窗 -->
    <folder-dialog
      v-model:isShow="isShowFolderDialog"
      :type="folderDialogType"
      :info="rowSelected"
      :path="path"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onUnmounted,
  ref,
  watch,
  PropType,
  nextTick,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import {
  getObjectsList,
  delObject,
  getObjectDetails,
  rename as renameApi,
} from '@/api/bucket'
import { error } from '@/utils/error'
import { niceBytes, dateFormat } from '@/utils/format'
import { downloadObject } from '@/utils/download'
import { fileChildren } from '@/components/Layout/menu' // file menus

import { v4 as uuidv4 } from 'uuid'
import { useI18n } from 'vue-i18n'
import Bus from '@/lib/event-bus'
import { UPLOAD_SUCCESS } from '@/lib/event-bus/upload'

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
} from 'element-plus'
import FolderCreate from './components/CreateFolder.vue'
import FileDetails from './Details.vue'
import Upload from './components/Upload.vue'
import FileShare from './components/Share.vue'
import FolderDialog from './components/FolderDialog.vue' // 树状文件夹ee

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

    FolderCreate,
    FileDetails,
    Upload,
    FileShare,
    FolderDialog,
  },
  props: {
    path: {
      type: Array as PropType<string[]>,
      default: () => [''],
    },
  },
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const rowSelected = ref<any[]>([])
    const isShowFolderDialog = ref(false)
    const folderDialogType = ref('')
    const renameInput = ref<HTMLInputElement | null>(null)

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

    const uniqurKey = ref('')
    const currentPath = computed(
      () => props.path && props.path.slice(1).join('/'),
    )
    const bucketName = computed<string>(() => props.path[0])
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
          list = list.map((item: any, index: number) => {
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

    const del = async (e: Event) => {
      const selected = rowSelected.value
      const fileName = selected
        .map((file: any) => file.name)
        .join('、')
      e.stopPropagation()
      const action = await messageBox({
        title: t('file.del.delTitle'),
        type: 'warning',
        message: `${t('file.del.delMessage')} ${fileName}`,
        showCancelButton: true,
        cancelButtonText: t('file.del.cancel'),
        confirmButtonText: t('file.del.confirm'),
      }).catch(error)
      if (action !== 'confirm') return
      const delList = selected.map((item: any) => {
        return delObject({
          selectedBucket: bucketName.value as string,
          selectedObject: item.name,
          recursive: item.type === 'folder',
        })
      })
      const res = await Promise.allSettled(delList)
      if (res.findIndex((item) => item.status !== 'fulfilled') < 0) {
        message.success('删除成功')
        setObjectsList()
      } else {
        const failName = res
          .filter((item) => item.status !== 'fulfilled')
          .map((item: any) => item.name)
          .join('、')
        message.error(`${failName}删除失败`)
      }
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
      if (!name) return ''
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

    Bus.on(UPLOAD_SUCCESS, setObjectsList)
    onUnmounted(() => {
      Bus.off(UPLOAD_SUCCESS, setObjectsList)
    })
    // 选中行
    const handleSelectionChange = (val: any) => {
      rowSelected.value = val
    }
    // 分享
    const isShowShare = ref(false)
    const fileDetails = ref({})
    const setFileDetails = async (name: string) => {
      const path = currentPath.value + name
      getObjectDetails({
        extraPath: `?prefix=${path}`,
        bucketName: `${bucketName.value}`,
      })
        .then((res) => {
          const [detailsInfo] = res.data.objects
          fileDetails.value = detailsInfo
        })
        .catch(error)
    }
    const showShare = async (name: string) => {
      await setFileDetails(name)
      isShowShare.value = !isShowShare.value
    }

    const isCanRename = computed(() => {
      return rowSelected.value.length < 2
    })
    const showRenameEdit = () => {
      // 没有id，通过名字找index可能会重复，只能在原对象上处理
      rowSelected.value[0].isEditName = true
      rowSelected.value[0].newName = rowSelected.value[0].name
      nextTick(() => {
        if (!renameInput.value) return
        renameInput.value.focus()
      })
    }
    const rename = (target: any) => {
      let path = `${props.path.slice(1).join('/')}/${target.name}`
      if (!path.startsWith('/')) {
        path = `/${path}`
      }
      if (target.type === 'folder' && !path.endsWith('/')) {
        path += '/'
      }

      renameApi({
        bucket: `${bucketName.value}`,
        path,
        name: target.newName,
      })
        .then(() => {
          setObjectsList()
        })
        .catch(error)
        .finally(() => {
          rowSelected.value[0].isEditName = false
        })
    }

    const toogleFolderDialog = (type: string) => {
      isShowFolderDialog.value = !isShowFolderDialog.value
      folderDialogType.value = type
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
      isShowShare,
      fileDetails,
      isCanRename,
      rowSelected,
      isShowFolderDialog,
      folderDialogType,
      renameInput,

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
      t,
      handleSelectionChange,
      showShare,
      rename,
      showRenameEdit,
      toogleFolderDialog,
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

.icon-action {
  font-size: 18px;
}

:deep(.table-cell) {
  .cell {
    vertical-align: middle;
    white-space: nowrap;
    width: 100%;
  }

  i {
    font-size: 18px;
  }
}

:deep(.table-name) {
  .cell {
    align-items: center;
    display: flex;
    flex-wrap: no-wrap;
    justify-content: space-between;
    max-width: 100%;
    overflow: unset;
  }
}

.row-actions {
  align-items: center;
  display: flex;
  width: 100px;

  i {
    margin-left: 10px;
  }
}

.table-name-info {
  display: flex;
  align-items: center;
  max-width: calc(100% - 100px);
}

.table-row {
  .row-actions {
    display: none;
  }
  &:hover, &.is-link {
    .row-actions {
      display: flex;
    }
  }
}

.actions {
  display: flex;
  align-items: center;
}
.actions-other {
  margin-left: 15px;
  display: flex;
  align-items: center;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  height: 40px;
  box-sizing: border-box;
  i {
    margin-right: 5px;
  }
  div {
    padding: 12px 20px;
    font-size: 14px;
    border-right: 1px solid #DCDFE6;
    &:last-child {
      border-right: none;
    }
  }
}
</style>
