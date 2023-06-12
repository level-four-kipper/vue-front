<template>
  <div class="creation">
    <Operation
      :title="pageTitle"
      :show-settings="showSettings"
      :show-drafts="question_status == 1"
      @publish="publish"
      @saveDraft="saveDraft"
      @preview="preview"
      @setting="setting"
      @back="back" />
    <div :class="['creation-form', !showSettings ? 'padding' : '']">
      <el-form
        ref="creationFormRef"
        :model="creationFormRef"
        :rules="creationRules"
        label-width="100%"
        class="creationForm"
        label-position="left">
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
          @save="saveQuestionContent"
          @input="inputChange"
          @on-blur="blurChange" />
      </el-form>
    </div>
    <Setting v-show="showSettings" ref="settingFormRef" :title="pageTitle" :setting-prop="settingProp" @setting="setting" />
  </div>
</template>

<script setup name="PublishQuestion">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Editor from '@/components/Editor.vue'
import Operation from './components/Operation.vue'
import Setting from './components/Setting.vue'
import { fetchQuizDetails, fetchQuizSave, fetchQuizPublish } from '@/api/answer.js'
import util from 'lodash'

const creationFormRef = ref({})
const contentHtml = ref('')
const contentText = ref('')
const editorFormRef = ref()
const pageTitle = ref('问题')
const showSettings = ref(false)
const settingFormRef = ref()
const settingProp = reactive({
  list_tags: [],
  type: '',
  tag: '',
  image: '',
})
const route = useRoute()
const title = ref('')
const id = ref(route.query.id)
const creationRules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  password: { required: true, message: '请输入内容', trigger: 'blur' },
})

const validateTitle = ref(false)
const validateContent = ref(false)
const question_status = ref(1)
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

const loadParam = status => {
  let params = {
    title: title.value,
    content_md: contentHtml.value,
    content: editorFormRef.value.translateToHtml(editorFormRef.value.text),
    list_tags: settingFormRef.value.settingForm.list_tags || [],
    img_url: settingFormRef.value.settingForm.image || '',
    domain_id: settingFormRef.value.settingForm.type || '',
    issue: status ? 0 : 1, // 0 发布，1草稿
    hide: 0,
  }
  if (settingFormRef.value.tag) {
    params.list_tags.push(settingFormRef.value.tag)
  }
  return params
}

const saveQuestion = (status, message, cb) => {
  const params = loadParam(status)
  let promise = null
  if (id.value) params.id = id.value

  if (status) {
    promise = fetchQuizPublish(params)
  } else {
    promise = fetchQuizSave(params)
  }
  promise
    .then(res => {
      if (res.code !== 0) {
        message && ElMessage({ showClose: true, message: res.msg.slice(0, -1) || res.data.error, type: 'error' })
      } else {
        message && ElMessage({ showClose: true, message: `${message}成功`, type: 'success' })
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
  router.push({ path: '/quizIndex' })
}

const publish = () => {
  validateForm(() => {
    saveQuestion(1, '发布', () => {
      router.push({ path: '/creationList/question', query: { type: 0 } })
    })
  })
}

const saveDraft = () => {
  let titleError = validateFormTitle()
  let contentError = validateFormContent()
  if (!titleError && !contentError) {
    saveQuestion(0, '保存', () => {
      router.push({ path: '/creationList/question', query: { type: 1 } })
    })
  }
}

const preview = () => {
  let titleError = validateFormTitle()
  let contentError = validateFormContent()
  if (!titleError && !contentError) {
    saveQuestion(0, '', id => {
      // router.push('/questionAnswerDetail/' + id)
      const routerUrl = router.resolve({
        path: '/questionAnswerDetail/' + id,
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
    if (question_status.value !== 0) {
      typeof util?.debounce === 'function' && util.debounce(saveQuestion(0), 1000)
    }
  }
  validateFormContent()
}

const saveQuestionContent = function (text = '', html) {
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
    fetchQuizDetails(route.query.id).then(res => {
      question_status.value = res.data?.issue || 0
      title.value = res.data?.title || ''
      contentText.value = res.data?.content || ''
      contentHtml.value = res.data?.content_md || ''
      settingProp.type = res.data?.domain_id || ''
      settingProp.image = res.data?.img_url || ''
      if (res.data.list_tags) {
        res.data.list_tags.map(el => {
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
        box-shadow: 0 0 0 0;
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
