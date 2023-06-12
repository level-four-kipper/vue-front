<template>
  <el-table v-loading="loading" :data="tableData" style="width: 100%" max-height="400" @current-change="checkPaper" @cell-click="getPaperDetail" highlight-current-row>
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
    <el-table-column property="name" label="试卷名称" width="200" align="center">
      <template #default="scope">
        <span class="paper-name">{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column property="status" label="状态" align="center" /> -->
    <el-table-column property="createTime" sortable :sort-by="createTime" label="创建时间" width="200" />
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
</template>

<script setup>
import { reactive,ref,onMounted,computed,watch} from "vue";
import {useRouter } from "vue-router"
import _ from 'lodash'
import {fetchPaperAll  } from '@/api/paper.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  labels:Array,
  paperId:String,
  isInitData:Boolean,
  setCurPaper:Function,
  setSelectPaper:Function,

})

const router=useRouter();
const tableData = ref( [])
const loading = ref(true)
const pagination = reactive(
  {
      curPageSize:10,
      curPage:1,
      total:0,
  })

  watch( [ ()=> pagination.curPageSize,()=>pagination.curPage] ,( )=>{
   getPaperList()
} )

  watch( props.isInitData ,( )=>{
    console.lgo('isinitdata')
    tableData.value.forEach(item  => item.checked =false)
} )


function checkChange(row) {
  props.setSelectPaper(row)
  tableData.value.forEach(item =>  item.id===  row.id ? item.checked = true : item.checked = false  )
}
function getPaperDetail(row,column,cell, ) {
    if(column.label === '试卷名称') {
        router.push('/workPanel/paperDetail')
    }
    // console.log(row);
    // console.log(column);
    // console.log(cell);
}

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
          item.status === '通过' && tableData.value.push({
              checked:false,
              id:item.id,
              name:item.paper_name,
              createTime:item.gmt_created,
            })
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

.el-table__row{
  .cell{
    .paper-name{
    cursor: pointer;
    color:#06f;
}

  }
}
</style>
