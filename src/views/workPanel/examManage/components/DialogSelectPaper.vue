<template>
  <el-dialog class="paper-dialog" style="width: 800px" :model-value="isVisible" :show-close="false" title="选择试卷" :default-sort="{ prop: 'createTime', order: 'descending' }">
    <el-table v-loading="loading" :data="tableData" style="width: 100%" height="400" @cell-click="jumpPaperDetail" highlight-current-row>
      <el-table-column property="checkbox" width="50" align="center">
        <template #default="scope">
          <input type="checkbox" v-model="scope.row.checked" @change="checkChange(scope.row )" />
        </template>
      </el-table-column>
      <el-table-column property="id" label="试卷编号" width="200" align="center">
        <template #default="scope">
          <span> {{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column property="name" label="试卷名称" align="center">
        <template #default="scope">
          <span class="paper-name">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column property="createTime" label="创建时间" width="200" />
    </el-table>
    <el-pagination
      v-if="pagination.total"
      v-model:current-page="pagination.curPage "
      v-model:page-size="pagination.curPageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      layout="total, sizes, prev, pager, next "
      :total="pagination.total"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancelPaperForm">取消</el-button>
        <el-button type="primary" @click="onConfirmPaperForm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive,ref,onMounted,watch} from "vue";
import {useRouter } from "vue-router"
import _ from 'lodash'
import {fetchPaperAll  } from '@/api/paper.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  isVisible:Boolean,
  examPaper:Object, //{name:'',id:''}
  updateFormExamData:Function,
})

const router=useRouter();
const tableData = ref( [])
const loading = ref(true)
const selectPaper = reactive({
  name:'',
  id:'',
})
const pagination = reactive({
      curPageSize:10,
      curPage:1,
      total:0,
  })

  watch( [ ()=> pagination.curPageSize,()=>pagination.curPage] ,( )=>{
   getPaperList()
} )


function checkChange(row) {
  if(row.id !== selectPaper.id){
    selectPaper.name = row.name
    selectPaper.id = row.id
    tableData.value.forEach(item =>  item.id===  row.id ? item.checked = true : item.checked = false  )
  }

}

function onCancelPaperForm() {
  props.updateFormExamData(['paperFormVisible'],[false])
  tableData.value.forEach(item => {
  item.id === selectPaper.id  && (item.checked = false)
  item.id === props. examPaper.id  && (item.checked = true)
  })
}
function onConfirmPaperForm() {
  if(selectPaper.id ){
    const keys = ['examName','paperName','paperId','paperFormVisible']
    const values = [selectPaper.name,selectPaper.name,selectPaper.id,false  ]
    props.updateFormExamData(keys,values)
  }else{
   props.updateFormExamData(['paperFormVisible'],[false])

  }
}

function jumpPaperDetail(row,column, ) {
    if(column.label === '试卷名称') {
        router.push('/workPanel/paperDetail')
    }

}
//请求
function getPaperList(){
  loading.value = true
  const params = {
    page_size:pagination.curPageSize ,
    curr_page:pagination.curPage ,
    paper_name:pagination.searchName ,
    entity:{
    }
  }
  fetchPaperAll(params).then( result => {
      loading.value = false
      pagination.total  = result.data.total_count
      if(result.code === 0 ){
          result.data.list.forEach(item =>  {
            if(item.status === '通过'){
              const paper = {
                checked: item.id === props.examPaper.id ?true:false,
                id:item.id,
                name:item.paper_name,
                createTime:item.gmt_created,
              }
              tableData.value.push( paper)
            }
      })
      }else{
        tableData.value = []
        ElMessage({
        message:  result.data.error,
        type: 'error',
        })
      }
  })
}

 onMounted( () =>{
  getPaperList()
  })
</script>

<style lang="scss" scoped>

 .el-dialog{
 width: 60%;
 background-color: pink;
 }

.el-table__row{
  .cell{
    .paper-name{
    cursor: pointer;
    color:#06f;
}

  }
}
</style>
