import { Module } from 'vuex'
import { getBucketsList } from '@/api/bucket'

interface BucketState {
  hot: Record<string, unknown>,
  freezer: Record<string, unknown>,
}

const Bucket: Module<BucketState, any> = {
  namespaced: true,
  state() {
    return {
      hot: {},
      freezer: {},
    }
  },
  mutations: {
    setBucketData(state, bucketsList) {
      const hot = bucketsList.find((bucket: any) => bucket.name === 'hot')
      const freezer = bucketsList.find((bucket: any) => bucket.name === 'freezer')
      state.hot = hot
      state.freezer = freezer
    },
  },
  actions: {
    async updateBucket(context) {
      const res = await getBucketsList()
      if (res.status === 200) {
        const { account } = context.rootState.user.userInfo
        const data = res.data.buckets
          .filter((item: any) => item.name.includes(account))
          .map((item: any) => {
            const dotIndex = item.name.indexOf('.')
            item.name = item.name.slice(dotIndex + 1)
            return item
          })

        context.commit('setBucketData', data)
      }
      return res
    },
  },
}

export default Bucket
