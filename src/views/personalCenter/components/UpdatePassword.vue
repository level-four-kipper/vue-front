<template>
  <div>
    <el-dialog v-model="dialogVisible" title="修改密码" center @close="closeDialog" :close-on-click-modal="false">
      <div class="updatePassword">
        <div class="steps">
          <div class="step">
            <div :class="[ 'step-title', activeIndex >= 0 ? 'activeColor' : '']">密码修改</div>
            <div class="step-process">
              <div :class="[ 'circle', activeIndex >= 0 ? 'activeBack' : '']" ></div>
              <el-divider :class="[ 'divider', activeIndex > 0 ? 'activeDivider' : '']"></el-divider>
            </div>
          </div>
          <div class="step">
            <div :class="[ 'step-title', activeIndex >= 1 ? 'activeColor' : '']">账号验证</div>
            <div class="step-process">
              <div :class="[ 'circle', activeIndex >= 1 ? 'activeBack' : '']"></div>
              <el-divider :class="[ 'divider', activeIndex > 1 ? 'activeDivider' : '']"></el-divider>
            </div>
          </div>
          <div class="step">
            <div :class="[ 'step-title', activeIndex >=2 ? 'activeColor' : '']">修改成功</div>
            <div class="step-process">
              <div :class="[ 'circle', activeIndex >= 2 ? 'activeBack' : '']"></div>
            </div>
          </div>
        </div>

        <div class="updatePasswordForm" v-show="activeIndex === 0">
          <el-form ref="updatePasswordFormRef" :model="updatePasswordForm" :rules="updatePasswordFormRules" label-position="right" label-width="100px">
            <el-form-item label="原密码" prop="password">
              <el-input type="password" v-model="updatePasswordForm.password" placeholder="请输入原密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_password">
              <el-input type="password" v-model="updatePasswordForm.new_password" placeholder="请输入新密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirm_password">
              <el-input type="password" v-model="updatePasswordForm.confirm_password" placeholder="请确认新密码" show-password></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="validateEmail" v-show="activeIndex === 1">
          <div>已向您的邮箱 {{userInfo.email }} 发送验证码，请前往邮箱查收。</div>
          <div class="email">验证码<el-input v-model="check_code" placeholder="请输入邮箱验证码"></el-input></div>
        </div>

        <div class="success" v-show="activeIndex === 2">
          <img src="@/assets/img/authorPhoto/success.png" alt="成功" />
          <div class="successMessage">密码修改成功</div>
        </div>
        <div class="actionButton">
          <el-button v-if="activeIndex === 0" type="primary" @click="next"> 下一步 </el-button>
          <el-button v-if="activeIndex === 1" type="primary" @click="submit"> 提交 </el-button>
          <el-button v-if="activeIndex === 2" type="primary" @click="login"> 重新登陆 </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="UpdatePassword">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updatePassword, verityPassword } from '@/api/authorSpace.js'
import { fetchCheckCode } from '@/api/register.js'
import { encrypt } from '@/utils/encrypt.js'
import { useLoginStore } from '@/stores/login.js'

const loginStore = useLoginStore()
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
  id: {
    type: String,
    default: () => ''
  },
  userInfo: {
    type: Object,
    default: () => {}
  },
  updatePasswordVisible: {
    type: Boolean,
    default: () => false
  },
})

const emit = defineEmits(['update:updatePasswordVisible'])

const activeIndex = ref(0)
const dialogVisible = ref(false)
watch(
  () => props.updatePasswordVisible,
  newVal => {
    dialogVisible.value = newVal
    activeIndex.value = 0
  },
  {
    immediate: true,
    deep: true
  }
)
const updatePasswordFormRef = ref()
const updatePasswordForm = ref({
  password: '',
  new_password: '',
  confirm_password: '',
})
const check_code = ref('')

