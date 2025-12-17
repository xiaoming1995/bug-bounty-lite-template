import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer' //  新增：分析打包体积
import viteCompression from 'vite-plugin-compression' //  新增：Gzip压缩

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    //  开启 Gzip 压缩，大幅减少生产环境体积
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 超过 10kb 才压缩
      algorithm: 'gzip',
      ext: '.gz',
    }),
    //  打包后自动在根目录生成 stats.html，帮你分析谁最大
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    // 使用 esbuild 压缩 (比 terser 快 20-100x)
    minify: 'esbuild',
    // 目标浏览器 (移除 IE11 支持)
    target: 'es2015',
    // 关闭 sourcemap 加速构建
    sourcemap: false,
    // 提高警告阈值
    chunkSizeWarningLimit: 2000,
    // CSS 代码分割
    cssCodeSplit: true,
    // 抑制 esbuild CSS 语法警告 (来自 vue-devui 的 IE hack)
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        // 优化 chunk 分割
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('echarts')) return 'echarts';
            if (id.includes('devui')) return 'vendor-devui';
            if (id.includes('quill')) return 'vendor-editor';

            //  Monaco Editor 非常大，建议单独拆分 worker
            if (id.includes('monaco-editor')) return 'vendor-monaco';

            if (id.includes('vue') || id.includes('pinia') || id.includes('router')) {
              return 'vendor-vue';
            }

            //  兜底策略：其他未匹配的第三方库打入 vendor，避免分散成大量小文件
            // return 'vendor-others'; 
          }
        }
      }
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'echarts', 'vue-devui'] //  显式添加 echarts 和 devui
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 修正：这里只引入变量/mixin。如果没有变量文件，这行可以删掉。
        // additionalData: `@import "vue-devui/style.css";`
      }
    }
  },
  resolve: {
    alias: {
      '@devui-design/icons': path.resolve(__dirname, 'node_modules/@devui-design/icons'),
      '@': path.resolve(__dirname, './src'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.vue']
  }
})

