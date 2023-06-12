<template>
  <div class="question-bank-management">
    <QuestionBankHeader @open-drawer="openDrawer" />
    <div class="main">
      <router-view />
    </div>
  </div>
  <!-- 题库设置 -->
  <EditQuestionBank ref="editQuestionBankRef" />
</template>

<script setup name="questionBankManagement">
import QuestionBankHeader from './components/Header.vue'
import EditQuestionBank from '../components/editQuestionBank.vue'

import { ElMessage } from 'element-plus'

const route = useRoute()

// 打开题库设置抽屉
const editQuestionBankRef = ref()
const openDrawer = () => {
  const { id = '' } = route.query
  if (!id) {
    return ElMessage.error('无法获取到题库信息')
  }
  editQuestionBankRef.value.handleOpen(id)
}
</script>

<style lang="scss" scoped>
.question-bank-management {
  background-color: #f5f8fe;
  height: 100%;
  .main {
    display: flex;
    height: calc(100% - 54px);
    min-width: 1280px;
    margin: 0 auto;
  }
}
</style>
