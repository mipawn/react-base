import { createApp } from 'vue'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'

import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './utils/plugin'

import 'element-plus/packages/theme-chalk/src/base.scss'
import 'normalize.css'
import './assets/style/reset.scss'

import lang from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale'

// 设置element语言
locale.use(lang)

const app = createApp(App)

window.addEventListener('unhandledrejection', function() {
})

plugins.forEach(plugin => {
  app.use(plugin)
})

app
  .use(store)
  .use(router)
  .use(VueClipboard)
  .mount('#app')
