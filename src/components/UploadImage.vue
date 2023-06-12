<template>
  <el-upload class="avatar-uploader" :style="{width: width + 'px', height: height + 'px'}" :http-request="handleHttpRequest" :show-file-list="false" :before-upload="handleBeforeUpload" :limit="1">
    <slot>
      <img v-if="imgUrl" :style="{width: width + 'px', height: height + 'px'}" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </slot>
  </el-upload>
</template>

<script setup name="UploadImage">
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue' 
import { fetchUpload } from '@/api/uploadImage.js'

const props = defineProps({
  width: {
    type: Number,
    default: 130
  },
  height: {
    type: Number,
    default: 130
  },
  imgUrl: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'file'
  }
})

const emit = defineEmits(['uploadSuccess'])
const loading = ref(false)

// 校验图片格式、大小
const handleBeforeUpload = rawFile => {
  console.log('before-upload')
  const imageType = ['image/jpeg', 'image/png', 'image/jpg']
  if (!imageType.includes(rawFile.type)) {
    ElMessage.error('请上传jpg、png图片!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能超过 2MB!')
    return false
  }
  return true
}

// 上传事件
const handleHttpRequest = options => {
  console.log(options)
  const { name, size } = options.file
  const formData = new FormData()
  formData.append('file', options.file)
  fetchUpload(formData).then(res => {
    if (res.code !== 0) {
      ElMessage.error('上传失败!')
      return
    }
    console.log('上传成功: ', res.data)
    emit('uploadSuccess', { name, size, url: res.data })
  })
}
</script>

<style lang="scss" scoped>
</style>