<template>
  <!-- 编辑题目 -->
  <div class="main__left" @click="activeIndex = null">
    <el-tabs v-model="activeQuestion" stretch @tab-change="hangdleTabChange">
      <el-tab-pane label="题型" name="questionType">
        <QuestionType @handle-type-click="handleTypeClick" />
      </el-tab-pane>
      <el-tab-pane label="题目" name="questionList">
        <div class="custom-tabs">
          <el-tabs v-model="activeName" stretch @tab-change="handleStatusChange">
            <el-tab-pane v-for="item in statusOptions" :key="item.value" :label="item.label" :name="item.value">
              <QuestionEditList :status="item.value" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="main__content" @click="activeIndex = null">
    <!-- 题目区域 -->
    <QuestionEditor />
  </div>
  <div class="main__right">
    <!-- 题库信息 -->
    <QuestionBankDetail v-if="!questionBank.question_dtolist[activeIndex]" />
    <!-- 题目设置 -->
    <QuestionSetting v-else />
  </div>

  <el-dialog v-model="errorDialogVisible" title="提示" width="30%">
    <div class="error">
      <span class="error__title">校验不通过：</span>
      <div v-for="item in errorMsgArr" :key="item.type">
        <span class="error__type"></span>
        {{ errorMap[item.type] }}
        <template v-if="item.type > 2">
          ：
          <span v-for="sub in item.list" :key="sub" class="error__msg">第{{ sub + 1 }}题，</span>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup name="editTopic">
import QuestionType from './components/QuestionType.vue'
import QuestionEditor from './components/QuestionEditor.vue'
import QuestionBankDetail from '@/views/questionBank/components/questionBankDetail.vue'
import QuestionSetting from './components/QuestionSetting.vue'
import QuestionEditList from './components/QuestionEditList.vue'

import _ from 'lodash'
import Bus from '@/utils/bus.js'
import useQuestionbank from '@/hooks/useQuestionbank'

const { bankId, isSameArray, _fetchUpdateQuestionbank, _fetchPublishQuestionbank, _fetchGetQuestionbank, getDefaultTitle } =
  useQuestionbank()

const router = useRouter()
const route = useRoute()

const bankObj = {
  id: bankId.value,
  role_id: 0,
  area_id: '',
  audit_policy: 0,
  description: '',
  name: '',
}

const questionBank = reactive({
  bank_auditor_list: [], // 审核人员
  bank_editor_list: [], // 编辑人员
  question_bank_dto: {
    // 题库信息
    ...bankObj,
  },
  question_dtolist: [], // 题目信息
})
const activeQuestion = ref('questionType')

const bankConfig = ref({
  ...bankObj,
})
const auditorList = ref([])
const editorList = ref([])
// 判断是否存在未提交数据
const isEditing = ref(false)
const setIsEditing = () => {
  let bool = false

  // 题目列表
  if (questionBank.question_dtolist.length) {
    const list = getQuestionList()
    if (list.length) {
      console.log('题目列表改变')
      bool = true
    }
  }

  // 题库信息
  if (JSON.stringify(questionBank.question_bank_dto) !== JSON.stringify(bankConfig.value)) {
    console.log('题库信息改变')
    bool = true
  }

  // 审核人员
  if (!isSameArray(questionBank.bank_auditor_list, auditorList.value, 'user_id')) {
    console.log('审核人员改变')
    bool = true
  }

  // 编辑人员
  if (!isSameArray(questionBank.bank_editor_list, editorList.value, 'user_id')) {
    console.log('编辑人员改变')
    bool = true
  }

  isEditing.value = bool
}

watch(
  () => questionBank,
  () => {
    setIsEditing()
  },
  {
    deep: true,
  },
)

const activeIndex = ref(null) // 题目下标，null表示当前是题库

const activeName = ref(1) // 题目编辑，题目状态
const statusOptions = [
  { label: '已收录', value: 1 },
  { label: '审核中', value: 0 },
  { label: '已拒绝', value: 2 },
]

