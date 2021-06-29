<template>
  <div class="user-container">
    <header class="header">
      <el-input
        v-model="searchKey"
        prefix-icon="el-icon-search"
      />
      <el-button
        icon="el-icon-user-solid"
        type="primary"
        >
        加入用户组
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-plus"
        >
        创建用户
      </el-button>
    </header>
    <main class="main">
      <el-table
        :data="userList"
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%;"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="账号"
          prop="accessKey"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          >
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-delete-solid"
              @click="del(scope.row)"
              >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
} from 'vue'
import { getUserList } from '@/api/admin'

import {
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElMessageBox as messageBox,
} from 'element-plus'
import { error } from '@/utils/error'

export default defineComponent({
  name: 'Admin-User',
  components: {
    ElInput,
    ElButton,
    ElTable,
    ElTableColumn,
  },
  setup() {
    const searchKey = ref('')
    const userList = ref([])

    const setUserList = () => {
      getUserList()
        .then((res) => {
          userList.value = res.data.users
        })
        .catch(error)
    }
    onMounted(() => {
      setUserList()
    })

    const handleSelectionChange = () => {

    }

    const del = (user: any) => {
      messageBox({
        title: `删除 ${user.accessKey}`,
        message: `是否确认删除用户 ${user.accessKey}`,
        showCancelButton: true,
        confirmButtonText: '删除',
      })
        .then((action) => {
          if (action === 'confirm') {
            console.log(111)
          }
        })
        .catch(() => {})
    }

    return {
      searchKey,
      userList,

      setUserList,
      handleSelectionChange,
      del,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  align-items: center;
  display: flex;

  button {
    margin-left: 15px;
    width: 140px;
  }
}
</style>
