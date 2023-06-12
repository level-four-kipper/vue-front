<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <el-container>
      <el-header class="header">
        <h2>考生管理</h2>
        <el-button type="primary" @click="dialogFormVisible=true">添加考生</el-button>
        <el-dialog v-model="dialogFormVisible" title="添加考生">
          <el-form :model="group">
            <el-form-item label="分组：" :label-width="formLabelWidth">
              <el-select v-model="group.id" placeholder="请选择分组">
                <el-option :value="item.id" :label="item.name" v-for="item in group" :key="item.id" />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="examineeSelect"> 确认 </el-button>
            </span>
          </template>
        </el-dialog>
      </el-header>
      <el-container>
        <!-- 分组列表 -->
        <el-aside class="aside-container" width="150px">
          <div class="aside" v-for="item in groupMenu" :key="item.id">
            <span v-show="group" :class="[tabId!=false&&tabId==item.id?'active-tab':'']" @click="selectGroupMenu(item.id)">
              {{item.name}}
            </span>
          </div>
        </el-aside>
        <el-main class="main" v-show="groupId">
          <!-- <ExamineeList /> -->
          <el-table :data="tableData">
            <!-- <el-table-column label="考生编号" prop="id" align="center" width="100px" /> -->
            <el-table-column label="考生姓名" prop="name" align="center" />
            <el-table-column label="创建时间" prop="createTime" align="center" />
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button type="danger" @click="deleteExaminee(scope.row.id)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页区域-->
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
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
// import ExamineeList from '@/views/examinee/ExamineeTable.vue'
import { reactive,ref,onMounted } from "vue";
import {useRouter} from "vue-router"
import {fetchGroupMenu,fetchGroupData} from '@/api/examinee.js'
import {fetchExaminee} from '@/api/examinee.js'
import { ElMessage } from 'element-plus'

const router=useRouter()
const tabId=ref(false)
const loading = ref(true)
const curPageSize = ref(10)
const curPage  = ref(1)
const total = ref(0)
const tableData=ref([])
const groupId = ref()
const groupMenu=ref([])

const dialogFormVisible=ref(false)
const formLabelWidth='140px'
const group=ref([])

function examineeSelect(){
  groupId.value=group.value.id
  console.log(groupId.value)
  router.push({
    path:"examineeSelect",
    query:{groupId:groupId.value}
  })
}

onMounted(()=>{
  getGroupMenu();
  getGroupList();
  // getExamineeList()
  // getMyPaperList();
})
function onPageChange(value) {
 curPage .value = value
 getExamineeList()
}
function onPageSizeChange(value){
 curPageSize.value = value
 curPage.value = 1
 getExamineeList()
}

//选择分组菜单
function selectGroupMenu(id){
  tabId.value=id
  groupId.value=id
  console.log(groupId.value,'groupId')
  console.log(typeof(groupId.value))
  getExamineeList()
 }

//获取分组菜单数据
function getGroupMenu(){
  fetchGroupMenu().then( result => {
    console.log(result,'result')
      if(result.code=== 0 ){
        groupMenu.value = result.data.map(item =>  {
          return {
            id:item.id,
            name:item.group_name,
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

//获取下拉菜单数据
function getGroupList(){
  fetchGroupData().then( result => {
    console.log(result,'result')
      if(result.code=== 0 ){
        group.value = result.data.map(item =>  {
          return {
            id:item.id,
            name:item.group_name,
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

//获取分组考生数据
function getExamineeList(){
  console.log(group)
  const params = {
    page_size:curPageSize.value,
    curr_page:curPage.value,
    entity:{
      group_id:groupId.value
    }
  }
  fetchExaminee(params).then( result => {
    console.log(params,'params')
    console.log(result,'ExamineeResult')
      loading.value = false
      total.value = result.data.total_count
      if(result.code === 0 ){
        tableData.value = result.data.list.map(item =>  {
          return {
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
  })
}


 function deleteExaminee(id){
  console.log(id)
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
  .aside-container{
    padding-top: 20px;
    .aside{
    margin:20px 20px 20px 20px;
    cursor: pointer;
    .active-tab{
      color: cornflowerblue;
      font-weight: bold !important;
    }
    }
  }
}
</style>
