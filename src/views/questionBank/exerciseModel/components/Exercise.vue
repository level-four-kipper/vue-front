<template>
  <div ref="exercisingRef" class="exercising">
    <QuestionDetail ref="questionDetailRef" :question="question" @change="changeAnswer"></QuestionDetail>

    <div class="statistics">
      <Statistics :statistic="question.bank_exercise_vo"></Statistics>
      <div class="action">
        <el-button :class="['action-button', disabledConfirm ? 'disabled' :'']" :disabled="disabledConfirm" @click="confirm">确定</el-button>
        <el-button :class="['action-button', disabledNext ? 'disabled' :'']" :disabled="disabledNext" @click="next">下一题</el-button>
      </div>
    </div>

  </div>
</template>

<script setup name="Exercising">
import { ref, onMounted } from 'vue';
import QuestionDetail from './QuestionDetail.vue'
import Statistics from './Statistics.vue'
import { getExerciseStart, postExerciseConfirm, getExerciseNext } from '@/api/questionBank.js'

defineProps( {
  last: {
    type: Number,
    default: 0
  }
})

const route = useRoute()
const router = useRouter()
const questionDetailRef = ref()
const disabledConfirm = ref(true)
const disabledNext = ref(true)
const question = ref({})

const validateAnswer = () => {
  const param = {
    bank_id: route.query.id,
    solution: questionDetailRef?.value.answerList.join('、')
  }
  postExerciseConfirm(param).then(({code, data}) => {
    if (code === 0 ) {
      question.value = { ...data}
      disabledConfirm.value = true
    }
  }).catch(err => console.log(err))
}

const confirm = () => {
  // console.log('Exercise------confirm--------', questionDetailRef, questionDetailRef?.value.answerList)
  if(questionDetailRef?.value.answerList?.length){
    validateAnswer()
    disabledNext.value = false
  }
}

const next = () => {
  if( question.value?.finish_flag ){
    sessionStorage.setItem("bank_result", JSON.stringify(question.value.bank_exercise_vo));
    router.push({ path:'/exerciseModel/finish', query: { id: route.query.id }})
  } else {
    disabledConfirm.value = true
    disabledNext.value = true
    fetchExerciseNext()
    questionDetailRef?.value.refresh()
  }
}

const changeAnswer = (val) => {
  // console.log('Exercise------changeAnswer--------', questionDetailRef, questionDetailRef?.value.answerList)
  if(val?.length || questionDetailRef?.value.answerList?.length ){
    disabledConfirm.value = false
  } else {
    disabledConfirm.value = true
  }
}

const storeBank = (data) => {
  question.value = { ...data}
}

// 开始刷题
function fetchExerciseStart() {
  getExerciseStart(String(route.query.id)).then(({code, data}) => {
    if (code === 0 ) {
      storeBank(data)
    }
  }).catch(err => console.log(err))
}

// 点击下一题, 获取下一题信息
const fetchExerciseNext = () => {
  getExerciseNext(String(route.query.id)).then(({code, data}) => {
    if (code === 0 ) {
      storeBank(data)
    }
  }).catch(err => console.log(err))
}

//  退出刷题模式
const fetchExerciseExit = () => {
  router.push({ path:'/questionBank/detail', query: { id: route.query.id }})
}


onMounted( async ()=>{
  fetchExerciseNext()
  // let current_bank = sessionStorage.getItem("current_bank")
  // if(current_bank){
  //   question.value = JSON.parse(current_bank)
  // } else {
  //   if(route.query.last){
  //     fetchExerciseNext()
  //   } else {
  //     fetchExerciseStart()
  //   }
  // }
})

defineExpose({
  fetchExerciseExit
})
</script>
<style lang="scss" scoped>
.exercising {
  color: #535560;
  display: flex;
  margin: 20px;
  width: 1200px;

  .statistics{
    height: 600px;
    margin-left: 20px;
    text-align: center;
    color: #333333;
    width: 300px;
    .action{
      margin-top: 30px;
      .action-button{
        // cursor: pointer;
        color: #FFFFFF;
        text-align: center;
        background: #0175FF;
        border-radius: 4px;
        line-height: 42px;
        margin-top: 30px;
        margin-left: 0;
        font-size: 16px;
        height: 42px;
        width: 100%;
      }
      .disabled{
        opacity: 0.3;
      }
    }
  }
}
</style>