const pattern = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im; // 包含特殊字符返回false
const stringReg = new RegExp(/^(?=.*?[a-zA-Z])/) // 至少一个字母
const numberReg = new RegExp(/^(?=.*?[0-9])/) // 至少一个数字
const validatePassword = (rules, value, callback) => {
  if (value == null || value === '') {
    callback(new Error('请输入原密码'));
  } else {
    callback();
  }
};
let validateNewPassword = (rules, value, callback) => {
  if (value == null || value === '') {
    callback(new Error('请输入新密码'));
  } else if (value.length < 8) {
    callback(new Error('密码要求长度超过8位'));
  } else {
    if((stringReg.test(value) && numberReg.test(value)) || ((stringReg.test(value) || numberReg.test(value)) && pattern.test(value))){
      callback();
    } else {
      callback(new Error('密码要求至少包含字母，符号或数字中的两项'));
    }
  }
};
let validateRepressPassword = (rules, value, callback) => {
  if (value == null || value === '') {
    callback(new Error('请确认新密码'));
  } else if (value.length < 8) {
    callback(new Error('密码要求长度超过8位'));
  } else {
    if (value !== updatePasswordForm.value.new_password) {
      callback(new Error('两次密码输入不一致'));
    } else if((stringReg.test(value) && numberReg.test(value)) || ((stringReg.test(value) || numberReg.test(value)) && pattern.test(value))){
      callback();
    } else {
      callback(new Error('密码要求至少包含字母，符号或数字中的两项'));
    }
  }
};

const updatePasswordFormRules = {
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  new_password: [{ required: true, validator: validateNewPassword, trigger: 'blur' }],
  confirm_password: [{ required: true, validator: validateRepressPassword, trigger: 'blur' }],
}

const next = () => {
  updatePasswordFormRef.value.validate(valid => {
    if (valid ) {
      verityPassword(updatePasswordForm.value.password).then(res => {
        if(res.data){
          activeIndex.value = 1 
          fetchCheckCode(props.userInfo.email).then(res => {
            if(res.code === 0){
              ElMessage({ message:  '验证码发送成功', type: 'success'})
            } else {
              ElMessage.error( res.msg|| res.data.error)
            }
          })  
        } else {
          ElMessage.error( `原密码错误！`)
        }
      })
      
    }
  })
}

const submit = async () => {
  const params = { ...updatePasswordForm.value, check_code: check_code.value, id: props.id, email: props.userInfo.email}
  // params.password = await encrypt(params.password)
  // params.new_password = await encrypt(params.new_password)
  // params.confirm_password = await encrypt(params.confirm_password)
  updatePassword(params).then(res => {
    if(res.code === 0){
      activeIndex.value = 2
      ElMessage({ message:  '密码修改成功', type: 'success'})
    } else {
      ElMessage.error( res.msg|| res.data.error)
    }
  })
}

const closeDialog = () => {
  check_code.value = ''
  updatePasswordFormRef.value?.resetFields()
  emit('update:updatePasswordVisible', false)
}

const login = () => {
  loginStore.loginOut()
}

onMounted(async () => {
})
defineExpose({
})
</script>
<style lang="scss" scoped>
:deep(.el-dialog__header){
  border-bottom: 1px solid #E3E3ED;
  margin-right: 0px
}
.updatePassword {
  padding: 40px 10px;
  .steps{
    display: flex;
    font-size: 16px;
    color: #333333;
    .step {
      flex: 1;
      text-align: center;
      .step-process{
        display: block;
        .circle{
          background-color: #9196A6;
          border-radius: 50%;
          margin: 10px 5px 40px 50%;
          height: 7px;
          width: 7px;
        }
        .divider{
          top: -21px;
          left: 54%;
          width: 94%;
          position: absolute;
        }
        .activeBack{
          background-color: #0175FF;
        }
        .activeDivider{
          border-top: 2px #0175FF var(--el-border-style);
        }
      }
      .activeColor{
        color: #0175FF;
      }
    }
  }
  :deep(.el-form) {
    .el-form-item {
      margin: 20px auto;
    }
  }
  .validateEmail, .success{
    text-align: center;
    :deep(.el-input){
      width: 360px;
      margin-left: 20px;
    }
    .email{
      margin: 20px 0 80px 0;
    }
    img{
      height: 64px;
      width: 64px;
    }
    .successMessage{
      margin: 15px 0 65px 0;
    }
  }
  .actionButton {
    text-align: center;
    :deep(.el-button){
      width: 200px;
    }
  }
}
</style>
