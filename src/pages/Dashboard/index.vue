<template>
  <div class="dashboard">
    <el-card class="card-container">
      <template #header>
        <div class="card-header">
          <i class="el-icon-pie-chart"></i>
          <span>{{t('dashboard.Usage')}}</span>
        </div>
      </template>
      <span v-if="typeof info.usage === 'string'" class="card-desc">{{info.usage}}</span>
      <template v-else>
        <span class="card-desc">{{info.usage[0]}}</span>
        <span class="small-unit">{{info.usage[1]}}</span>
      </template>
    </el-card>
    <el-card class="card-container">
      <template #header>
        <div class="card-header">
          <i class="el-icon-money"></i>
          <span>{{t('dashboard.Total Objects')}}</span>
        </div>
      </template>
      <span class="card-desc">{{info.objects}}</span>
    </el-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watchEffect,
  reactive,
} from 'vue'
import { getDashboardInfo } from '@/api/user'
import { error } from '@/utils/error'
import { niceBytes } from '@/utils/format'
import { useI18n } from 'vue-i18n'

import {
  ElCard,
} from 'element-plus'

interface DashBaoardType {
  usage?: string | string[],
  objects?: number | string
}
export default defineComponent({
  name: 'Dashboard',
  components: {
    ElCard,
  },
  props: {
    loading: Boolean,
  },
  emits: ['update:loading'],
  setup(_, context) {
    const { t } = useI18n()

    const info = reactive<DashBaoardType>({
      usage: '0',
      objects: 0,
    })
    const prettyUsage = (usage: string | undefined) => {
      if (usage === undefined) {
        return '0'
      }

      const niceBytesUsage = niceBytes(usage).split(' ')

      if (niceBytesUsage.length !== 2) {
        return niceBytesUsage.join(' ')
      }

      return niceBytesUsage
    }
    const prettyNumber = (usage: number | undefined) => {
      if (usage === undefined) {
        return 0
      }

      return usage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    watchEffect(() => {
      context.emit('update:loading', true)
      getDashboardInfo()
        .then((res) => {
          const { usage, objects } = res.data
          info.usage = prettyUsage(`${usage}`)
          info.objects = prettyNumber(objects)
        })
        .catch(error)
        .finally(() => {
          context.emit('update:loading', false)
        })
    })
    return {
      info,

      t,
    }
  },
})
</script>

<style lang="scss" scoped>
.dashboard {
  align-items: center;
  display: flex;
}

.card-container {
  margin-left: 20px;
  width: 280px;

  &:first-child {
    margin-left: 0;
  }
}

.card-header {
  color: #777;

  span {
    font-size: 14px;
    margin-left: 8px;
  }
}

.card-desc {
  color: #000;
  font-size: 60px;
  font-weight: bold;
}

.small-unit {
  font-size: 16px;
  font-weight: 500;
  margin-left: 4px;
}
</style>
