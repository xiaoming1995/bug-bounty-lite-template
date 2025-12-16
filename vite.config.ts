import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import legacy from "@vitejs/plugin-legacy"

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    legacy({
      targets: ["ie>=11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"], //解决跨域警告
    })
  ],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // 提高警告阈值到 1000kb
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 1. Echarts
            if (id.includes('echarts')) {
              return 'echarts';
            }
            // 2. DevUI (put before vue because vue-devui contains "vue")
            if (id.includes('devui')) {
              return 'vendor-devui';
            }
            // 3. Editor (quill)
            if (id.includes('quill')) {
              return 'vendor-editor';
            }
            // 4. Vue Core
            if (id.includes('vue') || id.includes('pinia') || id.includes('router')) {
              return 'vendor-vue';
            }
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
