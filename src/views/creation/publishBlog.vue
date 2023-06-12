<template>
  <div class="creation">
    <Operation
      :title="pageTitle"
      :show-drafts="blog_status != 1"
      :show-settings="showSettings"
      @publish="publish"
      @saveDraft="saveDraft"
      @preview="preview"
      @setting="setting"
      @back="back">
      <!-- <template #auto-save>
        <el-button><img src="@/assets/img/creation/autoSave.png" @click="autoSave" />自动保存</el-button>
        <el-divider direction="vertical" />
      </template>-->
    </Operation>
    <!-- , !showSettings ? 'padding': '' -->
    <div :class="['creation-form', !showSettings ? 'padding' : '']">
      <el-form
        ref="creationFormRef"
        :model="creationFormRef"
        :rules="creationRules"
        label-width="100%"
        class="creationForm"
        label-position="left">
        <!-- <el-form-item label="" prop="title"> -->
        <el-input
          v-model="title"
          maxlength="40"
          :class="['creation-title', , validateTitle ? 'requireClass' : '']"
          @input="validateFormTitle">
          <template #prefix>
            <span style="color: red">*</span>
            {{ pageTitle }}标题:&nbsp;&nbsp;&nbsp;
          </template>
        </el-input>
        <Editor
          ref="editorFormRef"
          v-model="contentHtml"
          to-edit
          :class="['creation-editor', validateContent ? 'requireClass' : '']"
          @save="saveBlogContent"
          @input="inputChange"
          @on-blur="blurChange" />
      </el-form>
    </div>
    <Setting v-show="showSettings" ref="settingFormRef" :title="pageTitle" :setting-prop="settingProp" @setting="setting">
      <template #blog-type>
        <el-form-item label="博客分类" prop="creation_type">
          <el-radio-group v-model="creation_type" size="large">
            <el-radio label="1" size="large" border>原创</el-radio>
            <el-radio label="2" size="large" border>转载</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </Setting>
  </div>
</template>

<script setup name="PublishBlog">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import Editor from '@/components/Editor.vue'
import Operation from './components/Operation.vue'
import Setting from './components/Setting.vue'
import { fetchBlogSave, fetchBlogDetails, fetchBlogPublish } from '@/api/creation.js'
import util from 'lodash'

const creationFormRef = ref({})
const contentHtml = ref('')
const contentText = ref('')
const editorFormRef = ref()
const pageTitle = ref('博客')
const showSettings = ref(false)
const settingFormRef = ref()
const settingProp = reactive({
  list_tags: [],
  creation_type: '',
  type: '',
  tag: '',
  image: '',
})
const route = useRoute()
const id = ref(route.query.id)
const title = ref('')
const creationRules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  password: { required: true, message: '请输入内容', trigger: 'blur' },
})

const validateTitle = ref(false)
const validateContent = ref(false)
const blog_status = ref(0)
const validateFormTitle = () => {
  let error = ''
  if (!title.value) {
    validateTitle.value = true
    error = '请输入标题'
  } else {
    validateTitle.value = false
  }
  return error
}
const validateFormContent = () => {
  let error = ''
  if (!contentHtml.value) {
    validateContent.value = true
    error = '请输入内容'
  } else {
    validateContent.value = false
  }
  return error
}

const validateForm = cb => {
  let titleError = validateFormTitle()
  let contentError = validateFormContent()
  settingFormRef.value.settingFormRef.validate(valid => {
    if (valid && !titleError && !contentError) {
      cb()
    } else if (!valid && !showSettings.value) {
      showSettings.value = true
    }
  })
}

