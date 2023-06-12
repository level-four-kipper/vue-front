<template>
  <div class="qs-container">
    <QuestionHeader :question="question"></QuestionHeader>
    <ul class="qs-content">
      <li v-for="(item,index) in question.option_list" :key="index">
        <input type="checkbox" :value="item" @change="answerChange(item,index)" v-model="checkedOptions[index].checked" />
        <span>{{item}} </span>
      </li>
    </ul>
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
const checkedOptions=ref( props.question.option_list?getOption():[])

function getOption(){
  const options = []
   props.question.option_list.forEach(i =>
    {
      if(answerPaper.questions[props.question.question_serial-1].answer === i)
      {
        options.push({value:i,checked:true})
      }else{
        options.push({value:i,checked:false})
      }
    })
   return options
}

function answerChange( ){
  const  selectOptions = []
  checkedOptions.value.forEach(item => item.checked && selectOptions.push(item.value))
  props.onAnswerChange(selectOptions.length === 0 ?null: selectOptions)

}
</script>

<style scoped lang="scss">
.qs-container{
  background: #fff;
  border: 1px solid #dedede;
  .qs-content{
    border-top: none;
    li{
      list-style: none;
      &.single-selection{
        height: 0;
        width: 0;
      }
    }
  }
}
</style>
