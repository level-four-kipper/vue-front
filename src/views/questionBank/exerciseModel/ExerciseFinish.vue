<template>
  <div class="exerciseModel">
    <!-- 标题 -->
    <Operation :title="questionBank.name" @exist="exist" >
    </Operation>
    <div class="exerciseContent">
      <!-- 刷题结束 -->
      <ExerciseFinished >
      </ExerciseFinished>
    </div>
  </div>
</template>

<script setup name="ExerciseModel">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Operation from './components/Operation.vue'
import ExerciseFinished from './components/ExerciseFinished.vue'

const questionBank = ref({})
const router = useRouter()
const route = useRoute()


const exist = () => {
  router.push({ path: '/questionBank/detail', query: { id: route.params.id}})
}


onMounted(async () => {
  
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
