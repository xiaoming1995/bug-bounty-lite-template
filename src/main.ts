// src/main.ts
import { createApp } from 'vue'
console.log('Main.ts starting...')
import type { App as AppInstance } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'  // 确保从这里导入

// DevUI 类型化导入
import DevUI from 'vue-devui'
import '@devui-design/icons/icomoon/devui-icon.css'
import { ThemeServiceInit, infinityTheme } from 'devui-theme'

// 样式导入（添加CSS模块类型声明）
import 'vue-devui/style.css'
import './style.css'

// 初始化主题（添加配置类型）
ThemeServiceInit({ infinityTheme }, 'infinityTheme')

// 创建应用实例（显式类型声明）
const app: AppInstance = createApp(App)
const pinia = createPinia()

// 插件使用链式调用（更符合TS风格）
app.use(router)
  .use(DevUI)
  .use(pinia)
  .mount('#app')

// 环境变量类型声明（可选）
declare global {
  interface Window {
    __APP_ENV__: string
  }
}
