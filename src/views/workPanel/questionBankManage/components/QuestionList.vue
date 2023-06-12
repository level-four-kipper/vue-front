<!-- 某一题库下的题目列表 -->
<template>
  <div class="tab-question-list">
    <el-button type="primary" @click="addTest">添加试题</el-button>
    <el-input placeholder="请输入试题题干关键字" v-model="queryInfo.keywords" @keydown="searchQuestion" clearable>
      <template #prefix>
        <el-icon @click="search" class="el-input__icon">
          <Search />
        </el-icon>
      </template>
    </el-input>
    <TestTable :tableData="tableData" :loading="loading" :deleteQuestion="deleteQuestion" />
    <el-pagination v-model:current-page="queryInfo.curPage " v-model:page-size="queryInfo.curPageSize" :page-sizes="[10, 20, 30, 40]" :small="small" layout="total, sizes, prev, pager, next " :total="queryInfo.total" @size-change="onPageSizeChange" @current-change="onPageChange" />
  </div>
</template>

<script setup name="QuestionList">
import {questionType} from '@/views/workPanel/data.js'
import { Search } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
import { fetchQuestion,fetchDeleteQuestion} from '@/api/qsBankManage.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import TestTable from './TestTable.vue'

const route = useRoute()
const router = useRouter()
const tableData=ref([])
const loading = ref(false)
const expand = ref([]) //要展开的行
const queryInfo = reactive(
  {
      curPageSize:10,
      curPage:1,
      total:0,
      keywords: '',
      gmt_created: ''
  })


watch( [ ()=> queryInfo.curPageSize,()=>queryInfo.curPage] ,(newVal,oldVal )=>{
   getQuestionList()
   if(newVal[0]  !== oldVal[0]){
    queryInfo.curPageSize = 10
    queryInfo. curPage = 1
    queryInfo.total = 0
   }
} )


function searchQuestion(e){
 e.keyCode === 13 && getQuestionList()
}

const addTest = () => {
  router.push( '/workPanel/addTest/'+ route.params.id)
}

//点击展开行
const toogleExpand = row => {
  if (expand.value.includes(row.number)) {
    expand.value = expand.value.filter(val => val !== row.number)
  } else {
    expand.value.push(row.number)
  }
  console.log('row', row.number)
}
//getCurrentInstance方法返回了当前的实例对象
const currentInstance = getCurrentInstance()
//执行点击行调用的方法，展开和折叠行
const clickTable = (row, index, e) => {
  currentInstance.ctx.$refs.refTable.toggleRowExpansion(row)
  console.log(index, e)
}


/**
 * 请求
 */
function  getQuestionList ()  {
  loading.value=true
  const param = {
    curr_page: queryInfo.curPage ,
    page_size: queryInfo.curPageSize,
    entity: {
      // status_id: activeName.value,
      keywords: queryInfo.keywords,
      question_bank_id: route.params.id
    }
  }
  fetchQuestion(param).then(res => {
    loading.value=false
    if(res.code === 0){
      queryInfo.total  = res.data.total_count || 0
      tableData.value = res.data.list || []
    }else{
      ElMessage({
          message: res.msg || res.data.error,
          type: 'error'
        })
    }
  })

}
function deleteQuestion(row)  {
  ElMessageBox.confirm('是否确定删除该试题？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
      fetchDeleteQuestion( row.id).then(res => {
        if(res.code === 0){
          getQuestionList()
        }else{
          ElMessage({
              message: res.msg || res.data.error,
              type: 'error'
            })
        }
      })
    })

}


onMounted(() => {
   getQuestionList()
})
</script>

<style lang="scss" scoped>
.el-button {
  position: relative;
}
.el-input {
  position: absolute;
  width: 20%;
  margin-left: 72%;
  .el-input__icon {
    cursor: pointer;
  }
}
.detail {
  margin-right: 10px;
  cursor: pointer;
  color: rgb(11, 52, 235);
}
.del {
  margin-left: 10px;
  cursor: pointer;
  color: rgb(11, 52, 235);
}
.el-table {
  :deep(.el-table__expand-icon) {
    display: none !important;
  }
  .picture {
    width: 15px;
    margin-left: 20px;
    margin-top: 15px;
    cursor: pointer;
  }
}
.question-option {
  margin-right: 20px;
}

.el-pagination {
  margin-left: 62%;
  margin-top: 1%;
}
</style>
