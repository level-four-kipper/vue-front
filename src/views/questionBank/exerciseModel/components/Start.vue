<template>
  <div class="exerciseStart" ref="exerciseStart">
    <div class="welcome" >欢迎进入刷题模式！</div>
    <el-button type="primary" @click="start">点击开始</el-button>
    <div class="footer" v-if="last">
      监测到您上一次的答题记录，是否继续？
      <el-button type="primary" @click="startLastTime">继续上一次</el-button>
    </div>
  </div>
</template>

<script setup name="ExerciseStart">
import { onMounted } from 'vue';
import { getNotFinishedExercise, getExerciseStart } from '@/api/questionBank.js'

const router = useRouter()
const route = useRoute()
const last = ref(0)

// 是否有未完成的刷题进度
function fetchNotFinishedExercise() {
  getNotFinishedExercise(String(route.query.id)).then( ({code, data}) => {
    if (code === 0 && data) {
      last.value = data || 0
    }
  }).catch(err => console.log(err))
}

// 开始刷题
function fetchExerciseStart() {
  getExerciseStart(String(route.query.id)).then(({code}) => {
    if (code === 0 ) {
      router.push({ path:'exercising', query: { id: route.query.id , start: 'start'}})
    }
  }).catch(err => console.log(err))
}

//  name: 'certainQuestionList',
//     params: { questionBank_id: id }
// 直接开始
const start = () => {
  fetchExerciseStart()
  // router.push({ path:'/exerciseModel/exercising', query: { id: route.query.id }})
}
// 继续上一次
const startLastTime = () => {
  router.push({ path:'/exerciseModel/exercising', query: { id: route.query.id, last: last.value }})
}
onMounted( async ()=>{
  fetchNotFinishedExercise()
})
</script>
<style lang="scss" scoped>
.exerciseStart {
  color: #535560;
  background-color: #ffffff;
  padding-top: 220px;
  margin: 20px;
  height: 600px;
  width: 1200px;
  text-align: center;
  .welcome{
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 28px;
  }
  .footer{
    bottom:30px;
    border-radius: 4px;
    background: #EEF3FD;
    font-size: 16px;
    line-height: 110px;
    height: 110px;
    left: 2.5%;
    width: 95%;
    position: absolute;
    text-align: center;
  }
  :deep(.el-button--primary){
    cursor: pointer;
    background: #0175ff;
    border-color: #0175FF;
    border-radius: 4px;
  }
}
</style>
