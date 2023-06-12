<template>
  <div :class="['input-answer', border? '' : 'border']" >
    <el-input class="tex"
      :autosize="{ minRows: min}"
      placeholder="请作答"
      resize="none"
      type="textarea"
      v-model="answer">
    </el-input>
  </div>
</template>

<script setup>

const props = defineProps({
  min:{
    type: Number,
    default: 1
  },
  border:{
    type: Boolean,
    default: false
  }
})

const answer = ref('')

onMounted(() => {

})

</script>

<style lang="scss" scoped>
.input-answer{
  margin-top: 10px;
}
.border{
  :deep(.el-textarea){
    .el-textarea__inner{
      box-shadow: 0 0 0 0px;
      min-height: 20px !important;
      line-height: 24px;
      padding: 2px;
      font-size: 14px;
      color: #535560;
    }
    .el-textarea__inner:hover{
      box-shadow: 0 0 0 0px;
    }
    .el-textarea__inner:focus{
      box-shadow: 0 0 0 0px;
    }
  }
}
</style>
