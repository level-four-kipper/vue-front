<!-- 我的题目页面-->
<template>
  <div class="container">
    <div class="header">
      <h2 class="my-test">我的题目</h2>
      <el-button type="primary" @click="addQuestion">添加题目</el-button>
    </div>

    <div class="tabs">
      <div class="search">
        <el-input placeholder="请输入试题题干关键字" v-model="searchName" @keydown="searchQsBank" clearable>
          <template #prefix>
            <el-icon @click="search" class="el-input__icon">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
      <!-- tab-click tab被选中时触发    tab-change	activeName改变时触发 -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" @tab-change="tabChange">
        <el-tab-pane label="全部" name="3">
          <TestTable :tableData="tableData" :loading="loading" :deleteQuestion="deleteQuestion" />
        </el-tab-pane>
        <el-tab-pane label="审核中" name="2">
          <TestTable :tableData="tableData" :loading="loading" :deleteQuestion="deleteQuestion" />
        </el-tab-pane>
        <el-tab-pane label="已通过" name="1">
          <TestTable :tableData="tableData" :loading="loading" :deleteQuestion="deleteQuestion" />
        </el-tab-pane>
        <el-tab-pane label="已拒绝" name="0">
          <TestTable :tableData="tableData" :loading="loading" :deleteQuestion="deleteQuestion" />
        </el-tab-pane>
      </el-tabs>
      <el-pagination v-model:current-page="pagination.curPage " v-model:page-size="pagination.curPageSize" :page-sizes="[10, 20, 30, 40]" :small="small" layout="total, sizes, prev, pager, next " :total="pagination.total" />
    </div>
  </div>
</template>
<script setup>
import TestTable from './components/TestTable.vue'
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted,watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchQuestion,fetchDeleteQuestion } from '@/api/qsBankManage.js'
import { ElMessage,ElMessageBox } from 'element-plus'

const router = useRouter()
const activeName = ref('3')
const tableData = ref([]) // 表格数据
const loading = ref(false)
const searchName = ref('')
const pagination = reactive(
  {
      curPageSize:10,
      curPage:1,
      total:0,
  })

watch( [activeName,()=> pagination.curPageSize,()=>pagination.curPage] ,(newVal,oldVal )=>{
   getQuestionList()
   if(newVal[0]  !== oldVal[0]){
    pagination.curPageSize = 10
    pagination. curPage = 1
    pagination.total = 0
   }
} )



/**
 * 方法
 */

function searchQsBank(e){
 e.keyCode === 13 && getQuestionList()

}
function addQuestion () {
  router.push('./addTest')
}


/**
 *请求
 */
function getQuestionList(){
  loading.value = true
  const params = {
    page_size:pagination.curPageSize ,
    curr_page:pagination.curPage ,
    entity:{
      status_id:  Number(activeName.value),
      keywords: searchName.value,
    }
  }
    fetchQuestion(params).then(res =>{
      loading.value = false
      if(res.code === 0 && res.data ){
        pagination.total  = res.data.total_count
        tableData.value = res.data.list || []
      }else{
        tableData.value = []
        ElMessage.error( res.msg ||  res.data.error)
      }

    })
}

function deleteQuestion(qs) {
    ElMessageBox.confirm(
    '确定删除当前题目吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
        fetchDeleteQuestion( qs.id).then(
          res =>{
          if(res.code === 0   ){
           getQuestionList()
           ElMessage.success( '删除成功')
          }else{
           ElMessage.error( res.msg ||  res.data.error)

          }
        }
      )
 })
}

onMounted(() => {
  getQuestionList()
})
</script>
<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.container .header {
  margin: 30px 30px 30px;
  display: flex;
  justify-content: space-between;
}
.tabs {
  margin-left: 25px;
}
.el-input {
  position: absolute;
  display: inline-flex;
  width: 15%;
  margin-left: 84%;
  box-sizing: border-box;
  vertical-align: middle;
  z-index: 100;
}
:deep(.el-input__icon) {
  cursor: pointer;
}
</style>
