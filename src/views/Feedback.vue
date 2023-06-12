<template>
  <div class="common-layout">
    <el-container class="m-container">
      <el-header class="m-header">
        <Header></Header>
      </el-header>
      <el-container v-if="!submitSuccess" class="m-container-cnt">
        <el-main class="m-content">
          <div class="container">
            <div class="form-title">用户反馈</div>
            <div class="form-content">
              <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-position="top">
                <el-form-item label="问题标题" prop="title">
                  <el-input v-model.number="ruleForm.title" class="title-input" clearable />
                </el-form-item>
                <el-form-item label="问题描述" prop="content_md">
                  <Editor ref="editorFormRef" v-model="ruleForm.content_md" class="editor" to-edit :max-length="3000" />
                </el-form-item>
              </el-form>
              <el-button :loading="loading" class="submit-btn" @click="userFeedback">提交</el-button>
            </div>
          </div>
        </el-main>
      </el-container>
      <div v-else class="success-msg">您已完成反馈，谢谢您的参与！</div>
    </el-container>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Editor from '@/components/Editor.vue'
import { ElMessage } from 'element-plus'

import { fetchUserFeedback } from '@/api/userManage.js'

const ruleFormRef = ref()
const ruleForm = reactive({
  title: '',
  content_md: '',
})

const rules = reactive({
  title: { required: true, message: '不能为空', trigger: 'blur' },
  content_md: { required: true, message: '不能为空', trigger: 'blur' },
})

const submitSuccess = ref(false)
const loading = ref(false)

// 表单提交
function userFeedback() {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      fetchUserFeedback({ ...ruleForm }).then(res => {
        if (res.code !== 0) {
          loading.value = false
          ElMessage.error(res.msg || res.data.error)
        } else {
          setTimeout(() => {
            loading.value = false
            submitSuccess.value = true
          }, 1000)
        }
      })
    }
  })
}
</script>

<style scoped lang="scss">
.m-header {
  padding: 0;
  min-width: 1200px;
}
.container {
  max-width: 1280px;
  margin: 20px auto;
  font-family: 'Arial Normal', 'Arial', sans-serif;
  border-radius: 4px;
  .form-title {
    height: 70px;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
    justify-content: center;
  }
  .form-content {
    min-height: 480px;
    display: flex;
    flex-direction: column;
    padding: 20px 40px;
    .add {
      color: #0066fffc;
      cursor: pointer;
    }
  }
  .el-button {
    width: 64px;
    height: 30px;
    font-size: 12px;
    border-style: none;
    background-color: #0066fffc;
  }

  .submit-btn {
    margin-right: 160px;
    color: white;
    margin: 20px auto 0;
  }
  .editor {
    width: 100%;
    :deep(.v-md-editor) {
      height: 500px;
    }
  }
}
.success-msg {
  position: fixed;
  left: 50%;
  top: 26%;
  transform: translateX(-50%);
  font-family: 'Arial Normal', 'Arial', sans-serif;
  font-size: 14px;
  user-select: none;
}
</style>
