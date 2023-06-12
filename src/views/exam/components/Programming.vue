<template>
  <div class="qs-container">
    <QuestionHeader :question="question"></QuestionHeader>
    <div class="qs-content">
      <div class="caution">
        <div><span>您可以使用以下编程语言(java、C、C++、Python、Go)</span></div>
        <div>
          <select name="" id="">
            <option v-for="(item,index) in programmingLanguage" :key="index" value="item">{{item}}</option>
          </select>
        </div>
      </div>
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
const programmingLanguage= ['java','C','C++','Python','Go']
const answerPaper = JSON.parse(localStorage.getItem('answerPaper'))
const answer = ref(answerPaper.questions[props.question.question_number-1].answer)
</script>

<style scoped lang="scss">

.qs-container{
    background: #fff;
    border: 1px solid #dedede;
    }
    .qs-content{
      .caution{
        display: flex;
        justify-content: space-between;
        padding-bottom: 10px  ;
      select{
        height: 30px;
        width: 80px;
        border:solid 1px #ccc;
        padding: 2px 2px 2px 10px;
        outline: none;
      }
    }
     textarea{
      width: 100%;
      height: 300px;
      border: none;
      outline: none;
      resize:none;
      border:1px solid #ccc;
    }
  }
</style>
