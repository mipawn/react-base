import { createApp } from 'vue'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import { createI18n } from 'vue-i18n'

import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './utils/plugin'
import LocalMessages from './local'
import { getLang } from './utils/init'

import 'element-plus/packages/theme-chalk/src/base.scss'
import 'normalize.css'
import './assets/style/reset.scss'

// element-plus 设置语言
import 'dayjs/locale/zh-cn'

locale.use(lang)

const i18n = createI18n({
  legacy: false,
  locale: getLang(),
  fallbackLocale: 'zh-CN',
  messages: LocalMessages,
})

const app = createApp(App)

window.addEventListener('unhandledrejection', () => {
})

plugins.forEach((plugin) => {
  app.use(plugin)
})

app
  .use(i18n)
  .use(store)
  .use(router)
  .use(VueClipboard)
  .mount('#app')
