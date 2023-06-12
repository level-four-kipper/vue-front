<template>
  <div class="container">
    <div class="header">
      <h2>我的考试</h2>
      <el-button type="primary" @click="AddExam">创建考试</el-button>
    </div>
    <div class="tabs-right">
      <el-button class="btn-sure" type="primary" @click="deleteBatchExam">批量删除</el-button>
      <el-input class="input-search" placeholder="请输入试题关键字" v-model="searchName" @keydown="searchExam" clearable>
        <el-icon><search /></el-icon>
      </el-input>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" class="exam-tabs">
        <el-tab-pane label="全部" name="1">
          <ExamTable :loading="loading" :data="tableData" :deleteExam="deleteExam" :setSelectExamIds="setSelectExamIds" :publishExam="publishExam" />
        </el-tab-pane>
        <el-tab-pane label="由我创建" name="2">
          <ExamTable :loading="loading" :data="tableData" :deleteExam="deleteExam" :setSelectExamIds="setSelectExamIds" :publishExam="publishExam" />
        </el-tab-pane>
        <el-tab-pane label="我监考的" name="3">
          <ExamTable :loading="loading" :data="tableData" :deleteExam="deleteExam" :setSelectExamIds="setSelectExamIds" :publishExam="publishExam" />
        </el-tab-pane>
        <el-tab-pane label="由我阅卷的" name="4">
          <ExamTable :loading="loading" :data="tableData" :deleteExam="deleteExam" :setSelectExamIds="setSelectExamIds" :publishExam="publishExam" />
        </el-tab-pane>
        <el-tab-pane label="由我考试" name="5">
          <ExamTable :loading="loading" :data="tableData" :deleteExam="deleteExam" :setSelectExamIds="setSelectExamIds" :publishExam="publishExam" />
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        v-model:current-page="pagination.curPage "
        v-model:page-size="pagination.curPageSize"
        :page-sizes="[10, 20, 30, 40]"
        :small="small"
        layout="total, sizes, prev, pager, next "
        :total="pagination.total"
      />
    </div>
  </div>
</template>
<script setup>
import ExamTable from './components/ExamTable.vue'
import {fetchExamAll,fetchDeleteExam,fetchDeleteBatchExam,fetchPublishExam} from '@/api/exam.js'
import {reactive,ref,onMounted,watch} from 'vue'
import { useRouter} from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const activeName = ref('1')
const searchName = ref('')
const  selectExamIds = ref([])
const tableData  =ref([])
const pagination = reactive(
  {
      curPageSize:10,
      curPage:1,
      total:0,
  })


watch( [activeName,()=> pagination.curPageSize,()=>pagination.curPage] ,(newVal,oldVal )=>{
   getExamList()
   if(newVal[0]  !== oldVal[0]){
    pagination.curPageSize = 10
    pagination. curPage = 1
    pagination.total = 0
   }
} )


function searchExam(e) {
 e.keyCode === 13 && getExamList()
}
function setSelectExamIds(ids) {
selectExamIds.value = ids
}
function AddExam() {
router.push(`/workPanel/createExam`)
}

//请求
function getExamList( ){
  loading.value = true
  const params = {
    page_size:pagination.curPageSize ,
    curr_page:pagination.curPage ,
    entity:{
        condition: activeName.value,
        exam_name:searchName.value,
    }
  }
  fetchExamAll(  params  ).then( result => {
      loading.value = false
      if(result.code === 0 && result.data){
         pagination.total  = result.data.total_count
        tableData.value = result.data.list.map(item =>  {
          return {
            id:item.id,
            name:item.exam_name,
            state:item.state ? '已考完':'未考完',
            createTime:item.gmt_created,
            publish:item.publish
          }
      })

      }else{
           tableData.value = []
           ElMessage({
            message: result.msg ||  result.data.error,
            type: 'error',
        })
      }
  })

}

function deleteExam(exam) {
  if(exam.publish ){
   ElMessage({
    message: '考试已发布，不允许删除',
    type: 'warning',
    })
  }else{
    ElMessageBox.confirm(
    '确定删除当前考试吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      fetchDeleteExam(exam.id).then(
      result =>{
      if(result.code === 0   ){
        getExamList()
         ElMessage({
        message:  '删除成功',
        type: 'success',
        })
      }else{
        ElMessage({
        message:  result.msg || result.data.error ,
        type: 'error',
        })
      }
    }
  )
  })


  }

}

function deleteBatchExam(){
  const params = selectExamIds.value
    selectExamIds.value.length >0  && ElMessageBox.confirm(
    '确定批量删除选中的考试吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() =>{
      fetchDeleteBatchExam(params).then(
      result =>{
      if(result.code === 0   ){
         ElMessage({
        message:  '批量删除成功',
        type: 'success',
        })
      }else{
        ElMessage({
        message:  result.msg+',不允许删除' || result.data.error ,
        type: 'error',
        })
      }
    }
  )

  })

}

function publishExam(id){
   fetchPublishExam(id).then(
      result =>{
      if(result.code === 0   ){
        getExamList()
        tableData.value.find(item => item.id=== id && (item.publish= 1))
         ElMessage({
        message:  '发布成功',
        type: 'success',
        })
      }else{
        ElMessage({
        message:  '发布失败',
        type: 'error',
        })
      }
    }
  )

}


onMounted(() => {
  getExamList( );
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
  .tabs-right{
    z-index: 100;
    float: right;
    position: absolute;
    right: 50px;
    display: flex;
    justify-content: space-between;
  .check-batch{
    padding: 0 10px;
  }
  .btn-sure{
    margin: 0 10px;

  }
  .input-search{
      width: 300px;
      box-sizing: border-box;
      vertical-align: middle;
      z-index: 100;
      cursor: pointer;
  }

  }
  .tabs{
    .el-tabs__nav-scroll{
        .el-tabs__item{
          .is-active{
           color: #06f;

        }
      }
    }
  }
  .btn{
    margin: 30px 30px 30px;
  }
}
// Tabs标签页样式
.exam-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
