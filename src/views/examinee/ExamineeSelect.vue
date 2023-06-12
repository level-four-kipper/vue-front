<template>
  <div class="container">
    <div class="header">
      <h2>添加考生</h2>
      <el-button type="primary" @click="dialogVisible=true">提交</el-button>
      <el-dialog v-model="dialogVisible" title="提示" width="30%">
        <span>确认提交？</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="examineeSubmit"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="tabs">
      <el-input placeholder="请输入考生名称" v-model="input" @change="search" clearable>
        <template>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="全部" name="first">
          <el-table
          v-loading="loading"
          :data="tableData" 
          style="width: 100%" 
          :row-key="getRowKeys"
          ref="multipleTableRef"
          @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" :reserve-selection="true" width="55"  align="center" />
            <!-- <el-table-column property="id" label="用户编号" width="200" align="center"></el-table-column> -->
            <el-table-column property="name" label="用户姓名" width="200" align="center" />
            <el-table-column property="createTime" label="注册时间" width="200" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        v-model:current-page="curPage "
        v-model:page-size="curPageSize"
        :page-sizes="[10, 20, 30, 40]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next  "
        :total="total"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>
<script setup>
import {reactive,ref,onMounted,watch} from 'vue'
import {useRouter,useRoute} from  'vue-router'
import search from 'element-plus'
import {fetchPageListManage} from '@/api/controlPannel.js'
import {fetchExaminee} from '@/api/examinee.js'
import { ElMessage } from 'element-plus'

const input=ref('')
const router = useRouter();
const route = useRoute()
const activeName = ref('first')
const dialogVisible = ref(false)

const loading = ref(true)
const curPageSize = ref(10)
const curPage  = ref(1)
const searchName = ref('')
const total = ref(0)
const tableData  =ref([])
const examineeData=ref([])

const examineeSelection =reactive([]);//表格选中当前所有数据
let examineeSelectList=reactive([])//表格选择题库的id数据
const selectNumber = ref('')//表格select选中的条数

const groupId=route.query.groupId
console.log(groupId)

function getRowKeys(row){
  return row.id
}
//获取多选框数据并且回显数据
function handleSelectionChange(rows){
  examineeSelection.value=rows;
  console.log(examineeSelection)
  selectNumber.value=examineeSelection.value.length;
  examineeSelectList=[];
  console.log(examineeSelectList)
  if(rows){
    rows.forEach((row)=>{
      if(row){
        examineeSelectList.push(row.id)
      }
    })
  }
}

function onPageSizeChange(value){
  curPageSize.value = value
  curPage.value=1
  getUserList();
}
function onPageChange(value){
  curPage.value = value
  getUserList();
}
const selectList=ref([])
const multipleTableRef=ref([])

// function getSelectionList(){
//   this.$nextTick(()=>{
//     tableData.value.forEach(row=>{
//       if(selectList.value.indexOf(row.id)>=0){
//         this.$refs.multipleTableRef.toggleRowSelection(row,true)
//       }
//     })
//   })
// }
onMounted(()=>{
  getExamineeList();
  getUserList();
  console.log(examineeData,'examineeData')
  console.log(tableData,'tableData')
  console.log(selectList.value,'selectList')
  // getSelectionList()
})

//获取该组考生数据
function getExamineeList(){
  const params = {
    entity:{
      group_id:groupId
    }
  }
  fetchExaminee(params).then( result => {
    console.log(params,'params')
    console.log(result,'ExamineeResult')
      loading.value = false
      if(result.code === 0 ){
        examineeData.value = result.data.list.map(item =>  {
          return {
            examineeId:item.id,
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
//获取用户列表数据
function getUserList(){
  const params = {
    page_size:curPageSize.value,
    curr_page:curPage.value,
    paper_name:searchName.value,
    entity:{
      }
    }
  fetchPageListManage(  params  ).then( result => {
    console.log(result,'result')
      loading.value = false
      total.value = result.data.total_count
      if(result.code === 0 ){
         tableData.value = result.data.list.map(item =>  {
          return {
            id:item.id,
            name:item.name,
            createTime:item.gmt_created,
          }
      })
      }else{
        ElMessage({
        message:  result.data.error,
        type: 'error',
        })
      }
      console.log(examineeData.value[0].examineeId,'examineeData')
      console.log(tableData.value,'tableData')
      //判断当前分页已存在考生
      if(examineeData.value!=''){
        let n=0;
        for(let i=0;i<tableData.value.length;i++){
          for(let j=0;j<examineeData.value.length;j++){
            if(tableData.value[i].id==examineeData.value[j].examineeId){
              // this.$refs.multipleTable.toggleRowSelection(tableData.value[i].id,true)
              selectList.value[n]=tableData.value[i].id;
              console.log(selectList.value[n],'已存在考生')
              n++;
            }
          }
        }
      }

  })
}

function examineeSubmit(){
    router.replace('examinee')
}
</script>

<style lang="scss" scoped>
.container{
  padding: 10px 50px;
  .header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    .el-button--text {
      margin-right: 15px;
    }
    .el-select {
      width: 300px;
    }
    .el-input {
      width: 300px;
    }
    .dialog-footer button:first-child {
      margin-right: 10px;
    }
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
.tabs>.el-input {
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
.el-table__row{
  .cell{
    span{
      padding-right: 10px;
      color: #06f;
      cursor: pointer;
    }
  }
}
</style>
