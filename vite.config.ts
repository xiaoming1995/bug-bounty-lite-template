import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 🔴 强制把 echarts 单独打包
          if (id.includes('node_modules/echarts')) {
            return 'echarts';
          }
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "vue-devui/style.css";`
      }
    }
  },
  resolve: {
    alias: {
      // 修正图标包别名路径
      '@devui-design/icons': path.resolve(__dirname, 'node_modules/@devui-design/icons'),
      '@': path.resolve(__dirname, './src'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
    // 添加扩展名自动补全
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css', 'vue']
  }
})
