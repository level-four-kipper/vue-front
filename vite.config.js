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
        // target: 'http://10.13.54.53:9026',// 吴杰
        target: 'http://10.28.20.6:30150', // 替换成实际开发中的接口转发地址
        // target: 'http://10.28.20.6:30151', // 测试
        // target: 'http://10.13.55.29:9027', // 高君宝
        // target: 'https://fdtech.byd.com:9123/api', // 生产
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
// https://github.com/login?allow_signup=false&client_id=e37ffdec11c0245cb2e0&return_to=%2Flogin%2Foauth%2Fauthorize%3Fclient_id%3De37ffdec11c0245cb2e0%26redirect_uri%3Dhttps%253A%252F%252Flogin.live.com%252FHandleGithubResponse.srf%26response_type%3Dcode%26scope%3Dread%253Auser%2B%2Buser%253Aemail%26state%3DB0244C75AC286923
// http://prm.byd.com.cn:8888/swb/login.do?method=getAuthCode&client_id=fdkj_fdtech&redirect_uri=http://10.8.5.53:15778/index&dateTime=1669558348780
// https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?response_type=code&response_mode=query&client_id=aebc6443-996d-45c2-90f0-388ff96faa56&redirect_uri=https%3A%2F%2Fvscode.dev%2Fredirect&scope=email+offline_access+openid+profile&prompt=select_account&code_challenge_method=S256&code_challenge=VM0gQOpJVBaUE-m7DBAlVPahPbDqJ8OmCNiMcp6wTgU&state=http%3A%2F%2F127.0.0.1%3A22396%2Fcallback%3Fnonce%3DNoo4ikLkx15fjqf67g5Org%253D%253D
