<template>
  <div class="file-view">
    <div class="header">
      <el-input
        v-model="searchKey"
        :placeholder="t('file.searchBuckets')"
        prefix-icon="el-icon-search"
        @input="search"
      />
      <el-button
        circle
        icon="el-icon-refresh-right"
        style="border: none;font-size: 24px"
        @click="setBucketsList"
      />
      <el-button
        v-if="createBucketPermission && createBucketPermission.can"
        icon="el-icon-plus"
        type="primary"
        >
        创建文件夹
      </el-button>
    </div>
    <div class="body">
      <el-table
        :data="bucketList"
        stripe
        style="width: 100%;margin-top: 30px;"
        row-class-name="table-row"
        @row-click="goFolder"
        >
        <el-table-column
          prop="name"
          :label="t('file.name')"
          >
          <template #default="scope">
            <i class="el-icon-shopping-bag-2"></i>
            <span v-if="account === 'admin'">{{scope.row.name}}</span>
            <span v-else>{{formatName(scope.row.name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          width="200"
          :label="t('file.size')"
          >
          <template #default="scope">
            <span>{{niceBytes(scope.row.size)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watchEffect,
  ref,
  computed
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getBucketsList } from '@/api/bucket'
import { error } from '@/utils/error'
import { niceBytes } from '@/utils/format'
import Bus from '@/lib/event-bus'
import { useI18n } from 'vue-i18n'

import {
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn
} from 'element-plus'

export default defineComponent({
  name: 'fileArea',
  components: {
    ElInput,
    ElButton,
    ElTable,
    ElTableColumn
  },
  props: {
    permissionList: {
      type: Array,
      default: () => []
    }
  },
  setup(props, context) {
    const { t } = useI18n()
    const route = useRoute()
    const store = useStore()
    const router = useRouter()

    const createBucketPermission = ref({})
    const bucketList = ref([])
    const bucketListRaw = ref([])
    const type = ref('all')
    const account = computed(() => store.state.user.userInfo.account)

    // 获取权限
    watchEffect(() => {
      createBucketPermission.value = props
        .permissionList
        .find((permission: any) => permission.id === 'createBucket') as any
    })

    // 获取列表
    const setBucketsList = () => {
      Bus.emit('setPageLoading', true)
      getBucketsList()
        .then(res => {
          const bucketsObj = res.data.buckets.reduce(function (pre: any, current: any) {
            const splitName = current.name.split('.')
            current.type = splitName[splitName.length - 1]
            const name = splitName[0]
            pre[name] = pre[name] || []
            pre[name].push(current)
            return pre
          }, {})
         
          Object.values(bucketsObj).forEach((item: any) => {
            const order: string[] = ['hot', 'freezer', 'shared', 'recycle'];
            (item as any[] ).sort((start, next) => {
              return order.indexOf(start.type) - order.indexOf(next.type)
            })
          })
          const buckets: any = Object.values(bucketsObj).flat(2)
          bucketList.value = buckets
          bucketListRaw.value = buckets
        })
        .catch(error)
        .finally(() => {
          Bus.emit('setPageLoading', false)
        })
    }
    watchEffect(() => {
      type.value = `${route.meta.type}`
      route.name === 'fileAll' && setBucketsList()
    })

    // format
    const formatName = (name: string) => {
      return name.split('.').slice(1).join('')
    }

    const goFolder = (area: any) => {
      router.push({ path: `/file/${area.name}` })
    }

    const searchKey = ref('')
    const search = () => {
      if (!searchKey.value) {
        bucketList.value = bucketListRaw.value
        return
      }
      bucketList.value = bucketListRaw.value.filter((item: any) => {
        return item.name.includes(searchKey.value)
      })
    }

    return {
      type,
      bucketList,
      searchKey,
      createBucketPermission,
      account,
      setBucketsList,
      niceBytes,
      formatName,
      goFolder,
      search,
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
}
.el-icon-shopping-bag-2 {
  margin-right: 8px;
}
:deep(.table-row) {
  cursor: pointer;
}
</style>
