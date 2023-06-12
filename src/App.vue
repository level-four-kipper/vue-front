<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'

import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import watermark from '@/utils/watermark'
import { getCurrentTime } from '@/utils/utils'
import { useLoginStore } from '@/stores/login.js'

const loginStore = useLoginStore()
const { name, number } = storeToRefs(loginStore)

const locale = ref(zhCn)

const watermarkOptions = reactive({
  parentDomName: 'body',
  show: true,
  color: '#D3D3DE',
  title: '',
  width: 300,
  height: 300,
  fontNum: 12,
  rotate: -30,
  zIndex: 999999
})

let timer = null

// 姓名工号
const name_number = computed(() => {
  return name.value + ' ' + number.value
})

// 水印每分钟修改一次
const updateWatermark = () => {
  if (route.meta.noToken) return
  timer && clearInterval(timer)
  watermarkOptions.title = name_number.value + ' \n ' + getCurrentTime()
  watermark.init(watermarkOptions)

  timer = setInterval(() => {
    watermarkOptions.title = name_number.value + ' \n ' + getCurrentTime()
    watermark.clear()
    watermark.init(watermarkOptions)
  }, 60 * 1000)
}

const route = useRoute()

onMounted(() => {
  updateWatermark()
})

// 路由跳转更新水印
watch(
  () => route.path,
  () => {
    if (!route.meta.noToken) {
      updateWatermark()
    } else {
      timer && clearInterval(timer)
      watermark.clear()
    }
  }
)

onBeforeUnmount(() => {
  timer && clearInterval(timer)
})

document.addEventListener('visibilitychange', function () {
  let pageVisibility = document.visibilityState
  // 页面变为不可见时触发
  if (pageVisibility == 'hidden') {
    timer && clearInterval(timer)
  }
  // 页面变为可见时触发
  if (pageVisibility == 'visible') {
    updateWatermark()
  }
})
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
