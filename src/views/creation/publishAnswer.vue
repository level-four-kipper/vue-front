<template>
  <div class="creation">
    <!-- 顶部 -->
    <div :class="['operation', !showSetting ? 'padding' : '']">
      <div>
        <el-button class="publish" type="primary" @click="postAnswer"><img src="@/assets/img/creation/publish.png" />发布回答</el-button>
        <slot name="auto-save"></slot>
        <el-button v-show="answer_status != 1" @click="saveAnswer"><img src="@/assets/img/creation/autoSave.png" />自动保存</el-button>
        <el-divider direction="vertical" />
        <el-button @click="back">退出</el-button>
      </div>
    </div>
    <!-- 问题 -->
    <div class="quiz">
      <p class="quiz-title">{{ item.title }}</p>
      <div class="spread-wrap">
        <div :class="{ 'no-spread': !spread, 'spread-box': spread }">
          <div class="quiz-content">
            <VMdPreview ref="table" :text="item.content_md || item.content" />
          </div>
        </div>
        <div v-if="display">
          <div v-show="spread === false" style="display: inline-block" class="spread-btn" @click="spreadText">
            <span>展开全部</span>
            <el-icon>
              <ArrowDown />
            </el-icon>
          </div>
          <div v-show="spread === true" class="spread-btn" @click="spreadText">
            <span>收起全部</span>
            <el-icon>
              <ArrowUp />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <div :class="['creation-form', !showSettings ? 'padding' : '']">
      <el-form
        ref="creationFormRef"
        :model="creationFormRef"
        :rules="creationRules"
        label-width="100%"
        class="creationForm"
        label-position="left">
        <!-- 编辑器 -->
        <Editor
          ref="editorFormRef"
          v-model="myAnswer"
          to-edit
          :class="['creation-editor', validateContent ? 'requireClass' : '']"
          @save="saveAnswerContent"
          @on-blur="blurChange"></Editor>
      </el-form>
    </div>
  </div>
</template>

<script setup name="PublishQuestion">
import { ref, onMounted, computed, reactive } from 'vue'
import VMdPreview from '@/components/VMdPreview.vue'
import { ElMessage } from 'element-plus'
import Editor from '@/components/Editor.vue'
import Operation from './components/Operation.vue'
import { fetchQuizDetails, fetchAnswerSave, addAnswer, fetchAnswerIndex, fetchQuizAnswerDetail } from '@/api/answer.js'
import { useRouter, useRoute } from 'vue-router'
import util from 'lodash'
let spread = ref(false)
const table = ref()
const display = ref(true)
const answer_status = ref(2)
function spreadText() {
  spread.value = !spread.value
}
const creationFormRef = ref({})
const route = useRoute()
const router = useRouter()
const contentHtml = ref('')
const contentText = ref('')
const editorFormRef = ref()
const pageTitle = ref('问题')
const activeName = ref('')
const showSettings = ref(false)
const myAnswerRef = ref()
const myAnswer = ref('')
const item = reactive({
  id: '',
  title: '',
  content: '',
  quiz_id: '',
})
const detailData = reactive({
  answer_content: '',
  answer_id: '',
  quiz_content: '',
  quiz_id: undefined,
  quiz_title: '',
})
const settingFormRef = ref()
const settingProp = reactive({
  list_tags: [],
  type: '',
  tag: '',
  image: '',
})
const title = ref('')
const id = ref(route.query.id)
const creationRules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  password: { required: true, message: '请输入内容', trigger: 'blur' },
})
// 退出
const back = () => {
  // router.go(-1)
  router.push({ path: '/quizIndex' })
}
const validateContent = ref(false)
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
  let contentError = validateFormContent()
  settingFormRef.value.settingFormRef.validate(valid => {
    if (valid && !contentError) {
      cb()
    } else if (!valid && !showSettings.value) {
      showSettings.value = true
    }
  })
}
const setting = flag => {
  showSettings.value = flag
}

