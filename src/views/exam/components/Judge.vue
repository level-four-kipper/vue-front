<template>
  <SingleSelection :question="questionJudge" :onAnswerChange="onAnswerChange"> </SingleSelection>
</template>

<script setup>
import SingleSelection from './SingleSelection.vue'
import {ref,reactive} from 'vue'
const props = defineProps({
   question:Object,
   onAnswerChange:Function
})
const questionJudge =reactive(props.question)
questionJudge.option_list = ['正确', '错误']
// console.log(questionJudge,'questionJudge')
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
