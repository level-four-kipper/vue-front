<template>
  <Header />
  <div class="container">
    <div class="login">
      <div class="title">{{['安全认证', '重置密码'][step]}}</div>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
        <template v-if="step === 0">
          <el-form-item label="注册邮箱" prop="email">
            <el-input v-model="ruleForm.email" clearable placeholder="公司邮箱"></el-input>
          </el-form-item>
        </template>
        <div v-else class="pass-form">
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="ruleForm.newPassword" type="password" autocomplete="new-password" :readonly="readonlyFlag" @focus="readonlyFlag = false" show-password clearable placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="ruleForm.confirmPassword" type="password" autocomplete="new-password" :readonly="readonlyFlag" @focus="readonlyFlag = false" show-password clearable placeholder="请确认新密码" @keyup.enter="submitForm(ruleFormRef)"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="checkCode" class="verificationCode">
            <el-input v-model="ruleForm.checkCode" />
          </el-form-item>
        </div>
        <el-button class="submit-btn" :loading="submitLoading" @click="submitForm(ruleFormRef)" type="primary">{{['发送', '重置密码'][step]}}</el-button>
        <p class="message" v-if="msgType !== ''">
          <img v-if="msgType === 0" src="../../assets/img/u45.svg" />
          <img v-else src="../../assets/img/u47.svg" />
          <span :class="{success: msgType === 0}">{{msgMap[msgType]}}</span>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import { ElMessage } from 'element-plus'
import { fetchCheckCode } from '@/api/register.js'
import { useLoginStore } from '@/stores/login.js'
import { updatePasswordForget } from '@/api/authorSpace.js'
const loginStore = useLoginStore()
import { encrypt } from '@/utils/encrypt.js'
const ruleFormRef = ref(null)
const ruleForm = reactive({
  email: '',
  checkCode: '',
  name: '',
  newPassword:'',
  confirmPassword: ''
})
const count = ref(0)
const isSendCode = ref(false)
const submitLoading = ref(false)
const step = ref(0)
const msgType = ref('')
const msgMap = reactive({
  0: '重置密码的链接已经发送到您的注册邮箱,请查收！',
  1: '该邮箱并未注册！',
  2: '密码不符合要求，请重新设置'
})
const readonlyFlag = ref(true)

// 邮箱校验
const validateEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入比亚迪邮箱'))
  }
  const emailReg = /^[a-zA-Z\d\.]+\@(byd)\.(com)$/
  if (!emailReg.test(value)) {
    callback(new Error('请输入正确的比亚迪邮箱'))
  }
  callback()
}

const rules = reactive({
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
  checkCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
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

// const handleSendCode = () => {
//   isSendCode.value = true
//   count.value = 59
//   handleCountDown()
// }
const router = useRouter()
const handleSendCode = () => {
  isSendCode.value = true
  count.value = 59
  handleCountDown()
  fetchCheckCode(ruleForm.email).then(res => {
    if (res.code !== 0) {
      clearInterval(timer)
      ElMessage({ showClose: true, message: res.msg, type: 'error' })
      return
    }
    router.push({path: '/forgetPassword', query:{ email: ruleForm.email}})
  })
}

const changePassword = async () => {
  isSendCode.value = true
  let params = {
    email: ruleForm.email,
    check_code: ruleForm.checkCode,
    confirm_password: ruleForm.confirmPassword,
    new_password: ruleForm.newPassword,
  }
  updatePasswordForget(params).then(res => {
    if (res.code !== 0) {
      ElMessage({ showClose: true, message: res.msg, type: 'error' })
      return
    }

    loginStore.loginOut()
  })
}

const submitForm = formEl => {
  if (!formEl) return
  submitLoading.value = true
  formEl.validate(valid => {
    if (valid) {
      submitLoading.value = false
      handleAction()
    } else {
      submitLoading.value = false
      return false
    }
  })
}

const handleAction = () => {
  if(step.value === 0){
    handleSendCode()
  } else if(step.value === 1){
    changePassword()
  }
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
    height: 501px;
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
        :deep(.el-form-item__label) {
          margin-bottom: 3px;
          font-size: 12px;
        }
        .el-input {
          font-size: 12px;
          height: 40px;
          // :deep(.el-input__wrapper) {
          //   border-radius: 0;
          // }
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
      &.pass-form {
        .el-form-item {
          .el-input {
            height: 40px;
          }
        }
      }
      .submit-btn {
        width: 300px;
        height: 40px;
        font-size: 12px;
        color: #fffffffc;
        background: #0066fffc;
        border-color: #0066fffc;
        border-radius: 4px;
        &:hover {
          opacity: 0.85;
        }
      }
      .message {
        display: flex;
        align-items: center;
        margin-top: 15px;
        font-size: 12px;
        img {
          margin-right: 3px;
        }
        span {
          line-height: 14px;
          color: #d81e06;
          &.success {
            color: #1d7926;
          }
        }
      }
    }
  }
}
</style>
