<!-- 新增题库 -->
<template>
  <h1>创建题库</h1>
  <div class="container">
    <div class="form">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm" :size="formSize" status-icon label-position="top" require-asterisk-position="right" style="margin-top: 15px ">
        <el-form-item label="题库名称" prop="name">
          <el-input v-model="ruleForm.name" autosize type="textarea" class="w-50 m-2" />
        </el-form-item>
        <el-form-item label="知识领域" prop="area">
          <el-select v-model="ruleForm.area" placeholder="尚未选择">
            <el-option v-for="(item,index) in areaOptions" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可见性" prop="visibility">
          <el-select v-model="ruleForm.visibility" placeholder="尚未选择">
            <el-option v-for="(item,index) in visibilityOptions" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="ruleForm.description" :rows="5" type="textarea" placeholder="介绍一下试题库" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="题库图标" prop="questionBankIconUrl">
          <!-- <el-input v-model="ruleForm.questionBankIconUrl" autosize type="textarea" placeholder="上传题库图标" /> -->
          <div class="icon">
            <div class="icon1">
              <div class="icon2">
                <!-- :show-file-list="true"图片回显  :auto-upload="false"手动上传  list-type：文件列表的类型-->
                <div>
                  <!-- api/file/upload图片接口   on-change添加文件、上传成功和上传失败时都会被调用-->
                  <el-upload :class="{hideUpload:hideUploadEdit}" ref="upload" :headers="myHeaders" action="api/file/upload" list-type="picture-card" accept=".jpg,.png,.gif,jpeg" :file-list="filelist" :show-file-list="true" :before-upload="beforeUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="UploadImage" :auto-upload="false" :limit="1">
                    <img class="img" src="../../../assets/img/questionBank/questionBank.png" alt="logo" />
                    <span>点击左侧图标，选择并上传新图标</span>
                  </el-upload>
                  <!-- <p class="text">默认</p> -->
                </div>
                <el-dialog v-model="dialogVisible">
                  <img :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
              </div>
            </div>
          </div>
        </el-form-item>
        <div class="addQuestionBank-btn">
          <el-button type="primary" @click="create">创建</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup name="AddQuestionBank">
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchAddQuestionBank, fetchUpdateQuestionBank, fetchQuestionBankId, fetchPicture } from '@/api/qsBankManage.js'

