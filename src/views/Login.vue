<template>
  <div class="common-layout">
    <el-container class="m-container">
      <el-header class="m-header">
        <Header></Header>
      </el-header>
      <el-container class="m-container-cnt">
        <el-main class="m-content">
          <div class="container">
            <div style="font-size:14px;font-weight:700">欢迎登录！</div>
            <div class="form">
              <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm" status-icon label-position="left">
                <el-form-item label="工号" prop="employeeNumber">
                  <el-input v-model.number="ruleForm.employeeNumber" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input type="password" show-password v-model="ruleForm.password" @keyup.enter="login(ruleFormRef)" />
                </el-form-item>
                <el-form-item>
                  <el-button @click="login(ruleFormRef)" class="loginButton">登录</el-button>
                  <el-button type="primary" @click="toRegister()" class="registerButton">注册</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

import { useLoginStore } from '@/stores/login.js'
const loginStore = useLoginStore()

const ruleFormRef = ref()
const ruleForm = reactive({
  employeeNumber: '',
  password: ''
})
const rules = reactive({
  employeeNumber: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { type: 'number', message: '工号为数字' }
  ],
  password: { required: true, message: '请输入密码', trigger: 'blur' }
})

const route = useRoute()
console.log(route, 'route')

//登录
const login = formEl => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      loginStore.loginIn(ruleForm.employeeNumber, ruleForm.password)
    }
  })
}

//跳转到注册
const router = useRouter()
function toRegister() {
  router.push({ path: '/register' })
}
</script>

<style scoped lang="scss">
.m-header {
  padding: 0;
}
.container {
  width: 480px;
  margin: 100px auto;
  font-family: 'Arial Normal', 'Arial', sans-serif;
  .form {
    width: 450px;
    height: 200px;
    margin: 15px 0;
    color: pink;
    border: 1px solid rgb(222, 222, 222, 1);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 30px;
  }
  .el-button {
    width: 64px;
    height: 30px;
    font-size: 12px;
    border-style: none;
    background-color: #0066fffc;
  }
  .registerButton {
    background-color: white;
    color: #0066fffc;
  }
  .loginButton {
    margin-right: 160px;
    color: white;
  }
}
</style>
