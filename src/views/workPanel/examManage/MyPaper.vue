<template>
  <div class="container">
    <div class="header">
      <h2>我的试卷</h2>
      <el-button type="primary" @click="addPaper">创建试卷</el-button>
    </div>
    <div class="tabs">
      <el-input placeholder="请输入试题关键字" v-model="searchName" @keydown="searchPaper" clearable>
        <template>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="全部" name="first"><PaperTable :loading="loading" :data="tableData" :deletePaper="deletePaper" /></el-tab-pane>
        <el-tab-pane label="由我创建" name="second"><PaperTable :loading="loading" :data="myPaperData" :deletePaper="deletePaper" /></el-tab-pane>
        <el-tab-pane label="由我审核" name="third"><PaperTable :loading="loading" :data="tableData" :deletePaper="deletePaper" /></el-tab-pane>
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
import PaperTable from './components/PaperTable.vue'
import {onMounted,ref,watch,reactive} from 'vue'
import {useRouter} from  'vue-router'
import search from 'element-plus'
import { ElMessage,ElMessageBox } from 'element-plus'
import {fetchPaperAll,fetchDeletePaper,fetchUpdatePaper} from '@/api/paper.js'
const router = useRouter()
const loading = ref(false)
const activeName = ref('1')
const searchName = ref('')
const tableData  =ref([])
const pagination = reactive(
  {
      curPageSize:10,
      curPage:1,
      total:0,
  })


watch( [activeName,()=> pagination.curPageSize,()=>pagination.curPage] ,(newVal,oldVal )=>{
   getPaperList()
   if(newVal[0]  !== oldVal[0]){
    pagination.curPageSize = 10
    pagination. curPage = 1
    pagination.total = 0
   }
} )

function addPaper(){
  router.push('./createPaper')
}


/**
 * 请求
 */
function getPaperList(){
  loading.value = true
  const params = {
    page_size:pagination.curPageSize ,
    curr_page:pagination.curPage ,
    entity:{
        condition: activeName.value,
        exam_name:searchName.value,
    }
  }
  fetchPaperAll(  params  ).then( result => {
      loading.value = false
      if(result.code === 0 && result.data ){
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

function deletePaper(id) {
    ElMessageBox.confirm(
    '确定删除试卷吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      fetchDeletePaper(id).then(
      result =>{
      if(result.code === 0   ){
        if(activeName.value=='first'||activeName.value=='third'){
          getPaperList()
        }
        else if(activeName.value=='second'){
          getMyPaperList()
        }
        ElMessage({
        message:  '删除成功',
        type: 'success',
        })
      }else{
        ElMessage({
        message:  '删除失败',
        type: 'error',
        })
      }
    }
  )
  })


}

onMounted(() => {
  getPaperList( );
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
  .btn{
    margin: 30px 30px 30px;
  }

}
// Tabs标签页样式
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.el-input {
    position: absolute;
    display: inline-flex;
    width: 15%;
    margin-left: 84%;
    box-sizing: border-box;
    vertical-align: middle;
    z-index: 999;
}
.el-input__wrapper {
  z-index: 100;
}
</style>
