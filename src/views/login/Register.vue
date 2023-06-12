<template>
  <Header />
  <div class="container">
    <div class="login">
      <div class="title">快速注册</div>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <el-form-item prop="email">
          <el-input v-model="ruleForm.email" clearable placeholder="公司邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="check_code">
          <el-input v-model="ruleForm.check_code" clearable placeholder="邮箱验证码">
            <template #append>
              <el-button class="code-btn" :disabled="count > 0 || !canClick" @click="handleSendCode">{{count === 0 ? '获取验证码' : `${count}s`}}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <p :class="['tips', {visible: count > 0}]">验证码已发送到您的注册邮箱，请及时查收</p>
        <el-button class="submit-btn" :loading="submitLoading" @click="submitForm(ruleFormRef)" type="primary">注册</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import { ElMessage } from 'element-plus'

import { fetchCheckCode, fetchRegister } from '@/api/register.js'

const router = useRouter()
const ruleFormRef = ref(null)
const ruleForm = reactive({
  email: '',
  check_code: ''
})
const count = ref(0)
const canClick = ref(false)
const isSendCode = ref(false)
const submitLoading = ref(false)

// 邮箱校验
const validateEmail = (rule, value, callback) => {
  canClick.value = false
  if (!value) {
    callback(new Error('请输入比亚迪邮箱'))
    return
  }
  const emailReg = /^[a-zA-Z\d\.]+\@(byd)\.(com)$/
  if (!emailReg.test(value)) {
    callback(new Error('请输入正确的比亚迪邮箱'))
    return
  }
  canClick.value = true
  callback()
}

const rules = reactive({
  email: [{ validator: validateEmail, trigger: 'blur' }],
  check_code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
})

// 倒计时
const timer = null
const handleCountDown = () => {
  if (timer) clearInterval(timer)
  setInterval(() => {
    if (count.value > 0) {
      count.value--
    }
  }, 1000)
}

const handleSendCode = () => {
  isSendCode.value = true
  count.value = 59
  handleCountDown()
  fetchCheckCode(ruleForm.email).then(res => {
    if (res.code !== 0) {
      handleCountDown()
      ElMessage({
        showClose: true,
        message: res.msg,
        type: 'error'
      })
      return
    }
  })
}

const submitForm = formEl => {
  if (!formEl) return
  submitLoading.value = true
  formEl.validate(valid => {
    if (valid) {
      submitLoading.value = false
      const params = {
        email: ruleForm.email,
        check_code: ruleForm.check_code
      }
      fetchRegister(params).then(res => {
        if (res.code !== 0) {
          ElMessage({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
          return
        }
        ElMessage({
          showClose: true,
          message: '注册成功',
          type: 'success',
          onClose: () => {
            router.replace(`/login`)
          }
        })
      })
    } else {
      submitLoading.value = false
      console.log('error submit!')
      return false
    }
  })
}
</script>
<style scoped lang="scss">
.m-header {
  padding: 0;
}
.container {
  min-width: 1200px;
  height: calc(100vh - 64px);
  background: #f2f2f2;
  .login {
    position: absolute;
    left: 50%;
    width: 400px;
    height: 340px;
    margin: 60px 0 0 -200px;
    background: #fff;
    color: #333;
    .title {
      width: 300px;
      margin: 30px auto 20px;
      line-height: 50px;
      font-size: 18px;
      font-weight: 700;
    }
    .el-form {
      width: 300px;
      margin: 0 auto;
      .el-form-item {
        margin-bottom: 20px;
        &:nth-child(2) {
          margin-bottom: 0;
        }
        .el-input {
          height: 40px;
        }
        :deep(.el-input__wrapper.is-focus) {
          box-shadow: 0 0 0 1px #0066fffc inset;
        }
        .code-btn {
          width: 100px;
          height: 40px;
          font-size: 12px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          color: #0066fffc;
          background: #fff;
          border-color: #0066fffc;
          &:hover {
            opacity: 0.85;
          }
          &.is-disabled {
            color: #fffffffc;
            background: #c6c6c6;
            border-color: #c6c6c6;
          }
        }
      }
      .tips {
        line-height: 30px;
        margin-bottom: 30px;
        font-size: 12px;
        color: #aaaaaafc;
        text-indent: 10px;
        visibility: hidden;
        &.visible {
          visibility: visible;
        }
      }
      .submit-btn {
        width: 300px;
        height: 40px;
        font-size: 14px;
        color: #fffffffc;
        background: #0066fffc;
        border-color: #0066fffc;
        &:hover {
          opacity: 0.85;
        }
      }
    }
  }
}
</style>
