<!-- 新增题库 -->
<template>
  <h1>{{pageMessage.title}}</h1>
  <div class="container">
    <el-form ref="qsBankForm" :model="qsBankFormData" :rules="rules" label-width="140px" class="test-form" :size="formSize" label-position="top" require-asterisk-position="right" style="margin-top: 15px ">
      <el-form-item label="题库名称" prop="name">
        <el-input v-model="qsBankFormData.name" autosize type="textarea" class="w-50 m-2" />
      </el-form-item>
      <el-form-item label="知识领域" prop="area">
        <el-select v-model="qsBankFormData.area" placeholder="尚未选择">
          <el-option v-for="(item,index) in areaList" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可见性" prop="visibility">
        <el-select v-model="qsBankFormData.visibility" placeholder="尚未选择">
          <el-option v-for="(item,index) in visibilityOptions" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="qsBankFormData.description" :rows="5" type="textarea" placeholder="介绍一下试题库" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="题库图标" prop="icon">
        <div class="icon-container">
          <el-upload class="icon-uploader" :http-request="handleHttpRequest" :show-file-list="false" :before-upload="handleBeforeUpload">
            <slot>
              <img class="qs-bank-icon" v-if="qsBankFormData.icon" :src="qsBankFormData.icon" alt="题库icon" />
              <img v-else class="qs-bank-icon" src="@/assets/img/questionBank/questionBank.png" alt="题库icon" />
            </slot>
          </el-upload>
          <!-- <el-dialog v-model="dialogVisible">
            <img :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog> -->
        </div>
      </el-form-item>
      <div class="addQuestionBank-btn">
        <el-button type="primary" @click="addOrEditQsBank">{{pageMessage.btnSubmit}}</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted,computed  } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchAddQuestionBank,fetchUpdateQuestionBank ,fetchQuestionBankId} from '@/api/qsBankManage.js'
import {  fetchAreaList} from '@/api/qsBankManage.js'
import { fetchUpload } from '@/api/uploadImage.js'

const route = useRoute()
const router = useRouter()
const qsBankForm = ref(null)
const pageMessage = reactive(initPageMessage()) //页面信息 为了区分edit | add
const qsBankFormData = reactive({
  name: '',
  area: '',
  visibility:1,
  description: '',
  icon: '',
})
const visibilityOptions = ref([
  { value: 1, label: '公开' },
  { value: 2, label: '私有' }
])
const areaList = ref([])
const rules = reactive({
  name: [{ required: true, message: '请输入题库名称', trigger: 'blur' }],
  area: [{ required: true, message: '请选择知识领域', trigger: 'change' }],
  visibility: [{ required: true, message: '请选择可见性', trigger: 'change' }],
  description: [
    { message: '请填写题库描述', trigger: 'blur' },
    { min: 0, max: 200, message: 'Length should be 0 to 200', trigger: 'blur' }
  ],
  icon: [{ message: '点击左侧图标，选择并上传新图标', trigger: 'change' }]
})



/**
 * 方法
 */
const cancel = () => {
  router.push('/workPanel/myQuestionBank')
}
function initPageMessage(){
  let obj = route.params.id? {
        title:'编辑题库',
        btnSubmit:'保存',
        type:'edit',
    }: {
        title:'创建题库',
        btnSubmit:'创建',
        type:'add',
    }
return obj
}


// 校验图片格式、大小
const handleBeforeUpload = rawFile => {
  const imageType = ['image/jpeg', 'image/png', 'image/jpg']
  if (!imageType.includes(rawFile.type)) {
    ElMessage.error('请上传jpg、png图片!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能超过 2MB!')
    return false
  }
  return true
}

// 上传事件
const handleHttpRequest = options => {
  // console.log(options,'handleHttpRequest')
  const formData = new FormData()
  formData.append('file', options.file)
  fetchUpload(formData).then(res => {
    if (res.code === 0 && res.data ) {
      qsBankFormData.icon= res.data
    }else{
      ElMessage.error('上传失败!')
    }
  })
}


/**
 * 请求
 */
function addOrEditQsBank(){
    const param = {
        name: qsBankFormData.name,
        area: qsBankFormData.area,
        visibility: qsBankFormData.visibility,
        description: qsBankFormData.description,
        icon: qsBankFormData.icon
      }
    qsBankForm.value.validate((valid, fields) => {
      if(valid && qsBankForm.value)
      {
        if (route.params.id) {
      //编辑
      param.id = route.params.id
      fetchUpdateQuestionBank(param).then(res => {
          if (res.code === 0) {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })
            router.push( '/workPanel/myQuestionBank')
          } else {
            ElMessage.error(   res.msg || res.data.error)

          }
        })
      } else {
        //新增
        fetchAddQuestionBank(param).then(res => {
          if (res.code === 0) {
            ElMessage({
              message: '创建成功',
              type: 'success'
            })
            router.push( './myQuestionBank')
          } else {
            ElMessage({
              message:  res.msg || res.data.error,
              type: 'error'
            })
          }
        })
      }
      }
   })

}
const getQsBankInfo =  () => {
  fetchQuestionBankId(route.params.id).then(res => {
    if(res.data && res.code === 0){
        qsBankFormData.name = res.data.name,
        qsBankFormData.area = res.data.area
        qsBankFormData.visibility = res.data.visibility,
        qsBankFormData.description = res.data.description
        qsBankFormData.icon = res.data.icon

    }else{
            ElMessage.error(   res.msg || res.data.error)

    }
  })
}
function getAreaList (){
fetchAreaList().then(res => {
  if(res.code === 0 && res.data){
   areaList.value= res.data.map(item => { return {value:item,label:item}})
  }else{
     ElMessage.error(   res.msg || res.data.error)
  }
  })
}

onMounted(() => {
  getAreaList()
   route.params.id && getQsBankInfo()
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
  margin-left: 100px;
  :deep(.el-form) {
    .el-form-item__content {
      width: 200px;
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
  .test-form {
    width: 600px;
  }

  .icon-uploader {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    height: 120px;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
    }
    .qs-bank-icon {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
