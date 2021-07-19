<template>
  <div>
    <el-empty
      :description="t('global.No data')"
      style="margin-top: 15vh;">
    </el-empty>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { ElEmpty } from 'element-plus'

export default defineComponent({
  name: 'Logger',
  components: {
    ElEmpty,
  },
  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
