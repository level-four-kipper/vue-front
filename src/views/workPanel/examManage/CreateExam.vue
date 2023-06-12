<template>
  <div class="container">
    <div class="content">
      <el-form class="exam-form" :model="formExamData" :rules="examRules" ref="examForm">
        <el-form-item class="header">
          <h2>{{pageMessage.title}}</h2>
          <span class="header-right">
            <el-button class="create-submit" type="primary" @click="editOrAddExam ">{{pageMessage.btnSubmit}}</el-button>
            <el-button v-if="pageMessage.type === 'edit'" class="create-submit" type="primary" @click="publishExam">发布</el-button>
          </span>
        </el-form-item>
        <el-form-item label="试卷" prop="paperName" :label-width="formLabelWidth">
          <el-input v-model="formExamData.paperName" autocomplete="off" @click="formExamData.paperFormVisible = true" placeholder="请选择试卷" />
        </el-form-item>
        <el-form-item label="考试名称" prop="examName" :label-width="formLabelWidth">
          <el-input v-model="formExamData.examName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="考试描述" prop="explain" :label-width="formLabelWidth">
          <el-input v-model="formExamData.explain" autocomplete="off" />
        </el-form-item>
        <el-form-item label="考试时长" prop="examTime" :label-width="formLabelWidth">
          <el-input type="number" v-model="formExamData.examTime" autocomplete="off" placeholder="请输入考试时长" />
        </el-form-item>
        <el-form-item label="考试时间范围" prop="dateRange" :label-width="formLabelWidth">
          <el-date-picker v-model="formExamData.dateRange" type="datetimerange" range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="考试人员组别" prop="examGroupIds" :label-width="formLabelWidth">
          <el-select v-model="formExamData.examGroupIds" filterable placeholder="请选择">
            <el-option v-for="item in peopleGroups" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="可见性" prop="permission" :label-width="formLabelWidth">
          <el-select v-model="formExamData.permission" filterable placeholder="请选择">
            <el-option v-for="(item,index) in permissionOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class=" member-manage">
        <div class="member-header">
          <span class="member-set">成员管理:</span>
          <span class="add-btn" @click="addPeople">+ 添加成员</span>
        </div>
        <ExamPeopleTable :data="formExamData.peopleTableData" :deleteTableData="deletePeople" :updateTableData="updatePeople" />
      </div>

      <DialogSelectPaper :isVisible="formExamData.paperFormVisible" :examPaper="{id :formExamData.paperId, name:formExamData.paperName}" :updateFormExamData="updateFormExamData" />
      <DialogAddPeople v-model:isVisible="peopleFormVisible" :onConfirm="addExamPeopleRole" :roleOption="roleOption"></DialogAddPeople>
    </div>
  </div>
</template>
<script setup>
import ExamPeopleTable from './components/ExamPeopleTable.vue'
import DialogSelectPaper from './components/DialogSelectPaper.vue'
import DialogAddPeople from '@/components/DialogAddPeople.vue'
import {reactive,ref,onMounted,watch,computed} from 'vue'
import { fetchGroupData} from '@/api/examinee.js'
import {  fetchAddExam ,fetchExamDetail,fetchUpdateExam,fetchPublishExam} from '@/api/exam.js'
import { ElMessage,ElMessageBox } from 'element-plus'
import {formatDate} from '@/utils/format.js'
import {useRouter,useRoute } from "vue-router"
import _ from 'lodash'


const route = useRoute()
const router = useRouter()
const pageMessage = reactive(initPageMessage()) //页面信息 为了区分edit | add
const permissionOptions =ref([{value:1,label:'公开'},{value:0,label:'私有'}])
const roleOption = ref([{  value:1, label:'阅卷人' },  {  value:2, label:'监考人' }])
const examForm = ref(null)
const peopleFormVisible = ref(false)
const peopleGroups =  ref([])

const formExamData=reactive({
paperFormVisible:false, //试卷单选弹窗
paperName:'',
paperId:'',
examName:'',
explain:'',
dateRange:'',
examGroupIds:'',
examTime:'',
permission:'',
peopleTableData:[]
})


const examRules = reactive({
  examName:[{  required: true, message: '不能为空', trigger: 'blur'}],
  dateRange:[{  required: true, message: '请选择时间', trigger: 'change'}],
  examGroupIds:[{  required: true, message: '请选择一项', trigger: 'change '}],
  permission:[{  required: true, message: '请选择一项', trigger: 'change '}],
  paperName:[{  required: true, message: '不能为空', trigger: 'blur '}],
  })

/**
 * 方法
 */
function initPageMessage(){
  let obj = route.params.id? {
        title:'编辑考试',
        btnSubmit:'保存',
        btnDisabled:false,
        type:'edit',
        isCreated:true,
        isPublish:false
    }: {
       title:'创建考试',
        btnSubmit:'创建',
        btnDisabled:false,
        type:'add',
        isCreated:false,
        isPublish:false
    }
return obj
}



function deletePeople (people){
    formExamData.peopleTableData = formExamData.peopleTableData.filter((item) =>  !(item.userId === people.userId  && people.roleId === item.roleId)
     )
}

