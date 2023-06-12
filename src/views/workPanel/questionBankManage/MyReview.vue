<template>
  <div class="container">
    <div class="btn">
      <h2>我的审核</h2>
    </div>

    <div class="tabs">
      <div class="search">
        <el-input placeholder="请输入试题题干关键字" v-model="searchName" @keydown="searchReview" clearable>
          <template #prefix>
            <el-icon @click="search" class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" @tab-change="tabChange">
        <el-tab-pane label="未审核" name="2">
          <ReviewTable value="true" pass="true" :loading="loading" :handleReview="handleReview" :tableData="tableData" @currentChange="getcurrentChange" @sizeChange="getsizeChange" />
        </el-tab-pane>
        <el-tab-pane label="已通过" name="1">
          <ReviewTable :tableData="tableData" :loading="loading" :handleReview="handleReview" @currentChange="getcurrentChange" @sizeChange="getsizeChange" />
        </el-tab-pane>
        <el-tab-pane label="已拒绝" name="0">
          <ReviewTable reason="true" :tableData="tableData" :loading="loading" :handleReview="handleReview" @currentChange="getcurrentChange" @sizeChange="getsizeChange" />
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

<script setup name="MyReview">
import ReviewTable from './components/ReviewTable.vue'
import { Search } from '@element-plus/icons-vue'
import { reactive, ref, onMounted, watch } from 'vue'
import { fetchQuestionReview } from '@/api/qsBankManage.js'
import { ElMessage ,ElMessageBox} from 'element-plus'


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
   getReviewList()
   if(newVal[0]  !== oldVal[0]){
    pagination.curPageSize = 10
    pagination. curPage = 1
    pagination.total = 0
   }
} )



/**
 * 方法
 */

function searchReview(e){
 e.keyCode === 13 && getReviewList()

}



/**
 *请求
 */
function getReviewList(){
  loading.value = true
  const params = {
    page_size:pagination.curPageSize ,
    curr_page:pagination.curPage ,
    entity:{
      query_condition: Number(activeName.value),
      keywords: searchName.value,
    }
  }
    fetchQuestionReview(params).then(res =>{
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



onMounted(() => {
  getReviewList()
})
</script>
<style lang="scss" scoped>
.container .btn {
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
