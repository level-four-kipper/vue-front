<template>
  <div class="common-layout">
    <el-container class="m-container">
      <el-header class="m-header"><Header></Header></el-header>
      <el-container class="m-container-cnt">
        <el-main class="m-content">
          <div class="container" v-show="isshow">
            <div style="font-size:14px;font-weight:700">欢迎注册！</div>
            <div class="form">
              <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm" status-icon label-position="left">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="ruleForm.name" />
                </el-form-item>
                <el-form-item label="工号" prop="employeeNumber">
                  <el-input v-model.number="ruleForm.employeeNumber" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="ruleForm.email" />
                </el-form-item>
                <el-form-item label="部门" prop="department">
                  <el-select v-model="ruleForm.department" placeholder="选择部门" class="department">
                    <el-option label="弗迪科技-技术平台部-平台开发一科" value="弗迪科技-技术平台部-平台开发一科" />
                    <el-option label="弗迪科技-技术平台部-平台开发二科" value="弗迪科技-技术平台部-平台开发二科" />
                    <el-option label="弗迪科技-技术平台部-平台开发三科" value="弗迪科技-技术平台部-平台开发三科" />
                  </el-select>
                </el-form-item>
                <el-form-item label="岗位" prop="post">
                  <el-input v-model="ruleForm.post" />
                </el-form-item>
                <el-form-item label="验证码" prop="verificationCode" class="verificationCode">
                  <el-input v-model="ruleForm.verificationCode" />
                  <el-button class="sendButton" type="primary" @click="send" :disabled="sendButtonDisabled ">{{sendLabel}}</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="register(ruleFormRef)" class="registerButton" :disabled="registerButtonDisabled">注册</el-button>
                  <el-button @click="tologin()" class="loginButton">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div v-show="!isshow" class="inform">
            <div>您已完成注册，请等待后台审核，审核通过后将会以邮件通知您！</div>
            <button @click="confirm()">确定</button>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { getCurrentInstance, onMounted, reactive, ref, toRefs, watch } from 'vue'
//import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { fetchCheckCode, fetchRegister } from '@/api/register.js'
import { ElMessage } from 'element-plus'
//import { resultProps } from 'element-plus'

const ruleFormRef = ref()
const instance = getCurrentInstance()
let sendButtonDisabled = ref(true)
const ruleForm = reactive({
  name: '',
  department: '',
  email: '',
  post: '',
  verificationCode: '',
  employeeNumber: ''
})
const router = useRouter()
//验证码规则
const checkVerificationCode = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入验证码'))
  }
  setTimeout(() => {
    if (!(value.length == 5)) {
      callback(new Error('验证码为5位数字'))
    } else {
      return callback()
    }
  }, 100)
}
const rules = reactive({
  verificationCode: [{ validator: checkVerificationCode, trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  employeeNumber: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { type: 'number', message: '工号为数字' }
  ],
  email: { required: true, message: '请输入邮箱', trigger: 'blur' },
  post: { required: true, message: '请输入岗位', trigger: 'blur' },
  department: { required: true, message: '请选择部门', trigger: 'change' }
})
//邮箱校验通过，isSend为true，可以发送
watch(
  () => ruleForm.email,
  (newVal, oldVal) => {
    if (newVal.length === 0) {
      sendButtonDisabled.value = true
    } else {
      sendButtonDisabled.value = false
    }
  },
  { deep: true }
)
const sendLabel = ref('发送')
function send() {
  fetchCheckCode(ruleForm.email).then(result => {
    console.log(result.data, '发验证码')
  })
  sendButtonDisabled.value = true
  sendLabel.value = 30
  const timer = setInterval(() => {
    if (sendLabel.value > 0 && sendLabel.value <= 30) {
      console.log('send')
      sendLabel.value--
    } else {
      clearInterval(timer)
      sendLabel.value = '发送'
      sendButtonDisabled.value = false
    }
  }, 1000)
}
//注册
//let registerButtonDisabled=ref(false)
let isshow = ref(true)
const register = formEl => {
  if (!formEl) return false
  formEl.validate(valid => {
    if (valid) {
      fetchRegister({
        name: ruleForm.name,
        employee_number: ruleForm.employeeNumber + '',
        email: ruleForm.email,
        department: ruleForm.department,
        post: ruleForm.post,
        check_code: ruleForm.verificationCode + ''
      }).then(result => {
        console.log(result, 'result')
        if (result.code === 0) {
          isshow.value = !isshow.value
          // }else if(result.code===-15006){
          //   ElMessage({
          //       showClose: true,
          //       message: result.msg,
          //       type:'error'
          //     }) //用户存在
        } else {
          ElMessage({
            showClose: true,
            // message: '验证码错误，请重新发验证码',
            message: result.msg,
            type: 'error'
          }) //验证码错误或者验证码失效
        }
      })
      //console.log('submit!')
      //return
      // } else {
      //       ElMessage({
      //           showClose: true,
      //           message: result.msg,
      //           type:'error'
      //         })
      //   return false
    }
  })
}
function tologin() {
  router.push({ path: '/login' })
}
function confirm() {
  router.push({ path: '/login' })
}
</script>
<style scoped lang="scss">
.m-header {
  padding: 0;
}
.container {
  width: 500px;
  margin: 100px auto;
  font-family: 'Arial Normal', 'Arial', sans-serif;
  .form {
    width: 478px;
    height: 450px;
    margin: 15px 0;
    color: pink;
    border: 1px solid rgb(222, 222, 222, 1);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 30px;
  }
}
.verificationCode {
  .el-form-item__content {
    .el-input {
      width: 217px;
      height: 30px;
      margin-right: 20px;
    }
  }
}
.el-input {
  width: 300px;
  height: 30px;
}
.el-button {
  width: 64px;
  height: 30px;
  font-size: 12px;
  border-style: none;
}
.registerButton {
  margin-right: 160px;
  background-color: #0066fffc;
}
.loginButton {
  background-color: white;
  color: #0066fffc;
  &:hover {
    background-color: white;
  }
}
.sendButton {
  background-color: #0066fffc;
}

.department {
  width: 300px;
}
.inform {
  width: 1572px;
  height: 700px;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  div {
    font-size: 14px;
    margin: 40px auto;
  }
  button {
    width: 44px;
    height: 30px;
    font-size: 12px;
    margin: 20px auto;
    color: white;
    background-color: #0066fffc;
    border-style: none;
    cursor: pointer;
  }
}
</style>
