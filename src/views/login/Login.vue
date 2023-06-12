<template>
  <div class="container">
    <img class="bg" src="@/assets/img/login/bg.png" alt />
    <img class="logo" src="@/assets/img/login/logo.png" alt />
    <div class="login">
      <div class="title">欢迎来到技术提升平台</div>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <div class="subtitle">
          <div>{{ ['邮箱登录', '密码登录'][tabIndex] }}</div>
          <!-- <span v-if="!tabIndex">新邮箱将自动注册</span> -->
        </div>
        <template v-if="tabIndex === 0">
          <el-form-item prop="email">
            <el-input v-model="ruleForm.email" autocomplete="on" :readonly="readonlyFlag" clearable @focus="readonlyFlag = false" placeholder="请输入邮箱" @input="handleEmailInput">
              <template #append>@byd.com</template>
            </el-input>

            <!-- <el-input v-model="ruleForm.email" clearable placeholder="请输入邮箱" @input="handleEmailInput"></el-input> -->
          </el-form-item>
          <el-form-item prop="check_code">
            <el-input v-model="ruleForm.check_code" clearable placeholder="请输入邮箱验证码">
              <template #append>
                <el-button class="code-btn" link :disabled="count > 0 || !canClick" @click="handleSendCode">{{ count === 0 ? '获取验证码' : `${count}s` }}</el-button>
              </template>
            </el-input>
          </el-form-item>
        </template>
        <div v-else class="pass-form">
          <el-form-item prop="email">
            <el-input v-model="ruleForm.email" autocomplete="on" :readonly="readonlyFlag" clearable @focus="readonlyFlag = false" placeholder="请输入邮箱" @input="handleEmailInput">
              <template #append>@byd.com</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" type="password" show-password clearable placeholder="请输入密码" @focus="readonlyFlag = false" @keyup.enter="submitForm(ruleFormRef)"></el-input>
          </el-form-item>
          <div class="forget-btn">
            <span @click="jumpPage(`/validateEmail`)">忘记密码？</span>
          </div>
        </div>
        <el-button class="submit-btn" :loading="submitLoading" @click="submitForm(ruleFormRef)" type="primary">登录 </el-button>
      </el-form>
      <div class="tabs">
        <span :class="{ active: tabIndex === 0 }" @click="tabIndex = 0">邮箱登录</span>
        <div></div>
        <span :class="{ active: tabIndex === 1 }" @click="tabIndex = 1">密码登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { fetchCheckCode } from '@/api/register.js'
import { useLoginStore } from '@/stores/login.js'
import { encrypt } from '@/utils/encrypt.js'

const loginStore = useLoginStore()
const ruleFormRef = ref(null)
const ruleForm = reactive({
  email: '',
  check_code: '',
  password: '',
  type: 0,
})
const count = ref(0)
const canClick = ref(false)
const isSendCode = ref(false)
const submitLoading = ref(false)
const readonlyFlag = ref(true)

// // 获取公钥
// const getKey = () => {
//   loginStore.getPublicKey()
// }

// getKey()

// 登录方式
const tabIndex = ref(Number(localStorage.getItem('tip-web-login-type') || 1))
const router = useRouter()
const jumpPage = path => {
  router.push(path)
}

watch(tabIndex, () => {
  readonlyFlag.value = true
})
// 邮箱校验
const validateEmail = (rule, value, callback) => {
  canClick.value = false
  if (!value) {
    callback(new Error('请输入邮箱'))
    return
  }
  const emailReg = /^[a-zA-Z\d\.]{4,20}$/
  if (!emailReg.test(value)) {
    callback(new Error('请输入正确的邮箱'))
    return
  }
  canClick.value = true
  callback()
}