// 题型列表
const typeOptions = {
  0: {
    type_id: 0, // 单选题
    title: '',
    answer: 'A',
    difficulty_id: 0,
    analysis: '',
    buz_id: 0,
    status_id: 0,
    option_list: [
      { checked: true, option_content: '' },
      { checked: false, option_content: '' },
      { checked: false, option_content: '' },
      { checked: false, option_content: '' },
    ],
  },
  1: {
    type_id: 1, // 多选题
    title: '',
    answer: 'A、B',
    difficulty_id: 0,
    analysis: '',
    buz_id: 0,
    status_id: 0,
    option_list: [
      { checked: true, option_content: '' },
      { checked: true, option_content: '' },
      { checked: false, option_content: '' },
      { checked: false, option_content: '' },
    ],
  },
  2: {
    type_id: 2, // 问答题
    title: '',
    answer: '',
    difficulty_id: 0,
    analysis: '',
    buz_id: 0,
    status_id: 0,
  },
  3: {
    type_id: 3, // 编程题
    title: '',
    answer: '',
    difficulty_id: 0,
    analysis: '',
    buz_id: 0,
    status_id: 0,
    language: '1',
  },
}

const errorMap = {
  0: '题库名称不能为空',
  1: '题库所属领域不能为空',
  2: '至少添加两个审核人员',
  3: '单选题必须选择一个答案',
  4: '多选题至少选择两个答案',
  5: '简答题答案不能为空',
}
const errorDialogVisible = ref(false)
const errorMsgArr = ref([])

// tab改变
const hangdleTabChange = () => {
  if (activeQuestion.value === 'questionList') {
    // 编辑题目
    activeIndex.value = 0
  } else {
    // 新增题目
  }
}

// 题目状态改变
const handleStatusChange = () => {
  // 重新请求列表
}

// 题型：添加题目
const handleTypeClick = e => {
  const obj = _.cloneDeep(typeOptions[e.type])
  // 唯一key
  obj.key = _.uniqueId('question_')
  questionBank.question_dtolist.push(obj)
}

// 校验题目选项
const verifyQuestionBank = () => {
  let isPass = true
  const errorMsgMap = {
    3: [],
    4: [],
    5: [],
  }

  // 题库名称校验
  if (!questionBank.question_bank_dto.name) {
    errorMsgMap[0] = '1'
    isPass = false
  }

  // 题库领域校验
  if (!questionBank.question_bank_dto.area_id) {
    errorMsgMap[1] = '1'
    isPass = false
  }

  // 题库审核人员校验
  if (questionBank.question_bank_dto.audit_policy && questionBank.bank_auditor_list.length < 2) {
    errorMsgMap[2] = '1'
    isPass = false
  }

  questionBank.question_dtolist.forEach((item, index) => {
    if (item.type_id < 2) {
      // 选择题答案校验
      if (item.type_id === 0 && !item.answer) {
        errorMsgMap[3].push(index)
        isPass = false
      }
      if (item.type_id === 1 && item.answer.split('、').length < 2) {
        errorMsgMap[4].push(index)
        isPass = false
      }
    } else {
      // 简答题答案校验
      if (!item.answer) {
        errorMsgMap[5].push(index)
        isPass = false
      }
    }
  })

  if (!isPass) {
    // 校验不通过
    const errArr = []
    for (let i in errorMsgMap) {
      if (errorMsgMap[i].length) {
        errArr.push({
          type: i,
          list: errorMsgMap[i],
        })
      }
    }
    errorMsgArr.value = errArr
    errorDialogVisible.value = true
    return false
  }

  return true
}

// 获取题库信息
// 根据题库id查询题库
const HandleFetchGetQuestionbank = () => {
  _fetchGetQuestionbank().then(res => {
    questionBank.question_bank_dto.area_id = res.area_id
    questionBank.question_bank_dto.audit_policy = res.audit_policy || 0
    questionBank.question_bank_dto.description = res.description
    questionBank.question_bank_dto.name = res.name
    questionBank.question_bank_dto.role_id = res.role_id

    bankConfig.value = _.cloneDeep(questionBank.question_bank_dto)
  })
}

