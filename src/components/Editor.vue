<template>
  <div v-highlight>
    <v-md-editor
      v-if="toEdit"
      v-model="text"
      :height="height"
      :disabled-menus="[]"
      @upload-image="onUploadImage"
      @save="onSave(text)"
      @blur="onBlur"
      @change="onChange"></v-md-editor>
    <v-md-editor v-else v-model="markdown" mode="preview"></v-md-editor>
    <span v-if="maxLength" class="counter">{{ text.length }}/{{ maxLength }}</span>
  </div>
</template>

<script setup>
import VueMarkdownEditor, { xss } from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'

// 采用github主题
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// 引入所有语言包
import hljs from 'highlight.js'

// 其他插件
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'

import { fetchUpload } from '@/api/uploadImage.js'
import { ElMessage } from 'element-plus'

VueMarkdownEditor.use(githubTheme, { Hljs: hljs })
VueMarkdownEditor.use(createLineNumbertPlugin())
VueMarkdownEditor.use(createKatexPlugin())

const emit = defineEmits(['save', 'update:value', 'onBlur'])

const props = defineProps({
  height: String,
  toEdit: Boolean,
  onUploadImage: Function,
  markdown: String,
  modelValue: String,
  maxLength: Number,
})

const toEdit = ref(props.toEdit)
const markdown = ref(props.markdown)
const text = ref(props.modelValue)

watch(
  () => props.markdown,
  () => {
    markdown.value = props.markdown
  },
)
watch(
  () => text.value,
  () => {
    emit('update:modelValue', text.value)
  },
)
watch(
  () => props.modelValue,
  () => {
    text.value = props.modelValue
  },
)
const onSave = () => {
  const html = xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(text.value))
  emit('save', html, text.value)
}
const onUploadImage = (event, insertImage, files) => {
  const formData = new FormData()
  formData.append('file', files[0])
  fetchUpload(formData).then(result => {
    if (result.code === 0) {
      insertImage({
        url: result.data,
        desc: 'DESC',
      })
    } else {
      ElMessage({
        showClose: true,
        message: '图片上传失败，请重新上传',
        type: 'error',
      })
    }
  })
}
const translateToHtml = htmlText => {
  return xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(htmlText))
}
const onBlur = event => {
  const text = event.target.value
  const html = translateToHtml(text)
  emit('onBlur', html, text)
}
const onChange = str => {
  let subStr = str
  if (props.maxLength && str.length > props.maxLength) {
    subStr = str.substr(0, props.maxLength)
    console.log(subStr)
  }
  text.value = subStr
}

// 向外暴露的API
defineExpose({ text, translateToHtml, onBlur })
</script>

<style lang="scss" scoped>
// 字体加粗修复
:deep(.v-md-editor) {
  strong {
    font-weight: 600;
  }
}
.counter {
  position: absolute;
  bottom: 0;
  right: 50%;
  margin-right: 6px;
  padding: 0 5px;
  line-height: 22px;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 2px;
}
</style>
