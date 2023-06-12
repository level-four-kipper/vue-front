<template>
  <div class="qs-container">
    <QuestionHeader :question="question"></QuestionHeader>
    <div class="qs-content">
      <textarea autofocus @blur=" e => onAnswerChange(e.target.value || null) " :value="answer"></textarea>
    </div>
  </div>
</template>

<script setup>
import QuestionHeader from './QuestionHeader.vue'
import {ref,reactive} from 'vue'
const props = defineProps({
   question:Object,
   onAnswerChange:Function
})
const answerPaper = JSON.parse(localStorage.getItem('answerPaper'))
const answer = ref(answerPaper.questions[props.question.question_number-1].answer)
</script>

<style scoped lang="scss">
.qs-container{
  background: #fff;
  border: 1px solid #dedede;
  }
    .qs-content{
      border: none;
      textarea{
        height: 100%;
        width:100%;
        border: none;
        outline: none;
        resize:none;
      }
    }
</style>
