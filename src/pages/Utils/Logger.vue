<template>
  <div>
    <el-empty description="暂无内容" style="margin-top: 15vh"></el-empty>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { ElEmpty } from 'element-plus'

export default defineComponent({
  name: 'Logger',
  components: {
    ElEmpty
  },
  setup() {

  },
})
</script>

<style lang="scss" scoped>

</style>
