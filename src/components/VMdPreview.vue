<template>
  <div>
    <!-- 文章预览 -->
    <VMdPreview
      :text="text"
      ref="previewRef"
      v-highlight
      @copy-code-success="handleCopyCodeSuccess"
      @image-click="handleImageClick"
    />
    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showPreview"
      :url-list="urlList"
      :initial-index="previewIndex"
      @close="handlePreviewClose"
    />
  </div>
</template>

<script setup>
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// 引入所有语言包
import hljs from 'highlight.js'

import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
// import 'katex/dist/katex.min.css'
// import 'katex/dist/katex.min.js'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import { ElMessage } from 'element-plus'

const props = defineProps({
  text: String
})

const previewRef = ref(null)

const showPreview = ref(false)
const previewIndex = ref(0)
const urlList = ref([])

VMdPreview.use(githubTheme, {
  Hljs: hljs
})
VMdPreview.use(createLineNumbertPlugin())
VMdPreview.use(createCopyCodePlugin())
VMdPreview.use(createKatexPlugin())

// 目录锚点定位，top是距离顶部的高度，这里取顶部导航高度，但是有bug，横向滚动条会滚到最右边，暂时弃用
const scrollToTarget = (heading, top = 64) => {
  if (heading) {
    previewRef.value.scrollToTarget({
      target: heading,
      scrollContainer: window,
      top: top
    })
  }
}

const handleCopyCodeSuccess = () => {
  ElMessage({
    message: '已复制',
    type: 'success',
    duration: 1500
  })
}

// 图片点击预览
const handleImageClick = (images, currentIndex) => {
  urlList.value = images
  previewIndex.value = currentIndex
  document.body.style.overflow = 'hidden'
  showPreview.value = true
}

const handlePreviewClose = () => {
  document.body.style.overflow = 'auto'
  showPreview.value = false
}

defineExpose({
  scrollToTarget
})
</script>
<style lang="scss" scoped>
// 字体加粗修复
:deep(.v-md-editor) {
  strong {
    font-weight: 600;
  }
}
</style>