const blurChange = (text = '', html) => {
  if (title?.value) {
    contentText.value = text ? text.replace(/"/g, '\\"') : ''
    contentHtml.value = html
    typeof util?.debounce === 'function' && util.debounce(saveAnswer(0), 1000)
  }
  validateFormContent()
}

const saveAnswerContent = function (text = '', html) {
  contentText.value = text.replace(/"/g, '\\"')
  contentHtml.value = html
  ElMessage({
    showClose: true,
    message: '内容已保存',
    type: 'success',
  })
}
//发布回答
const postAnswer = () => {
  if (!myAnswer.value) {
    ElMessage({ message: '请输入回答', type: 'warning' })
    return
  }
  const params = {
    question_id: String(route.params.id),
    content: myAnswer.value,
    article_type: 1,
    id: detailData.answer_id,
  }
  addAnswer(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ showClose: true, message: '回答成功', type: 'success' })
        router.push({ path: '/creationList/answer', query: { type: 0 } })
        myAnswer.value = ''
      } else {
        ElMessage({ showClose: true, message: res?.msg, type: 'error' })
      }
    })
    .catch(err => console.log(err))
}
//保存回答
const saveAnswer = () => {
  if (!myAnswer.value) {
    ElMessage({ message: '请输入回答', type: 'warning' })
    return
  }
  const params = {
    question_id: String(route.params.id),
    content: myAnswer.value,
    article_type: 3,
    id: detailData.answer_id,
  }
  fetchAnswerSave(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ showClose: true, message: '保存成功', type: 'success' })
        router.push({ path: '/creationList/answer', query: { type: 1 } })
        myAnswer.value = ''
        // sort.value = 0
        // queryQuestionAnswers({ id: String(route.params.id), sort_status: sort.value })
      } else {
        ElMessage({ showClose: true, message: res?.msg, type: 'error' })
      }
    })
    .catch(err => console.log(err))
}
const focusMyAnswer = () => {
  myAnswerRef.value.ref.focus()
}
// 请求问答首页展示
function getMyAnswer() {
  const params = {
    id: String(route.params.id),
    sort_status: (activeName.value = 0),
  }
  fetchAnswerIndex(params)
    .then(res => {
      item.title = res.data.title
      item.content = res.data.content
      item.quiz_id = res.data.comments[0].question_id
      item.id = route.params.id
      quiz_status.value = res.data?.status || 0
      console.log(item, res.data.id)
    })
    .catch(err => console.log(err))
}

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})

watch(
  () => props.item,
  newVal => {
    setTimeout(() => {
      const height = document.querySelector('.github-markdown-body').offsetHeight
      if (height < 145) {
        display.value = false
      } else {
        display.value = true
      }
    }, 150)
  },
  {
    immediate: true,
    deep: true,
  },
)

onMounted(async () => {
  getMyAnswer()
  if (route.query.id) {
    fetchQuizAnswerDetail(route.query.id).then(res => {
      myAnswer.value = res.data?.answer_content || ''
      console.log(res)
      detailData.answer_id = res.data.answer_id
      answer_status.value = res.data.issue
      // detailData.value.quiz_id = res.data.comments[1]
    })
  }
})
defineExpose({
  focusMyAnswer,
})
</script>

<style lang="scss" scoped>
.creation {
  background-color: #eef3fd;
  .creation-form {
    border-radius: 4px;
    padding: 20px 30px;
    margin-top: 20px;
    width: 77%;
    .requireClass {
      :deep(.el-input__wrapper) {
        border: 1px solid #f56c6c;
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
.operation {
  height: 64px;
  padding: 0 30px;
  line-height: 64px;
  justify-content: space-between;
  background-color: #ffffff;
  display: flex;
  :deep(.el-button) {
    border: 0px;
    margin-right: 2px;
    span {
      margin-right: 5px;
    }
  }
  .publish {
    background: #0175ff;
    img {
      margin-right: 5px;
    }
  }
  .border {
    height: 25px;
    display: inline-block;
    border-right: 2px solid #9196a6;
    vertical-align: middle;
  }
}
.padding {
  padding: 0 13.5%;
}

.quiz {
  width: 73%;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 4px;
  padding: 20px 20px 0px;
  top: 20px;
  margin-bottom: 20px;
  .quiz-title {
    font-size: 18px;
    color: #333333;
    font-weight: 700;
  }
  .quiz-content {
    :deep(.v-md-editor-preview) {
      .vuepress-markdown-body:not(.custom) {
        padding: 20px 0;
      }
    }
  }
  .no-spread {
    tab-size: 2;
    height: 83px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .spread-box {
    tab-size: 2;
    overflow: hidden;
  }
  .spread-wrap {
    overflow: hidden;
    cursor: pointer;
    .float-left {
      float: left;
    }
    .float-right {
      padding-top: 20px;
      float: right;
    }
  }
  .spread-btn {
    margin-bottom: 20px;
    width: 147px;
    color: #0175ff;
    .el-icon {
      width: 36px;
      padding-top: 5px;
    }
  }
}
:deep(.github-markdown-body) {
  padding-left: 0px;
}
</style>
