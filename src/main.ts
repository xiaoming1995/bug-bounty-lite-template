// src/main.ts
import { createApp } from 'vue'
console.log('Main.ts starting...')
import type { App as AppInstance } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

// DevUI 按需导入 - 只导入实际使用的组件（减少约 3-4MB 体积）
import {
  Button,
  Icon,
  Input,
  Tag,
  Statistic,
  Result,  // 用于空状态
  Card,
  Avatar,
  Form,
  FormItem,
  Row,
  Col,
  Checkbox,
  Pagination,
  Tooltip,
  Select,
  Dropdown,
  DatePicker,
  Switch,
  Progress,
  // 如果发现缺少组件，在这里添加
} from 'vue-devui'

// 图标样式（必需）
import '@devui-design/icons/icomoon/devui-icon.css'

// 主题初始化
import { ThemeServiceInit, infinityTheme } from 'devui-theme'

// 全局样式
import './style.css'

// 初始化主题
ThemeServiceInit({ infinityTheme }, 'infinityTheme')

// 创建应用实例
const app: AppInstance = createApp(App)
const pinia = createPinia()

// 注册 DevUI 组件
const devuiComponents = [
  Button,
  Icon,
  Input,
  Tag,
  Statistic,
  Result,
  Card,
  Avatar,
  Form,
  FormItem,
  Row,
  Col,
  Checkbox,
  Pagination,
  Tooltip,
  Select,
  Dropdown,
  DatePicker,
  Switch,
  Progress,
]

devuiComponents.forEach(component => {
  if (component.name) {
    app.component(component.name, component)
  }
})

// 插件使用
app.use(router)
  .use(pinia)
  .mount('#app')

// 环境变量类型声明
declare global {
  interface Window {
    __APP_ENV__: string
  }
}
