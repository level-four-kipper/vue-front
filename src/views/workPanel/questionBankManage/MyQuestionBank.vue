<!-- 我的题库 -->
<template>
  <div class="container">
    <div class="btn">
      <h2>我的题库</h2>
      <el-button type="primary" @click="addQuestionBank">创建题库</el-button>
    </div>

    <div class="tabs">
      <div class="search">
        <el-input placeholder="请输入题库名称关键字" v-model="searchName" @keydown="searchQsBank" clearable>
          <template #prefix>
            <el-icon @click="search" class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="全部" name="0">
          <QuestionBankTable :tableData="tableData" :loading="loading" :deleteQsBank="deleteQsBank" />
        </el-tab-pane>
        <el-tab-pane label="由我创建" name="1">
          <QuestionBankTable value="test" :tableData="tableData" :deleteQsBank="deleteQsBank" />
        </el-tab-pane>
        <el-tab-pane label="我参与的" name="2">
          <QuestionBankTable :tableData="tableData" :deleteQsBank="deleteQsBank" />
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
import QuestionBankTable from './components/QuestionBankTable.vue'
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, watch,  } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { fetchQuestionBank } from '@/api/qsBankManage.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchDeleteQuestionBank } from '@/api/qsBankManage.js'

const route = useRoute()
const router = useRouter()
const activeName = ref('0')
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
   getQsBankList()
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
 e.keyCode === 13 && getQsBankList()
}
function addQuestionBank() {
  router.push('./addQuestionBank')
}


/**
 *请求
 */
function getQsBankList(){
  loading.value = true
  const params = {
    page_size:pagination.curPageSize ,
    curr_page:pagination.curPage ,
    entity:{
      query_condition: Number(activeName.value),
      keywords: searchName.value,
    }
  }
  fetchQuestionBank(params).then(res =>{
      loading.value = false
      if(res.code === 0 ){
        pagination.total  = res.data.total_count
        tableData.value = res.data.list || []
      }else{
        tableData.value = []
        ElMessage.error( res.msg ||  res.data.error)

      }

    })
}

function deleteQsBank(qsBank) {
    ElMessageBox.confirm(
    '确定删除当前题库吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
        fetchDeleteQuestionBank(qsBank.id).then(
          res =>{
          if(res.code === 0  ){
            getQsBankList()
            ElMessage.success( '删除成功')
          }else{
            ElMessage.error( res.msg ||  res.data.error)
          }
        }
      )
 })
}

onMounted(() => {
  getQsBankList()
})
</script>

<style lang="scss" scoped>
// Tabs标签页样式
.demo-tabs {
  .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
}
.container {
  height: 100%;
  .btn {
    margin: 30px 30px 30px;
    display: flex;
    justify-content: space-between;
  }
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