const loadParam = () => {
  let params = {
    title: title.value,
    content_md: contentHtml.value,
    content: editorFormRef.value.translateToHtml(editorFormRef.value.text),
    image: settingFormRef.value.settingForm.image || '',
    tags: settingFormRef.value.settingForm.list_tags || [],
    domain_id: settingFormRef.value.settingForm.type || '',
    creation_type: Number(settingFormRef.value.settingForm.creation_type),
  }
  if (settingFormRef.value.tag) {
    params.tags.push(settingFormRef.value.tag)
  }
  return params
}
//保存草稿
const saveBlog = (status, message, cb) => {
  const params = loadParam()
  let promise = null
  if (id.value) params.id = id.value
  if (status) {
    promise = fetchBlogPublish(params)
  } else {
    promise = fetchBlogSave(params)
  }
  promise
    .then(res => {
      if (res.code !== 0) {
        message && ElMessage({ showClose: true, message: res.msg.slice(0, -1) || res.data.error, type: 'error' })
      } else {
        message && ElMessage({ showClose: true, message: `${message}成功`, type: 'success' })
        // 记录自动保存的id，否则会重复创建
        id.value = res.data
        cb && cb(res.data)
      }
    })
    .catch(err => {
      console.log(err)
      message && ElMessage({ showClose: true, message: `${message}失败`, type: 'error' })
    })
}

const router = useRouter()

const back = () => {
  router.push({ path: '/blogIndex' })
}

const publish = () => {
  let titleError = validateFormTitle()
  let contentError = validateFormContent()
  validateForm(() => {
    if (!titleError && !contentError) {
      saveBlog(1, '发布', () => {
        router.push({ path: '/creationList/blog', query: { index: 0 } })
      })
    }
  })
}

const saveDraft = () => {
  let titleError = validateFormTitle()
  let contentError = validateFormContent()
  if (!titleError && !contentError) {
    saveBlog(0, '保存', () => {
      router.push({ path: '/creationList/blog', query: { index: 1 } })
    })
  }
}

const preview = () => {
  let titleError = validateFormTitle()
  let contentError = validateFormContent()
  if (!titleError && !contentError) {
    saveBlog(0, '', id => {
      // router.push('/blogDetail/' + id)
      const routerUrl = router.resolve({
        path: '/blogDetail/' + id,
        query: {
          preview: 1,
        },
      })
      window.open(routerUrl.href, '_blank')
    })
  }
}

const setting = flag => {
  showSettings.value = flag
}

const blurChange = (text = '', html) => {
  if (title?.value) {
    contentText.value = text ? text.replace(/"/g, '\\"') : ''
    contentHtml.value = html
    if (blog_status.value !== 1) {
      typeof util?.debounce === 'function' && util.debounce(saveBlog(0), 1000)
    }
  }
  validateFormContent()
}

const inputChange = () => {}

const saveBlogContent = function (text = '', html) {
  contentText.value = text.replace(/"/g, '\\"')
  contentHtml.value = html
  ElMessage({
    showClose: true,
    message: '内容已保存',
    type: 'success',
  })
}

onMounted(async () => {
  if (route.query.id) {
    fetchBlogDetails(route.query.id).then(res => {
      title.value = res.data?.title || ''
      blog_status.value = res.data?.status || 0
      contentText.value = res.data?.content || ''
      contentHtml.value = res.data?.content_md || ''
      settingProp.type = res.data?.domain_id || ''
      settingProp.image = res.data?.image || ''
      settingProp.creation_type = String(res.data?.creation_type) || ''
      if (res.data.tags) {
        res.data.tags.map(el => {
          settingProp.list_tags.push(el)
        })
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.creation {
  background-color: #eef3fd;
  height: 100%;
  .creation-form {
    border-radius: 4px;
    padding: 20px 30px;
    width: 77%;
    .requireClass {
      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px #f56c6c;
      }
      :deep(.v-md-editor--editable) {
        border: 1px solid #f56c6c;
      }
      :deep(.el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 0px;
      }
    }
    .creation-title {
      margin-bottom: 20px;
    }
    .creation-editor {
      :deep(.v-md-editor) {
        height: calc(100vh - 280px);
      }
    }
  }
  .padding {
    margin: 0 auto;
  }
}
</style>
