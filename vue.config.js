/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        ws: false
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
    // 修复HMR
    config.resolve.symlinks(true)
  },
}