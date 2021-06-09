/* craco.config.js */

/**
 * 参考： https://juejin.cn/post/6871148364919111688
 */

/**
 * TODO:
 * 1. babel-plugin-react-css-modules 是否需要
 * 2. Cssnao 是否需要
 */

const path = require('path')

const { when, whenDev, whenProd } = require('@craco/craco')

const CracoLessPlugin = require('craco-less')
const CracoAntDesignPlugin = require('craco-antd')
const CracoScopedCssPlugin = require('craco-plugin-scoped-css')
const sassResourcesLoader = require('craco-sass-resources-loader')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const WebpackBar = require('webpackbar')

const isProduction = process.env.NODE_ENV === 'production'
const primaryColor = '#1890ff' // 主题色

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const TerserPlugin = require('terser-webpack-plugin')
// const CracoScopedCssPlugin = require('craco-plugin-scoped-css')
// const CircularDependencyPlugin = require('circular-dependency-plugin')
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
// const genericNames = require('generic-names')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// const localIdentName = '[local]-[hash:base64:5]';

module.exports = {
  devServer: {
    proxy: {
        '/loc': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            pathRewrite: {
              // "^/loc": ''
            }
        }
    },
  },
  plugins: [
    { // antDesign 配置
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': primaryColor,
        },
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            sourceMap: true,
          },
        },
      },
    },
    { // less module 支持 - https://github.com/DocSpring/craco-less#configuration
      plugin: CracoLessPlugin,
      options: {
        modifyLessRule(lessRule, context) {
          return {
            ...lessRule,
            ...{
              test: /\.module\.less$/,
              exclude: undefined,
            },
          }
        },
      },
    },
    // react scoped css (only scss/css) - https://github.com/gaoxiaoliangz/react-scoped-css
    { plugin: CracoScopedCssPlugin },
    { // 全局scss
      plugin: sassResourcesLoader,
      options: {
        resources: [
          './src/assets/scss/var.scss',
        ],
      },
    }
  ],
  webpack: {
    /**
     * 重写 webpack 任意配置
     *  - configure 能够重写 webpack 相关的所有配置，但是，仍然推荐你优先阅读 craco 提供的快捷配置，把解决不了的配置放到 configure 里解决；
     *  - 这里选择配置为函数，与直接定义 configure 对象方式互斥；
     */
    configure: (webpackConfig, { env, paths }) => {

      webpackConfig.resolve.plugins = [
        ...webpackConfig.resolve.plugins,
        ...[
          /**
           * 自动将 tsconfig 里的 paths 注入到 webpack alias
           *  - https://github.com/dividab/tsconfig-paths-webpack-plugin
           */
          new TsconfigPathsPlugin({
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
          }),
        ],
      ]

      return webpackConfig
    },
    plugins: [
      new WebpackBar({
        name: isProduction ? '正在打包' : '正在编译',
        color: '#fa8c16',
        profile: true
      }),
    ]
  },
}
