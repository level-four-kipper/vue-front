<template>
  <SearchBox v-model:keyword="searchVal" placeholder="搜索题目" />
  <div class="total-number">共计{{ count }}条</div>
  <div class="question-list">
    <div
      class="question-list__cell"
      v-for="(item, index) in questionList"
      :key="index"
      @click.stop="handleQuestionClick(index)"
    >{{ item.title }}</div>
  </div>
</template>

<script setup>
import SearchBox from './SearchBox.vue'

import Bus from '@/utils/bus.js'
import _ from 'lodash'
import useQuestionbank from '@/hooks/useQuestionbank.js'
import { fetchQuestionList, fetchAuditQuestions } from '@/api/questionBank.js'

const props = defineProps({
  type: {
    // 0: 编辑页；1：审核页
    type: Number,
    default: 0
  },
  status: {
    // 编辑页-审核状态，0：审核中；1：已收录；2：已拒绝
    // 审核页-审核状态，0：待审核；1：已审核
    type: Number,
    default: 0
  }
})

const { question_dtolist, activeIndex, toBeReviewedList, auditedList } = inject('questionBank')
const { _fetchQuestion } = useQuestionbank()
const route = useRoute()
const bankId = ref(route.query.id || '')
const searchVal = ref('')
const count = ref(0)
const questionList = ref([])

// 获取题目列表
const _fetchQuestionList = () => {
  return new Promise((resolve, reject) => {
    const params = {
      audit_status: props.status,
      bank_id: bankId.value,
      question_title: searchVal.value
    }
    // 编辑
    if (props.type === 0) {
      fetchQuestionList(params).then(res => {
        if (res.code !== 0) {
          reject()
          return
        }
        count.value = res.data.count
        questionList.value = res.data.question_volist || []
        resolve()
      })
    } else {
      // 审核
      fetchAuditQuestions(params).then(res => {
        if (res.code !== 0) {
          reject()
          return
        }
        count.value = res.data.count
        questionList.value = res.data.question_volist || []
        if (props.status === 0) {
          toBeReviewedList.splice(0)
          toBeReviewedList.push(...questionList.value)
        } else {
          auditedList.splice(0)
          auditedList.push(...questionList.value)
        }
        resolve()
      })
    }
  })
}

watch(
  () => searchVal.value,
  () => {
    // 此处不做前端过滤，考虑到切换待审核、已审核tab切换时，如果有搜索内容，查出来的题目列表是空的，即使情况搜索内容也回不去了
    _fetchQuestionList()
  }
)

// 点击题目
const handleQuestionClick = index => {
  let canPush = true

  // 审核页面，点击题目把整个题目列表添加到编辑区
  if (props.type === 1) {
    question_dtolist.splice(0)
    question_dtolist.push(...questionList.value)
    activeIndex.value = index
    // 获取题目详情
    _fetchQuestion(questionList.value[index].id).then(res => {
      // 替换
      question_dtolist.splice(index, 1, res)
    })
    return
  }

  // 编辑页面需要判断是否已在列表逐个添加
  question_dtolist.forEach(item => {
    if (item.id === questionList.value[index].id) {
      canPush = false
    }
  })

  // 获取题目详情
  _fetchQuestion(questionList.value[index].id).then(res => {
    // 插入到底部
    if (canPush) {
      question_dtolist.push(res)
    }
  })
}

// 删除时从列表中移除题目
const deleteQuestion = e => {
  console.log(e)
  _fetchQuestionList()
}

onMounted(() => {
  if (props.type === 0) {
    _fetchQuestionList()
  }

  Bus.on('deleteQuestion', deleteQuestion)
})

onBeforeUnmount(() => {
  Bus.off('deleteQuestion', deleteQuestion)
})

defineExpose({
  _fetchQuestionList
})
</script>

<style lang="scss" scoped>
.search-box {
  margin: 16px 0 30px;
}
.total-number {
  line-height: 20px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
}
.question-list {
  max-height: calc(100vh - 418px);
  overflow-y: auto;
  &__cell {
    line-height: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    cursor: pointer;
    &:hover {
      color: #0175ff;
    }
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
