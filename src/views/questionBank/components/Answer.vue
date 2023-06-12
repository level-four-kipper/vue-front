<template>
  <div class="answer">
    <div class="answer-header">
      <div>
        答案：
        <span v-if="[0, 1].includes(question?.type_id) && showAnswer">{{ question.answer }}</span>
      </div>
      <div class="jump" @click="jumpDetail(question)">题目详情 ></div>
    </div>
    <div v-if="[2, 3].includes(question?.type_id) && showAnswer" class="answer-content">{{ question.answer }}</div>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    default: () => {}
  },
  showAnswer: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const route = useRoute()

const jumpDetail = question => {
  router.push({ path: '/questionBank/topicDetail', query: { id: question.id, questionBankId: route.query?.id || undefined } })
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.answer {
  color: #333333;
  background: #f5f8fe;
  border-radius: 4px;
  min-height: 42px;
  margin-top: 30px;
  font-size: 14px;
  padding: 10px 10px 10px 20px;
  .answer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
    .jump {
      color: #0175ff;
      cursor: pointer;
    }
  }
  .answer-content {
    margin-top: 5px;
  }
}
</style>
