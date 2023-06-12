<template>
  <div class="setting">
    <div class="tab">
      <div class="tab-cell" v-for="(item, index) in list" :key="index">
        <span :class="{active: tabIndex === index}" @click="handleTabClick(index)">{{item.label}}</span>
        <el-divider v-show="tabIndex === index" class="tab-active-bottom" />
      </div>
    </div>
    <div class="userInfo" v-show="tabIndex === 0">
      <el-form :model="userInfoForm" :rules="userInfoRules" ref="userInfoRef" label-width="80px" class="userInfoForm">
        <el-form-item label="昵称" prop="username">
          <el-input v-model="userInfoForm.username" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="userInfoForm.intro" placeholder="请输入简介"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-form-item prop="birthday">
            <el-date-picker type="date" placeholder="请选择日期" v-model="userInfoForm.birthday" style="width: 100%;" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="工作岗位" prop="post">
          <el-input v-model="userInfoForm.post" placeholder="请输入工作岗位"></el-input>
        </el-form-item>
        <el-form-item label="办公地点" prop="office_space">
          <el-select v-model="userInfoForm.office_space" placeholder="请选择办公地点">
            <el-option label="深圳-坪山" value="深圳-坪山"></el-option>
            <el-option label="深圳-宝龙" value="深圳-宝龙"></el-option>
            <el-option label="惠州-大亚湾" value="惠州-大亚湾"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfoForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="employee_number">
          <el-input v-model="userInfoForm.employee_number" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="userInfoForm.department" disabled></el-input>
        </el-form-item>
        <el-form-item label="科室" prop="office">
          <el-input v-model="userInfoForm.office" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('userInfoForm')">保存修改</el-button>
        </el-form-item>
        <el-upload class="upload" accept=".jpg,.png,.gif,jpeg" action="/api/file/upload" list-type="picture-card" :headers="token" :show-file-list="false" :before-upload="beforeUpload" :on-success="setIconImage" :on-change="UploadImage" :on-error="uploadError">
          <div class="showImage">
            <img v-if="userInfoForm.img_url" :src="userInfoForm.img_url" />
            <img v-else src="@/assets/img/index/g-avatar.png" alt="头像" />
            <el-button type="primary" small>修改头像</el-button>
          </div>
        </el-upload>
      </el-form>
    </div>

    <div class="account" v-show="tabIndex === 1">
      <div class="row">
        <span class="label"> 账号邮箱：</span>
        <div class="validate">{{userInfoForm.email}}</div>
        <!-- <el-button type="primary" @click="openEmailDialog()">修改</el-button>
        <UpdateEmail v-if="userInfoForm.email" v-model:updateVisible="emailVisible" :userInfo="userInfoForm" :steps="emailSteps" title="邮箱" /> -->
      </div>
      <div class="row">
        <span class="label"> 登录密码：</span>
        <div class="validate">密码要求至少包含字母，符号或数字中的两项且长度超过8位</div>
        <el-button type="primary" @click="openDialog()">修改</el-button>
        <UpdatePassword v-if="userInfoForm.email" v-model:updatePasswordVisible="dialogVisible" :userInfo="userInfoForm" :id="id" />
      </div>
    </div>
  </div>
</template>

<script setup name="Setting">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useLoginStore } from '@/stores/login.js'
import { fetchUserDetail, updateUserInfo } from '@/api/authorSpace.js'
// import UpdateEmail from '../../personalCenter/components/UpdateEmail.vue'
import UpdatePassword from '../../personalCenter/components/UpdatePassword.vue'
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['updateUser'])

const loginStore = useLoginStore()
const { id } = storeToRefs(loginStore)
const token = ref({ token: localStorage.getItem('tip-web-token') })
const dialogVisible = ref(false)
const emailVisible = ref(false)
const userInfoForm = ref({
  username: '',
  intro: '',
  birthday: '',
  email: '',
  post: '',
  department: '',
  img_url: '',
  office:''
})
const userInfoRef = ref();

const tabIndex = ref(0)

const list = ref([
  { label: '个人信息', value: 0 },
  { label: '账户安全', value: 1 }
])
const userInfoRules = {
  username: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
}
const handleTabClick = value => {
  tabIndex.value = value
}

const emailSteps = ref([{ name: '邮箱修改', value: 0 },
{ name: '账号验证', value: 1 },
{ name: '修改成功', value: 2 }])
const openDialog = () => {
  dialogVisible.value = true
}
const openEmailDialog = () => {
  emailVisible.value = true
}
const setIconImage = res => {
  console.log('setIconImage-------', res)
  if (res.code !== 0) {
    ElMessage.error(res.msg || res.data.error)
  } else {
    userInfoForm.value.img_url = res.data
  }
}
const UploadImage = res => {
  console.log('UploadImage-------', res)
}
const beforeUpload = file => {
  console.log('beforeUpload-------', file)
  const limit = file.size / 1024 / 1024 < 2
  if (!limit) {
    ElMessage.error('上传的图片大小不能超过2MB')
  }
  return limit
}

const uploadError = res => {
  console.log('uploadError-------', res)
  ElMessage.error(res.msg || res.data.error)
}

// 用户信息
const getUser = () => {
  fetchUserDetail(id.value).then(res => {
    if (res.code === 0) {
      userInfoForm.value = { ...res.data }
    }
  })
}

const updateUser = () => {
  userInfoRef.value.validate(valid => {
    if (valid) {
      const param = { ...userInfoForm.value, id: id.value }
      updateUserInfo(param).then(res => {
        if (res.code === 0) {
          ElMessage({ message: '保存成功', type: 'success' })
          getUser()
          loginStore.getUserInfo()
          emit('updateUser')
        } else {
          ElMessage.error(res.msg || res.data.error)
        }
      })
    }
  })
}

const submitForm = () => {
  updateUser()
}

onMounted(async () => {
  if (id.value) {
    getUser()
  }
})
defineExpose({})
</script>
<style lang="scss" scoped>
.setting {
  .tab {
    justify-content: center;
    background-color: #ffffff;
    border-radius: 4px;
    margin-left: 20px;
    line-height: 54px;
    height: 54px;
    width: 100%;
    .tab-cell {
      font-size: 16px;
      display: inline-flex;
      padding: 0 20px;
      span {
        &.active {
          font-weight: 600;
          color: #0175ff;
          cursor: pointer;
        }
      }
      .tab-active-bottom {
        left: 44px;
        bottom: -24px;
        border-top: 3px #0175ff var(--el-border-style);
        position: absolute;
        width: 20px;
      }
    }
  }
  .userInfo,
  .account {
    border-radius: 4px;
    background-color: #ffffff;
    margin: 20px 0 0 20px;
    width: 100%;
    padding: 20px;
    :deep(.el-form) {
      width: 100%;
      .el-form-item {
        width: 67%;
      }
      .el-form-item__label {
        color: #9196a6;
        font-size: 14px;
      }
      .el-form-item__content .el-form-item {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
    .upload {
      position: absolute;
      right: 8%;
      top: 25px;
      :deep(.el-upload) {
        border: none;
        background-color: #ffffff;
        .showImage {
          text-align: center;
        }
        img {
          width: 88px;
          height: 88px;
          border-radius: 50%;
        }
      }
    }
    .row {
      margin-bottom: 10px;
    }
    .label {
      color: #9196a6;
      font-size: 14px;
      margin-right: 12px;
      line-height: 32px;
    }
    .validate {
      display: inline-block;
      margin-right: 55px;
      line-height: 32px;
      min-width: 400px;
    }
  }
}
</style>
