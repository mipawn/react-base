<template>
  <div>
    <router-view :permissionList="permissionList"></router-view>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref
} from 'vue'
// import { hasPermission } from '@/api/user'
// import { error } from '@/utils/error'

export default defineComponent({
  name: 'file',
  setup() {
    const permissionList = ref([])
    onMounted(() => {
      // hasPermission({
      //   actions: [
      //     {
      //       id: "createBucket",
      //       action: "s3:CreateBucket",
      //     },
      //   ],
      // })
      //   .then(res => {
      //     permissionList.value = res.data.permissions
      //   })
      //   .catch(error)
    })

    return {
      permissionList
    }
  },
})
</script>
