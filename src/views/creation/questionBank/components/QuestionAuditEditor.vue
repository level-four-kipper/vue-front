<template>
  <div class="editor">
    <div class="editor__tips" v-if="question_dtolist.length === 0">
      <div class="add-btn">
        <img src="@/assets/img/createQuestionBank/add.png" alt />
        <span>点击左侧题目查看审核信息</span>
      </div>
    </div>
    <template v-else>
      <div class="editor__header">
        <!-- <div @click="handleJumpLast">
          <el-icon :size="14" color="#0175FF">
            <ArrowLeft />
          </el-icon>
          <span>上一题</span>
        </div>-->
        <div @click="handleJumpNext">
          <span>下一题</span>
          <el-icon :size="14" color="#0175FF">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div class="editor__content">
        <!-- 题目 -->
        <Question :index="activeIndex" :canEdit="false" />
        <!-- 答案解析 -->
        <div class="question__answerkeys">
          <p>答案解析</p>
          <div>{{ question_dtolist[activeIndex]?.analysis }}</div>
        </div>
      </div>
      <div class="editor__footer">
        <!-- 审核题目 -->
        <AuditForm
          v-if="activeQuestion === 'toBeReviewed'"
          @handlePass="handlePass"
          @handleRefuse="handleRefuse"
        />
        <!-- 查看审核意见 -->
        <AuditDetail v-else />
      </div>
    </template>
  </div>
</template>

<script setup>
import Question from './Question.vue'
import AuditForm from './AuditForm.vue'
import AuditDetail from './AuditDetail.vue'

import { ElMessage } from 'element-plus'
import { fetchAuditCommit, fetchAuditQuery } from '@/api/questionBank.js'
import useQuestionbank from '@/hooks/useQuestionbank.js'

const props = defineProps({
  activeQuestion: {
    // 当前tab，待审核：toBeReviewed；已审核：audited
    type: String,
    default: 'toBeReviewed'
  }
})

const emit = defineEmits(['updateQuestion'])
const { activeIndex, question_dtolist } = inject('questionBank')
const { questionId, audit_schedule, question_auditor_volist } = inject('questionInfo')
const { bankId, _fetchQuestion } = useQuestionbank()

// 查询题目审核进度
const _fetchAuditQuery = () => {
  const params = {
    question_bank_id: bankId.value,
    id: questionId.value
  }
  fetchAuditQuery(params).then(res => {
    audit_schedule.value = res.data.audit_schedule
    question_auditor_volist.splice(0)
    question_auditor_volist.push(...res.data.question_auditor_volist)
  })
}

watch(
  () => questionId.value,
  () => {
    _fetchAuditQuery()
  }
)

// 获取试题信息
const handleGetQuestion = () => {
  if (questionId.value) {
    _fetchQuestion(questionId.value).then(res => {
      question_dtolist.splice(activeIndex.value, 1, res)
    })
  }
}

// 上一题
const handleJumpLast = () => {
  if (activeIndex.value > 0) {
    activeIndex.value -= 1
    // 左侧题目列表原始数据中有creator，请求了题目详细信息就去掉了
    if (question_dtolist[activeIndex.value].creator) {
      handleGetQuestion()
    }
  } else {
    ElMessage({
      message: '没有了',
      type: 'warning'
    })
  }
}

// 下一题
const handleJumpNext = () => {
  if (activeIndex.value < question_dtolist.length - 1) {
    activeIndex.value += 1
    if (question_dtolist[activeIndex.value].creator) {
      handleGetQuestion()
    }
  } else {
    ElMessage({
      message: '没有了',
      type: 'warning'
    })
  }
}

// 审核题目
const handleAudit = (status_id, opinion) => {
  const params = {
    opinion, // 审核意见
    question_bank_id: bankId.value,
    question_id: questionId.value,
    status_id // 审核状态 1 通过，2拒绝
  }
  fetchAuditCommit(params).then(res => {
    if (res.code !== 0) {
      ElMessage({
        message: res.msg,
        type: 'warning'
      })
      return
    }

    ElMessage({
      message: '提交成功',
      type: 'success'
    })

    // 修改审核状态
    question_dtolist.splice(activeIndex.value, 1, {
      ...question_dtolist[activeIndex.value],
      status_id
    })

    // 更新待审核题目列表
    emit('updateQuestion', activeIndex.value)

    // 更新审核人员列表
    _fetchAuditQuery()
  })
}

// 通过
const handlePass = e => {
  handleAudit(1, e.trim())
}

// 拒绝
const handleRefuse = e => {
  if (e.trim() === '') {
    ElMessage({
      message: '拒绝必须输入审核意见',
      type: 'warning'
    })
    return
  }
  handleAudit(2, e.trim())
}

defineExpose({
  handleGetQuestion
})
</script>

<style lang="scss" scoped>
.editor {
  height: calc(100% - 20px);
  padding: 0 20px;
  font-size: 14px;
  color: #535560;
  overflow-y: auto;
  &__tips {
    position: relative;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
    border-radius: 4px;
    .add-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
      }
      span {
        line-height: 20px;
        font-size: 14px;
        color: #333;
      }
    }
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
    color: #0175ff;
    background: #fff;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 32px;
      border: 1px solid #0175ff;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      &:hover {
        opacity: 0.85;
      }
    }
  }
  &__content {
    margin-top: -20px;
    margin-bottom: 20px;
    padding-bottom: 30px;
    background: #fff;
    :deep(.question) {
      margin-bottom: 0;
      &.active {
        box-shadow: none;
      }
    }
    .question__answerkeys {
      margin: 0 20px 0 74px;
      padding: 12px 12px 20px;
      line-height: 20px;
      background: #f5f8fe;
      border-radius: 4px;
      p {
        margin-bottom: 12px;
        font-weight: 600;
        color: #333;
      }
      div {
        word-break: break-all;
      }
    }
  }

  &__footer {
  }
}
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
}

::-webkit-scrollbar-track {
  background: #f6f6f6;
}

::-webkit-scrollbar-track-piece {
  background-color: transparent;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
  height: 12px;
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
  height: 12px;
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical:hover,
::-webkit-scrollbar-thumb:horizontal:hover {
  background-color: rgba(144, 147, 153, 0.5);
}
</style>
