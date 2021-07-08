<template>
  <div class="remain-container">
    <div class="section">
      <el-progress
        :percentage="80"
        :show-text="false"
      />
      <div class="remain-info">
        <span>2.2G / 2068G</span>
        <span>常温区</span>
      </div>
    </div>
    <div class="section">
      <el-progress
        :percentage="100"
        :show-text="false"
      />
      <div class="remain-info">
        <span>2.2G / 2068G</span>
        <span>冷冻区</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import {
  ElProgress,
} from 'element-plus'

export default defineComponent({
  name: 'RemainContainer',
  components: {
    ElProgress,
  },
  setup() {

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