const { proxy } = getCurrentInstance()
const dialogImageUrl = ref('') // 预览图url
const dialogVisible = ref(false) // 预览弹窗
const myHeaders = ref({ token: localStorage.getItem('tip-web-token') })
const hideUploadEdit = ref(false) // 是否隐藏上传按钮
let ruleForm = reactive({
  name: '',
  area: '',
  visibility: '',
  description: '',
  questionBankIconUrl: ''
})
const areaOptions = reactive([
  { value: 'Java', label: 'Java' },
  { value: 'C/C++', label: 'C/C++' },
  { value: 'AI', label: 'AI' },
  { value: 'Linux', label: 'Linux' },
  { value: 'Python', label: 'Python' },
  { value: 'Android', label: 'Android' }
])
const visibilityOptions = reactive([
  { value: '公开', label: '公开' },
  { value: '私有', label: '私有' }
])
const rules = reactive({
  name: [{ required: true, message: '请输入题库名称', trigger: 'blur' }],
  area: [{ required: true, message: '请选择知识领域', trigger: 'change' }],
  visibility: [{ required: true, message: '请选择可见性', trigger: 'change' }],
  description: [
    { message: '请填写题库描述', trigger: 'blur' },
    { min: 0, max: 200, message: 'Length should be 0 to 200', trigger: 'blur' }
  ],
  questionBankIconUrl: [{ message: '点击左侧图标，选择并上传新图标', trigger: 'change' }]
})
const router = useRouter()
const cancel = () => {
  router.push('/myQuestionBank?tab=1')
}
const beforeUpload = file => {
  const isLt2M = file.size / 1024 / 1024 < 2
  // 判断格式
  const types = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']
  const isJPG = types.includes(file.type)
  if (!isJPG) {
    ElMessage.error('上传图片格式不正确')
  }
  if (!isLt2M) {
    // this.$message.error('上传头像图片大小不能超过 2MB!');
    ElMessage({
      message: '上传头像图片大小不能超过 2MB!',
      type: 'error'
    })
  }
  return isJPG && isLt2M
}
//图片上传
const UploadImage = (file, filelist) => {
  console.log('filelist', filelist)
  proxy.$refs.upload.submit()
  if (file.response && file.response.code === 0) {
    ruleForm.questionBankIconUrl = file.response.data || '' // 将图片地址给到表单.
    // 大于1张隐藏
    hideUploadEdit.value = filelist.length >= 1
  } else {
    ruleForm.questionBankIconUrl = ''
  }
  console.log('ruleForm.questionBankIconUrl', ruleForm.questionBankIconUrl)
}
//移除图片
const handleRemove = (file, filelist) => {
  hideUploadEdit.value = filelist.length >= 1
  console.log('file', file, filelist)
}
//预览图片
const handlePictureCardPreview = file => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
  console.log(file)
}
//接收路由参数
const route = useRoute()
const id = route.query.idEdit //我的题库页面点击编辑按钮时传过来的题库id
// 根据传过来的id调接口获得数据
const getInfo = async () => {
  await fetchQuestionBankId(id).then(res => {
    ;(ruleForm.name = res.data.name),
      (ruleForm.area = res.data.area),
      (ruleForm.visibility = res.data.visibility),
      (ruleForm.description = res.data.description),
      (ruleForm.questionBankIconUrl = res.data.icon)
    const path = res.data.icon
    fetchPicture(path).then(res => {
      //根据后端传回来的相对路径去调接口拿到图片显示出来
      ruleForm.questionBankIconUrl = res.data
    })
    console.log('ruleForm', ruleForm)
  })
}
//创建题库
const create = async () => {
  const param = {
    name: ruleForm.name,
    area: ruleForm.area,
    visibility: ruleForm.visibility,
    description: ruleForm.description,
    icon: ruleForm.questionBankIconUrl
  }
  console.log('param', param)
  //创建题库时调的接口
  if (!ruleForm.name) {
    ElMessage({
      message: '题库名称为空',
      type: 'error'
    })
  } else if (!ruleForm.area) {
    ElMessage({
      message: '知识领域为空',
      type: 'error'
    })
  } else if (!ruleForm.visibility) {
    ElMessage({
      message: '可见性为空',
      type: 'error'
    })
  } else {
    if (id) {
      //编辑
      const param = {
        id: id,
        name: ruleForm.name,
        area: ruleForm.area,
        visibility: ruleForm.visibility,
        description: ruleForm.description,
        icon: ruleForm.questionBankIconUrl
      }
      await fetchUpdateQuestionBank(param).then(res => {
        if (res.code === 0) {
          // ruleForm = res.data
          ElMessage({
            message: '题库更新成功',
            type: 'success'
          })
          router.push({
            path: '/clickQuestionBank',
            query: { questionBankId: id } //传当前更新的题库id至ClickQuestionBank页面
          })
        } else {
          ElMessage({
            message: '题库更新失败',
            type: 'error'
          })
        }
      })
    } else {
      //新增
      await fetchAddQuestionBank(param).then(res => {
        if (res.code === 0) {
          ElMessage({
            message: '题库创建成功',
            type: 'success'
          })
          router.push({
            path: '/clickQuestionBank',
            query: { questionBankId: res.data.id } //传当前创建的题库id至ClickQuestionBank页面
          })
        } else {
          // alert('请完善题库信息')
          ElMessage({
            message: '题库创建失败',
            type: 'error'
          })
        }
      })
    }
  }
}

onMounted(() => {
  if (id) {
    getInfo()
  }
})
</script>
<style lang="scss" scoped>
h1 {
  margin-left: 100px;
  color: black;
  font-size: large;
  font-weight: 600;
  margin-top: 20px;
}
.container {
  background: hsl(0, 0%, 95%);
  .form {
    margin-left: 100px;
    :deep(.el-form) {
      .el-form-item__content {
        width: 13%;
      }
    }
    .icon {
      // display: flex;
      .icon1 {
        margin-top: 10px;
      }
      .icon2 {
        display: flex;
        .img {
          width: 40px;
          margin-right: 15px;
          margin-bottom: 0px;
        }
      }
      .text {
        margin-top: 0px;
        margin-left: 6px;
        text-align: center;
      }
    }
  }
  .hideUpload {
    :deep(.el-upload.el-upload--picture-card) {
      display: none;
    }
  }
}
</style>
