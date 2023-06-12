<template>
  <div class="answer">
    <div class="answer-header">
      <div>答案： </div>
      <div v-show="!showAnswer" class="check-answer" @click="showAnswer=true">查看答案</div>
      <div v-show="showAnswer" class="hide-answer" @click="showAnswer=false">收起</div>
    </div>
    <div class="answer-content" v-show="showAnswer">{{question.answer || 12312312123231231}}</div>
  </div>
</template>

<script setup>

defineProps({
  question: {
    type: Object,
    default: () => {}
  }
})

const showAnswer = ref(false)

onMounted(() => {

})

</script>

<style lang="scss" scoped>
.answer {
  color: #333333;
  background: #F5F8FE;
  border-radius: 4px;
  min-height: 42px;
  margin-top: 30px;
  font-size: 14px;
  padding: 10px 10px 10px 20px;
  .answer-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
    .check-answer{
      cursor: pointer;
      margin-left: auto;
      font-size: 14px;
      color: #0175FF;
    }
    .hide-answer{
      cursor: pointer;
      margin-left: auto;
      color: #9196A6;
      font-size: 14px;
    }
  }
  .answer-content{
    margin-top: 5px;
  }
}
</style>
