import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import VueMarkdownEditor from '@kangc/v-md-editor'
import _ from 'lodash'
import { handleError } from './utils/utils'

import './mock/index'
import './assets/main.scss'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局错误处理
window.addEventListener('error', handleError, true)

// 引入 highlight.js 代码高亮工具
import hljs from 'highlight.js'

// 增加自定义命令v-highlight
app.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach(block => {
    hljs.highlightBlock(block)
  })
})

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VueMarkdownEditor)
app.use(_)
app.mount('#app')
