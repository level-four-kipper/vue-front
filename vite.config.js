import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import ViteImages from 'vite-plugin-vue-images'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'pinia', 'vue-router'], // 自动导入vue和vue-router相关函数
      dirs: ['./src/hooks'],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      dts: true, // 生成 `auto-import.d.ts` 全局声明
    }),
    ViteImages({
      dirs: ['src/assets/img'], // 指定图片存放目录
      extensions: ['jpg', 'jpeg', 'png', 'svg', 'webp'], // 有效的图像扩展
    }),
  ],
  optimizeDeps: {
    include: ['element-plus/lib/locale/lang/zh-cn'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Css配置
  css: {
    preprocessorOptions: {
      // scss全局变量
      scss: {
        // 覆盖掉element-plus包中的主题变量文件
        additionalData: '@use "@/assets/elementUI.scss" as *;',
      },
    },
  },
  build: {
    assetsDir: 'static',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
      },
      output: {
        // 静态资源分类打包
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    open: true, // 增加浏览器打开功能
    host: 'localhost',
    port: 7749,
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://10.28.20.6:30150', // 替换成实际开发中的接口转发地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
