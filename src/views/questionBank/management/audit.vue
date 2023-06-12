<template>
  <div class="main__left">
    <el-tabs v-model="activeQuestion" stretch>
      <el-tab-pane label="待审核" name="toBeReviewed">
        <QuestionEditList ref="toBeReviewedRef" :type="1" :status="0" />
      </el-tab-pane>
      <el-tab-pane label="已审核" name="audited">
        <QuestionEditList ref="auditedRef" :type="1" :status="1" />
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="main__content">
    <!-- 题目区域 -->
    <QuestionAuditEditor ref="editorRef" :active-question="activeQuestion" />
  </div>
  <div class="main__right">
    <!-- 审核信息 -->
    <AuditInfo />
  </div>
</template>

<script setup>
import QuestionAuditEditor from './components/QuestionAuditEditor.vue'
import QuestionEditList from './components/QuestionEditList.vue'
import AuditInfo from './components/AuditInfo.vue'
import { ElMessage } from 'element-plus'

import Bus from '@/utils/bus.js'
import useQuestionbank from '@/hooks/useQuestionbank'

const { _fetchPublishQuestionbank } = useQuestionbank()

const activeQuestion = ref('toBeReviewed')
const toBeReviewedRef = ref(null)
const auditedRef = ref(null)
const editorRef = ref(null)

const activeIndex = ref(0) // 题目下标，null表示当前是题库

const questionBank = reactive({
  toBeReviewedList: [],
  auditedList: [],
  question_dtolist: []
})

const questionId = computed(() => {
  return questionBank.question_dtolist[activeIndex.value]?.id || ''
})

// 审核信息
const audit_schedule = ref('')
const auditInfo = reactive({
  question_auditor_volist: []
})

// 监听tab切换
watch(
  () => activeQuestion.value,
  newVal => {
    nextTick(() => {
      if (newVal === 'toBeReviewed') {
        // 待审核
        toBeReviewedRef.value._fetchQuestionList().then(() => {
          activeIndex.value = 0
          questionBank.question_dtolist.splice(0)
          questionBank.question_dtolist.push(...questionBank.toBeReviewedList)
          editorRef.value.handleGetQuestion()
        })
      } else {
        // 已审核
        auditedRef.value._fetchQuestionList().then(() => {
          activeIndex.value = 0
          questionBank.question_dtolist.splice(0)
          questionBank.question_dtolist.push(...questionBank.auditedList)
          editorRef.value.handleGetQuestion()
        })
      }
    })
  },
  {
    immediate: true
  }
)

// 发布
const handlePublish = () => {
  // console.log('handlePublish')
  // if (verifyQuestionList()) {
  //   // 校验通过
  _fetchPublishQuestionbank()
  // }
}

onMounted(() => {
  Bus.on('handlePublish', handlePublish)
})

onBeforeUnmount(() => {
  Bus.off('handlePublish', handlePublish)
})

provide('questionBank', {
  activeIndex,
  toBeReviewedList: questionBank.toBeReviewedList,
  auditedList: questionBank.auditedList,
  question_dtolist: questionBank.question_dtolist
})
provide('questionInfo', {
  questionId: questionId,
  audit_schedule: audit_schedule,
  question_auditor_volist: auditInfo.question_auditor_volist
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
  .el-tabs__content {
    padding: 0 20px;
  }
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
:deep(.question-list) {
  max-height: calc(100vh - 370px);
}
</style>