function updatePeople(key,value,people){
   const item = formExamData.peopleTableData.find(item =>  item.userId === people.userId )
   item[key] = value
}

function addPeople() {
 peopleFormVisible.value = true
}

//添加考试管理人员
function addExamPeopleRole(form ) {
    let validate = formExamData.peopleTableData.find(item =>  item.userId=== form.userId && item.roleId === form.roleId )
    if(validate){
      ElMessage.error('成员该角色已存在，请选择其他角色')
    }else{
       formExamData.peopleTableData.push(
      {
        userId:form.userId ,
        userName:form.userName,
        roleId:form.roleId,
        add_time:formatDate(new Date())
      })
    }

}

//exam考试表单数据更新
function updateFormExamData(keys,values){
  keys.forEach((item,index) => formExamData[item] = values[index])
}


/**
 * 请求
 */
function getGroupList(){
   fetchGroupData().then(result => {
    if(result.code ===  0){
       result.data.forEach(item => {
         peopleGroups.value.push({value:item.id,label:item.group_name})
       })
    } else{
        const type = result.code ===  0 ?'success':'error'
        result.code !==  0 &&  ElMessage({
            message:  result.msg|| result.data.error,
            type: type,
            })
    }
  })
}

//创建或者编辑考试
function  editOrAddExam(isMsg){
  console.log(examForm.value,'examForm.valu')
    examForm.value.validate((valid, fields) => {
    if (valid && examForm.value) {
    const params = {
        exam_name: formExamData.examName,
        paper_id: formExamData.paperId,
        user_group_id: formExamData.examGroupIds ,//formExamData.examGroupIds
        exam_time:formExamData.examTime,
        start_time:formatDate( formExamData.dateRange[0]),
        end_time:formatDate( formExamData.dateRange[1]),
        explain_string:formExamData.explain,
        is_open:formExamData.permission,
        role_list:formExamData.peopleTableData.map(item => { return  {user_id:item.userId ,role: item.roleId}}),
      }
     if(params.role_list.length < 1) {
        ElMessage.error( '请至少添加一个用户角色')
        return
      }else if(!params.role_list. find(item => item.role  === 1)){
        ElMessage.error( '请至少添加一个阅卷人角色')
        return
      }
      if(pageMessage.type === 'add'){
          fetchAddExam(params).then(res => {
          if(res.code === 0){
                isMsg ||  ElMessage({
                message: '创建成功',
                type: 'success',
            })
            router.push(`/workPanel/myExam`)
            }else{
          ElMessage.error( res.msg|| res.data.error)

        }
      })
      }else{
        params.exam_id = route.params.id
        fetchUpdateExam(params).then(res => {
        if(res.code === 0){
           isMsg || ElMessage({
            message:  '保存成功',
            type: 'success',
          })
           router.push(`/workPanel/myExam`)
          }else{
          ElMessage.error( res.msg|| res.data.error)
      }
    })

      }
    }
  })

  }

function  getExamDetail() {
  fetchExamDetail(route.params.id).then(res => {
        if(res.code === 0){
          formExamData.examName =res.data.exam_name
          formExamData.paperName = res.data.paper_name
          formExamData.examTime = res.data.exam_time
          formExamData.paperId = res.data.paper_id
          formExamData.dateRange =[new Date(res.data.start_time),new Date(res.data.end_time)]
          formExamData.explain = res.data.explain_string
          formExamData.examGroupIds = res.data.user_group_id
          formExamData.permission = res.data.is_open
          res.data.role_list.forEach(item =>   formExamData.peopleTableData.push({
              userId:item.exam_id,
              userName:item.user_name,
              roleId:item.role,
              add_time:item.gmt_created
          }))
          }else{
              ElMessage.error( res.msg|| res.data.error)

      }
    })
}

const  publishExam = () =>{
  if (!examForm.value) return
    examForm.value.validate( async (valid, fields) => {
    if (valid) {
    await editOrAddExam(false)
    await fetchPublishExam(route.params.id).then(
      result =>{
      if(result.code === 0   ){
         ElMessage({
        message:  '发布成功',
        type: 'success',
        })
      router.push(`/workPanel/myExam`)
      }else{
        ElMessage({
        message:  '发布失败'+ result.msg|| result.data.error,
        type: 'error',
        })
      }
    }
  )
    }
  })

}

onMounted(() => {
  getGroupList()
  route.params.id && getExamDetail()
})
</script>

<style lang="scss" scoped>
.container{
  padding: 10px 50px;
  .header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

  }
  .content {
    .exam-form{
      // width: 90%;
      .header{
        :deep(.el-form-item__content) {
          justify-content: space-between;

        }
      }
      :deep(.el-form-item__label){
      justify-content: flex-start;
      width: 120px;
      }
    }
    .people-form{
      .select-user-name{
        box-shadow:  0 0 0 1px #dcdfe6 ;
        border-radius: 4px;
        width: 100%;
        :deep(.el-input__wrapper){
           box-shadow: none;
        }
      }
    }
    .member-manage{
      padding: 10px 10px;
      .member-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .add-btn{
          cursor: pointer;
        }
      }
    }

  };


}
// Tabs标签页样式
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-input__wrapper {
  z-index: 100;
}
</style>