const rules = reactive({
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  check_code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const handleEmailInput = () => {
  ruleFormRef.value.validateField('email')
}

// 倒计时
let timer = null
const handleCountDown = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (count.value > 0) {
      count.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

// 获取验证码
const handleSendCode = () => {
  isSendCode.value = true
  count.value = 59
  handleCountDown()
  fetchCheckCode(ruleForm.email + '@byd.com').then(res => {
    if (res.code !== 0) {
      clearInterval(timer)
      ElMessage({
        showClose: true,
        message: res.msg,
        type: 'error',
      })
      return
    }
  })
}
const submitForm = formEl => {
  if (!formEl) return
  submitLoading.value = true
  formEl.validate(async valid => {
    if (valid) {
      submitLoading.value = false
      const params = { ...ruleForm, email: ruleForm.email + '@byd.com' }
      // params.password = await encrypt(params.password)
      params.type = tabIndex.value
      if (tabIndex.value === 0) {
        delete params.password
      } else {
        delete params.check_code
      }

      localStorage.setItem('tip-web-login-type', tabIndex.value)
      loginStore.loginIn(params)
    } else {
      submitLoading.value = false
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  overflow: hidden;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
  }
  .logo {
    position: absolute;
    left: 30px;
    top: 30px;
    height: 60px;
    user-select: none;
  }
  .login {
    position: absolute;
    top: 50%;
    right: 11.4583%;
    width: 500px;
    height: 680px;
    background: #fff;
    box-shadow: 0 0 20px 0 rgba(164, 168, 196, 0.25);
    border-radius: 10px;
    color: #333;
    transform: translateY(-50%);
    .title {
      margin: 79px 0 60px 60px;
      line-height: 42px;
      font-size: 30px;
      font-weight: 700;
    }
    .el-form {
      width: 380px;
      margin: 0 auto;
      .subtitle {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: 36px;
        div {
          line-height: 25px;
          font-size: 18px;
          font-weight: 700;
        }
        span {
          line-height: 17px;
          font-size: 12px;
          color: #9196a6;
        }
      }
      .pass-form {
        .el-form-item {
          &:nth-child(2) {
            margin-bottom: 12px;
          }
        }
      }
      .el-form-item {
        margin-bottom: 30px;
        border-bottom: 1px solid #d3d3de;
        .el-input {
          height: 44px;
        }
        :deep(.el-input__wrapper) {
          box-shadow: none;
        }
        :deep(.el-input__wrapper.is-focus) {
          box-shadow: none;
        }
        :deep(.el-form-item__error) {
          line-height: 17px;
          margin-top: 6px;
          font-size: 12px;
          color: #f56b89;
        }
        :deep(.el-input-group__append) {
          box-shadow: none;
          background: none;
          .code-btn span {
            font-weight: 600;
          }
          .code-btn.is-disabled span {
            font-weight: normal;
          }
        }
        .code-btn {
          width: 94px;
          height: 44px;
          font-size: 14px;
          color: #0175ff;
          &:hover {
            opacity: 0.85;
          }
          &.is-disabled {
            color: #999;
          }
        }
      }
      .tips {
        line-height: 30px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #1f1f1f;
        &.disabled {
          text-indent: 10px;
          color: #aaaaaafc;
        }
      }
      .forget-btn {
        display: flex;
        justify-content: flex-end;
        span {
          line-height: 18px;
          font-size: 12px;
          color: #0175ff;
          &:hover {
            cursor: pointer;
            opacity: 0.85;
          }
        }
      }
      .submit-btn {
        width: 380px;
        height: 42px;
        margin-top: 60px;
        font-size: 14px;
        color: #fff;
        background: #0175ff;
        border-color: #0175ff;
        border-radius: 4px;
        &:hover {
          opacity: 0.85;
        }
      }
    }
    .tabs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 145px;
      margin: 121px auto;
      div {
        width: 1px;
        height: 14px;
        background: #d3d3de;
      }
      span {
        line-height: 20px;
        font-size: 14px;
        color: #333;
        &.active,
        &:hover {
          cursor: pointer;
          color: #0175ff;
        }
      }
    }
  }
}
</style>
