<template>
  <el-tabs v-model="activeQuestion" class="demo-tabs">
    <el-tab-pane label="题型" name="questionType">
      <QuestionType @handleTypeClick="handleTypeClick" />
    </el-tab-pane>
    <el-tab-pane label="题目" name="questionList">Config</el-tab-pane>
  </el-tabs>
</template>

<script setup>
</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav) {
  width: 100%;
  .el-tabs__item {
    padding: 0;
    width: 50%;
    text-align: center;
  }
  .el-tabs__active-bar {
    width: 50%;
  }
}
</style>
