<template>
  <div class="question" >
    <el-button-group>
      <el-button >{{ ( question?.question_index || 1 )}}</el-button>
      <el-button >{{ types[question?.type_id || 0]}}</el-button>
    </el-button-group>

    <div class="title"> {{ question?.title || '' }}</div>

    <div class="options">
      <el-checkbox-group v-model="answerList" @change="changeAnswer">
        <el-checkbox :label="option[index]" v-for="(item, index) in question?.option_volist" :key="option[index]" :disabled="showSolution">{{ option[index] + '.  ' + item.option_content}}</el-checkbox>
      </el-checkbox-group>
    </div>

    <Solution v-if="showSolution" :answer="question.answer" :result="resultFlag"> </Solution>
  </div>
</template>

<script setup name="Exercising">
import { ref } from 'vue'
import Solution from './Solution.vue'

const props = defineProps({
  question: {
    type: Object,
    default: () => {}
  }
})

const emits = defineEmits(['change'])

const types = ['单选题', '多选题', '简答题', '编程题']
const option = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const answerList = ref([])
const showSolution = ref(false)
const resultFlag = ref(true)

const changeAnswer = (val) => {
  console.log('QuestionDetail------changeAnswer-----', val, answerList.value)
  if(props.question.type_id === 0 && val.length > 1){
    answerList.value.shift()
  }
  emits('change', val)
}

watch(
  () => props.question?.check_flag,
  newVal => {
    if(newVal===0 || newVal===1){
      console.log('props.question?.check_flag', newVal)
      showSolution.value = true
      resultFlag.value = newVal ? true : false;
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const validateAnswer = () => {
  if(answerList.value.length > 0){
    answerList.value.forEach((item)=>{
      if(!(props?.question?.answer?.indexOf(item) >= 0)){
        resultFlag.value = false;
      }
    })
    showSolution.value = true
  }
}

const refresh = () => {
  answerList.value = []
  showSolution.value = false
  resultFlag.value = true
}

onMounted( async ()=>{
})

defineExpose({
  answerList,
  refresh,
  validateAnswer
})
</script>
<style lang="scss" scoped>
.question{
    background-color: #ffffff;
    width: 880px;
    height: 600px;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 28px;
    background: #FFFFFF;
    box-shadow: 0 2px 16px 0 rgba(156,172,209,0.30);
    border-radius: 4px;
    padding: 30px;
    :deep(.el-button){
      cursor: pointer;
      border-color: #0175FF;
      color: #0175FF;
    }
    .title{
      color: #333333;
      font-size: 18px;
      margin-top: 28px;
    }
    .options{
      :deep(.el-checkbox){
        color: #535560;
        font-size: 14px;
        margin-top: 25px;
        line-height: 25px;
        width: 100%;
        --el-checkbox-checked-bg-color: var(--el-color-white);
        --el-checkbox-checked-icon-color: var(--el-color-primary);
      }
    }
    .footer{
      bottom:30px;
      border-radius: 4px;
      background: #EEF3FD;
      text-align: center;
      position: absolute;
      line-height: 110px;
      font-size: 16px;
      height: 110px;
      width: 95%;
      left: 2.5%;
    }
  }
</style>
