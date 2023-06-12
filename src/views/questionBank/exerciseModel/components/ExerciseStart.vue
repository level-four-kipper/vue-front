<template>
  <div class="exerciseStart" ref="exerciseStart">
    <div class="welcome" >欢迎进入刷题模式！</div>
    <el-button type="primary" @click="start">点击开始</el-button>
    <div class="footer">
      监测到您上一次的答题记录，是否继续？
      <el-button type="primary" @click="startLastTime">继续上一次</el-button>
    </div>
  </div>
</template>

<script setup name="ExerciseStart">
import { onMounted } from 'vue';

const emit = defineEmits( ['start', 'startLastTime'] )
// 直接开始
const start = () => {
  emit('start')
}
// 继续上一次
const startLastTime = () => {
  emit('startLastTime')
}
onMounted( async ()=>{
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
