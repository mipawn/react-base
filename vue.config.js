/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')

module.exports = {
  devServer: {
    proxy: {
      // 线上测试
      '/api': {
        target: 'https://hz.endpoint.byteark.xyz:8000/',
        changeOrigin: true,
        ws: false,
      },
      // yeates的测试环境
      /* '/api': {
        target: 'http://192.168.131.25:9090/',
        changeOrigin: true,
        ws: false,
      }, */
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      // i18n tree shaking
      .set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
    // 修复HMR
    config.resolve.symlinks(true)
  },
}
