<template>
  <div class="remain-container">
    <div class="section">
      <el-progress
        :percentage="
          !hotBucket.total
            ? 0
            : hotBucket.total / hotBucket.size
        "
        :show-text="false"
      />
      <div class="remain-info">
        <span>
          <span>{{formatSize(hotBucket.size)}} / </span>
          <span>{{formatSize(hotBucket.total)}}</span>
        </span>

        <span>常温区</span>
      </div>
    </div>
    <div class="section">
      <el-progress
        :percentage="
          !hotBucket.total
            ? 0
            : freezerBucket.total / freezerBucket.size
        "
        :show-text="false"
      />
      <div class="remain-info">
        <span>
          {{formatSize(freezerBucket.size)}} /
          {{formatSize(freezerBucket.total)}}
        </span>
        <span>冷冻区</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
} from 'vue'
import { useStore } from 'vuex'
import { niceBytes } from '@/utils/format'

import {
  ElProgress,
} from 'element-plus'

export default defineComponent({
  name: 'RemainContainer',
  components: {
    ElProgress,
  },
  setup() {
    const store = useStore()
    const hotBucket = computed(() => store.state.bucket.hot)
    const freezerBucket = computed(() => store.state.bucket.freezer)
    const formatSize = (size: string) => {
      if (!size) {
        return '无限'
      }
      return niceBytes(size)
    }
    return {
      hotBucket,
      freezerBucket,

      formatSize,
    }
  },
})
</script>

<style lang="scss" scoped>
.remain-container {
  color: #FFF;
  position: absolute;
  bottom: 20px;
  width: 80%;
  padding: 0 20px;
}
.section ~ .section {
  margin-top: 15px;
}
.remain-info {
  margin-top: 5px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
