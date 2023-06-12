<template>
  <!-- 开始刷题 -->
  <div class="exerciseModel">
    <!-- 标题 -->
    <Operation :title="questionBank.name" @exist="exist" >
    </Operation>
    <div class="exerciseContent">
      <Start :title="questionBank.name" @start="startAnswer" >
      </Start>
    </div>
    <div>
    </div>
  </div>
</template>

<script setup name="ExerciseModel">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Operation from './components/Operation.vue'
import Start from './components/Start.vue'
import { fetchQuestionBanks } from '@/api/questionBank.js'

const questionBank = ref({})
const router = useRouter()
const route = useRoute()

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

const startAnswer = () => {
  router.push({ path:'../exercising', query: { id: route.query.id, total: route.query.total }})
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
