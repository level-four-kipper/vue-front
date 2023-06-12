<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <div class="header">
      <h2>分组管理</h2>
      <el-button type="primary" @click="dialogFormVisible = true">创建分组</el-button>
      <el-dialog v-model="dialogFormVisible" title="添加分组">
        <el-form>
          <el-form-item label="分组名称" :label-width="formLabelWidth">
            <el-input v-model="name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="分组描述" :label-width="formLabelWidth">
            <el-input v-model="describe" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="GroupListSubmit"> 确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="tabs">
      <!-- <el-input placeholder="请输入分组关键字" v-model="input" @change="search" clearable>
        <template>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input> -->
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="全部" name="first">
          <el-table :data="tableData" :loading="loading" style="width: 100%">
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column property="name" label="分组名称" width="300" align="center" />
            <el-table-column property="describe" label="描述" width="400" align="center" />
            <el-table-column property="createTime" sortable :sort-by="createTime" label="创建时间" width="200" />
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <span @click="editGroup(scope.row)">编辑</span>
                <span @click="deleteGroup(scope.row.id)">删除</span>
              </template>
            </el-table-column>
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
import { reactive,ref,onMounted } from 'vue'
import {useRouter} from  'vue-router'
import { ElMessage,ElMessageBox } from 'element-plus'
import {fetchGroupList,fetchCreateGroup,fetchDeleteGroup,fetchUpdateGroup} from '@/api/examinee.js'

const input=ref('')
const router = useRouter();
const dialogFormVisible=ref(false)
const formLabelWidth='140px'
const activeName = ref('first')

const name=ref('')//分组名称
const describe=ref('')//分组描述

const loading = ref(true)
const curPageSize = ref(10)
const curPage  = ref(1)
const total = ref(0)
const tableData  =ref([])
const groupId=ref(0)

function onPageSizeChange(value){
  curPageSize.value = value
  curPage.value=1
  getGroupList();
}
function onPageChange(value){
  curPage.value = value
  getGroupList();
}
onMounted(()=>{
  getGroupList();
  // if(id)
  // getMyPaperList();
})
//查询分组
function getGroupList(){
  const params = {
    page_size:curPageSize.value,
    curr_page:curPage.value,
    entity:{
      }
    }
  fetchGroupList(  params  ).then( result => {
    console.log(result,'result')
      loading.value = false
      total.value = result.data.total_count
      if(result.code=== 0 ){
        tableData.value = result.data.list.map(item =>  {
          return {
            id:item.id,
            name:item.group_name,
            describe:item.description,
            createTime:item.gmt_created,
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

//分组数据提交
function GroupListSubmit(){
  if(name.value==''){
      ElMessage({
          message:  '分组名称为空！',
          type: 'error',
        })
  }else{
    dialogFormVisible.value = false
    if(groupId.value){
      const params = {
        id:groupId.value,
        group_name:name.value,
        description:describe.value,
      }
      fetchUpdateGroup(  params ).then( result => {//编辑分组数据提交
      console.log(params,'params')
      console.log(result,'result')
        loading.value = false
        if(result.code=== 0 ){
          getGroupList();
          name.value='',
          describe.value='',
          ElMessage({
            message:  '编辑成功',
            type: 'success',
          })
        }else{
        ElMessage({
          message:  result.data.error,
          type: 'error',
          })
        }
      })
    }else{
      const params = {
      group_name:name.value,
        description:describe.value,
      }
      fetchCreateGroup(  params  ).then( result => {//创建分组数据提交
        console.log(result,'result')
          loading.value = false
          if(result.code=== 0 ){
            getGroupList();
            name.value='',
            describe.value='',
            ElMessage({
            message:  '创建成功',
            type: 'success',
            })
          }else{
            ElMessage({
            message:  result.data.error,
            type: 'error',
            })
          }
      })
    }
  }
}

//分组取消
function cancel(){
  name.value=''
  describe.value=''
  dialogFormVisible.value = false
}
//编辑分组
function editGroup(row){
  dialogFormVisible.value=true
  console.log(row,'row')
  name.value=row.name
  describe.value=row.describe
  groupId.value=row.id
}

// 删除分组数据
function deleteGroup(id) {
  ElMessageBox.confirm(
    '确定删除当前分组吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() => {
      fetchDeleteGroup(id).then(result =>{
        console.log(result,'result')
        if(result.code === 0 ){
          getGroupList();
          ElMessage({
          message:  '删除成功',
          type: 'success',
        })
        }else{
          ElMessage({
          message:  result.data.error,
          type: 'error',
          })
         }
      }
     )
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