// 提交时，如未设置题目名称及选择题选项，使用默认值
const getQuestionList = () => {
  const list = []
  questionBank.question_dtolist.forEach(item => {
    // 审核中的题目不允许编辑和提交
    if (!(item.id && item.status_id === 0)) {
      const question = _.cloneDeep(item)

      // 默认题目
      question.title = item.title || getDefaultTitle(item.type_id)

      // 默认选项
      if (item?.option_list) {
        item.option_list.forEach((option, index) => {
          question.option_list[index].option_content = option.option_content || `选项${index + 1}`
        })
      }

      list.push(question)
    }
  })

  return list
}

const getParams = () => {
  if (verifyQuestionBank()) {
    // 审核中的题目不提交修改
    const params = {
      ...questionBank,
    }

    params.question_dtolist = getQuestionList()
    return params
  } else {
    return false
  }
}

// 提交
const handleSubmit = () => {
  const params = getParams()
  if (params) {
    _fetchUpdateQuestionbank(params).then(id => {
      isEditing.value = false
      router.replace(`/questionBank/editor?id=${id}&t=${new Date().getTime()}`)
    })
  }
}

// 发布
const handlePublish = () => {
  if (isEditing.value) {
    const params = getParams()

    if (params) {
      _fetchUpdateQuestionbank(params).then(() => {
        isEditing.value = false
        _fetchPublishQuestionbank()
      })
    }
  } else {
    _fetchPublishQuestionbank()
  }
}

// 点击header切换到题库
const changeToQuestionBank = () => {
  activeIndex.value = null
}

// 路由拦截
const handleBeforeLeave = path => {
  router.beforeEach((to, from, next) => {
    if (from.path === path && isEditing.value) {
      const res = confirm('当前内容未保存，确认离开吗？')
      if (res) {
        // 解决多次弹窗
        isEditing.value = false
        next()
      }
    } else {
      next()
    }
  })
}

onMounted(() => {
  if (bankId.value) {
    HandleFetchGetQuestionbank()
  }

  Bus.on('handleSubmit', handleSubmit)
  Bus.on('handlePublish', handlePublish)
  Bus.on('changeToQuestionBank', changeToQuestionBank)

  // 窗口拦截
  window.onbeforeunload = function () {
    if (isEditing.value) {
      return '当前内容未保存，确认离开吗？'
    }
  }

  handleBeforeLeave(route.path)
})

onBeforeUnmount(() => {
  Bus.off('handleSubmit', handleSubmit)
  Bus.off('handlePublish', handlePublish)
  Bus.on('changeToQuestionBank', changeToQuestionBank)

  window.onbeforeunload = null
})

provide('questionBank', {
  activeIndex: activeIndex,
  question_bank_dto: questionBank.question_bank_dto,
  question_dtolist: questionBank.question_dtolist,
  bank_auditor_list: questionBank.bank_auditor_list,
  bank_editor_list: questionBank.bank_editor_list,
})

provide('originalBankConfig', {
  auditorList: auditorList,
  editorList: editorList,
})
</script>

<style lang="scss" scoped>
.main__left,
.main__content,
.main__right {
  background: #fff;
  margin-top: 20px;
  &.main__content {
    background: none;
  }
}
.main__left {
  width: 360px;
  border-radius: 4px 0 0 4px;
}
.main__content {
  flex: 1;
}
.main__right {
  width: 360px;
  border-radius: 4px 0 0 4px;
}

:deep(.el-tabs) {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__item {
    height: 55px;
    line-height: 55px;
    padding: 0;
    font-size: 16px;
    color: #4d4e54;
    &.is-active {
      color: #0175ff;
      font-weight: 600;
    }
  }
  .el-tabs__active-bar {
    height: 3px;
    background: #0175ff;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background: #d3d3de;
  }
}
.custom-tabs {
  font-size: 14px;
  color: #4d4e54;
  :deep(.el-tabs) {
    .el-tabs__item {
      height: 49px;
      line-height: 49px;
      font-size: 14px;
      color: #6d717d;
      &.is-active::after {
        position: absolute;
        content: '';
        left: 50%;
        bottom: 0;
        width: 16px;
        height: 3px;
        transform: translateX(-50%);
        background: #0175ff;
      }
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__content {
      padding: 0 20px;
    }
  }
}
.error {
  &__title {
    font-weight: bold;
    color: #da3939;
  }
  &__type {
  }
  &__msg {
    color: #da3939;
  }
}
</style>
