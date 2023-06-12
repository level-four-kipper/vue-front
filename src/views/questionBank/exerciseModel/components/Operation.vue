<template>
  <div class="operation" ref="operation">
    <div class="operationContent">
      <div>  {{ title }} </div>
      <el-button type="primary" @click="exist">退出</el-button>
    </div>
  </div>
</template>

<script setup name="Operation">
import { ElMessageBox } from 'element-plus'
defineProps({
  title: {
    type: String,
    default: () => ''
  },
})

const emit = defineEmits( ['exist'] )
// 退出
const exist = () => {
  ElMessageBox.confirm( '确定退出刷题模式吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    emit('exist')
  })
}
</script>

<style lang="scss" scoped>
.operation {
  height: 64px;
  line-height: 64px;
  background-color: #ffffff;
  font-size: 20px;
  display: flex;
  justify-content: center;
  color: #333333;
  .operationContent{
    margin: 0 20px;
    width: 1200px;
    display: flex;
    justify-content: space-between;
    :deep(.el-button--primary){
      cursor: pointer;
      display: flex;
      width: 60px;
      height: 32px;
      background: #0175ff;
      border-color: #0175FF;
      border-radius: 4px;
      line-height: 64px;
      margin: 16px 0;
    }
  }
}
</style>
