<template>
  <div class="exerciseModel">
    <!-- 标题 -->
    <Operation :title="questionBank.name" @exist="exist" >
    </Operation>
    <div class="exerciseContent">
      <!-- 刷题开始 -->
      <ExerciseStart v-if="status===0" :title="questionBank.name" @start="startAnswer" >
      </ExerciseStart>
      <!-- 刷题中 -->
      <Exercising v-if="status===1" :question-bank="questionBank" :index="last" @finish="status=2">
      </Exercising>
      <!-- 刷题结束 -->
      <ExerciseFinished v-if="status===2" >
      </ExerciseFinished>

    </div>
    <div>
    </div>
  </div>
</template>

<script setup name="ExerciseModel">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Operation from './components/Operation.vue'
import ExerciseFinished from './components/ExerciseFinished.vue'
import ExerciseStart from './components/ExerciseStart.vue'
import Exercising from './components/Exercising.vue'
import { fetchQuestionBanks } from '@/api/questionBank.js'

const questionBank = ref({})
const router = useRouter()
const route = useRoute()
const status = ref(0)
const last = ref(0)

// 题库的详情
function getQuestionBankDetail() {
  fetchQuestionBanks(String(route.query.id)).then(res => {
    if (res.code === 0 && res?.data) {
      questionBank.value = { ...res.data}
    }
  }).catch(err => console.log(err))
}

const exist = () => {
  router.push({ path: '/questionBank/detail', query: { id: route.query.id}})
}

const startAnswer = (tag) => {
  status.value = 1
  if(tag){
    last.value = 1
  }
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
