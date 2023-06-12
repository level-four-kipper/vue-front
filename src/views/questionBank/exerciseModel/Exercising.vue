<template>
  <!-- 刷题中 -->
  <div class="exerciseModel">
    <!-- 标题 -->
    <Operation :title="questionBank.name" @exist="exist" >
    </Operation>
    <div class="exerciseContent">
      <Exercise ref="exerciseRef" @finish="status=2" :last="last">
      </Exercise>
    </div>
  </div>
</template>

<script setup name="ExerciseModel">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Operation from './components/Operation.vue'
import Exercise from './components/Exercise.vue'
import { fetchQuestionBanks } from '@/api/questionBank.js'

const questionBank = ref({})
const route = useRoute()
const status = ref(0)
const last = ref(0)

const exerciseRef = ref(null)

// 题库的详情
function getQuestionBankDetail() {
  fetchQuestionBanks(String(route.query.id)).then(res => {
    if (res.code === 0 && res?.data) {
      questionBank.value = { ...res.data}
    }
  }).catch(err => console.log(err))
}


const exist = () => {
  exerciseRef.value?.fetchExerciseExit()
}

onMounted(async () => {
  getQuestionBankDetail()
})
</script>

<style lang="scss" scoped>
.exerciseModel {
  background-color: #f5f8fe;
  height: 100%;
  min-width: 1200px;
  .exerciseContent{
    display: flex;
    background-color: #f5f8fe;
    justify-content: center;
    width: 100%;
  }
  .padding {
    margin: 0 auto;
  }
  :deep(.el-button){
    font-size: 16px;
  }
}
</style>
