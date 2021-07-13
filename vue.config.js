/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const { resolve } = require('path')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  productionSourceMap: false,
  publicPath: isDev ? '/' : '/console',
  outputDir: 'console',
  devServer: {
    proxy: {
      // 线上测试
      '/api': {
        target: 'https://hz.endpoint.byteark.xyz/',
        changeOrigin: true,
        ws: false,
      },
      // yeates的测试环境
      // '/api': {
      //   target: 'http://192.168.131.25:9090/',
      //   changeOrigin: true,
      //   ws: false,
      // },
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
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // i18n build 修复
        __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      }),
    ],
  },
}
