<template>
  <div>
    <div class="title">热门题目</div>
    <div class="list">
      <div v-for="item in list" :key="item.id" class="list__cell" @click="handleClick(item.id)">
        <div class="question-title">{{ item.title }}</div>
        <div class="test-number">{{ item.comment_count || 0 }}个回答</div>
      </div>
    </div>
  </div>
  <div v-if="!list.length" class="no-data">暂无数据</div>
</template>

<script setup>
import useQuestionbank from '@/hooks/useQuestionbank'
import { fetchHotQuestions } from '@/api/questionBank.js'

const router = useRouter()
const { bankId } = useQuestionbank()
const list = ref([])

const _fetchHotQuestions = () => {
  fetchHotQuestions(bankId.value).then(res => {
    list.value = res.data || []
  })
}

// 跳转到题目详情页
const handleClick = id => {
  window.open(`/questionBank/topicDetail?id=${id}`, '_blank')
}

onMounted(() => {
  _fetchHotQuestions()
})
</script>

<style lang="scss" scoped>
.title {
  line-height: 22px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.list {
  &__cell {
    display: flex;
    align-items: center;
    line-height: 20px;
    margin-top: 16px;
    font-size: 14px;
    .question-title {
      flex: 1;
      margin-right: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
      cursor: pointer;
      &:hover {
        color: #0175ff;
      }
    }
    .test-number {
      color: #9196a6;
    }
  }
}
.no-data {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #9196a6;
}
</style>
