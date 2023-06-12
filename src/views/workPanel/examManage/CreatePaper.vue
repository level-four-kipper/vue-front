<template>
  <div class="container">
    <div class="header">
      <h2>创建试卷</h2>
    </div>
    <div>
      <span>试卷名称：</span>
      <el-input style="width:200px" v-model="paperName" placeholder="请输入试卷名称"></el-input>
    </div>
    <div>
      <span class="describe">试卷简介：</span>
      <el-input class="textarea-container" v-model="paperDetail" :row="3" type="textarea" placeholder="请输入简介"></el-input>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane label="Java" name="java"><QsBankTable :paperName="paperName" :paperDetail="paperDetail" :loading="loading" :data="tableData" /></el-tab-pane>
      <el-tab-pane label="Python" name="python"><QsBankTable :paperName="paperName" :paperDetail="paperDetail" :loading="loading" :data="tableData" /></el-tab-pane>
      <el-tab-pane label="C++" name="c++"><QsBankTable :paperName="paperName" :paperDetail="paperDetail" :loading="loading" :data="tableData" /></el-tab-pane>
    </el-tabs>
    <el-pagination
      v-model:current-page="curPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next "
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import QsBankTable from './components/QsBankTable.vue'
// import {useRouter, useRoute} from 'vue-router'
import {ref,onMounted,watch} from 'vue'
import {fetchQsBank} from '@/api/paper.js'
import { ElMessage } from 'element-plus'

const paperName=ref('')
const paperDetail=ref('')
const activeName = ref('java')
const loading = ref(true)
const pageSize = ref(10)
const curPage  = ref(1)
const total = ref(0)
const tableData  =ref([])

watch( [activeName,pageSize,curPage] ,(newVal,oldVal )=>{
   getQsBankList();
   if(newVal[0]  !== oldVal[0]){
    pageSize.value = 10
    curPage.value = 1
    total.value = 0
   }
} )
// watch( [activeName,PageSize] ,( )=> getQsBankList( ) )z
onMounted(()=>{
  getQsBankList();
})
function handleSizeChange(value) {
 pageSize.value = value
 curPage.value=1
 getQsBankList();
}
function handleCurrentChange(value){
 curPage .value = value
 getQsBankList();
}
function handleClick(){
  getQsBankList();
  console.log(activeName.value)
}
//获取领域题库列表数据
function getQsBankList(){
  const params = {
    page_size:pageSize.value,
    curr_page:curPage.value,
    entity:{
        area: activeName.value
      }
    }
  fetchQsBank(  params  ).then( result => {
    console.log(result,'result')
      loading.value = false
      total.value = result.data.total_count
      if(result.code===0 ){
        tableData.value = result.data.list.map(item =>  {
          return {
            QsBankId:item.id,
            id:item.question_bank_number,
            icon:item.icon,
            name:item.name,
            testCount:item.total_questions,
            describe:item.description,
          }
      })
      }else{
        ElMessage({
        message:  result.data.error,
        type: 'error',
        })
      }
  })
}
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
  .describe{
    display: flex;
  }
  .textarea-container{
    width: 500px;
  }
}
</style>
