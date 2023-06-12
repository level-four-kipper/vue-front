<!-- 题库设置 -->
<template>
  <div class="">
    <p>可见性</p>
    <el-select v-model=" visibility" placeholder="尚未选择" @change="updateQsBank">
      <el-option v-for="(item,index) in visibilityOptions" :key="index" :value="item.value" :label="item.label"></el-option>
    </el-select>
    <div class="add">
      <span class="member-set">成员管理</span>
      <span class="add-btn" @click="dialogFormVisible=true">+ 添加成员</span>
      <DialogAddPeople v-model:isVisible="dialogFormVisible" :onConfirm="addQsBankUser" :roleOption="roleOption"></DialogAddPeople>
    </div>
    <el-table :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%" highlight-current-row v-loading="loading" @row-click="handleRowClick" @selection-change="handleSelectionChange">
      <el-table-column label="成员" prop="username" align="center" />
      <el-table-column label="角色" prop="role" align="center">
        <template #default="select">
          <el-select v-model="select.row.role" @change="updateQsBankUser(select.row)">
            <el-option v-for="(item,index) in roleOption " :label="item.label" :value="item.value" :key="index" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" />
      <el-table-column label="操作" prop="operation" align="center">
        <template #default="scope">
          <span class="del" @click.stop="delQsBankUser(scope.row)">删除</span>
          <!-- <span class="exit" @click.stop="exit()">退出</span> -->
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination v-model:current-page="queryInfo.curPage " v-model:page-size="queryInfo.curPageSize" :page-sizes="[10, 20, 30, 40]" :small="small" layout="total, sizes, prev, pager, next " :total="queryInfo.total" @size-change="onPageSizeChange" @current-change="onPageChange" />

    <div>
      <span class="set">高级设置</span>
      <el-button type="danger" @click="delQuestionBank(id)">删除题库</el-button>
    </div>
  </div>
</template>

<script setup name="QuestionBankSet">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchDeleteQuestionBank } from '@/api/qsBankManage.js'
import {  fetchQsBankUserList , fetchUpdateQuestionBankUser,fetchDeleteQuestionBankUser} from '@/api/qsBankManage.js'
import {  fetchAddQuestionBankUser} from '@/api/qsBankManage.js'
import DialogAddPeople from './DialogAddPeople.vue'
// import DialogAddPeople from '@/components/DialogAddPeople.vue'

const props = defineProps({
  questionBankInfo:Object,   
})


const router = useRouter()
const route = useRoute()
const dialogFormVisible = ref(false)
const visibility = ref(props.questionBankInfo.visibility) //可见性
const tableData = ref([])
const queryInfo = reactive(
  {
      curPageSize:10,
      curPage:1,
      total:0,
      keywords: '',
      gmt_created: ''
  })
const visibilityOptions = reactive([
  { value: 1, label: '公开' },
  { value:2, label: '私有' }
])
const roleOption = reactive([
  { value: 1, label: '出题人' },
  { value: 2, label: '审题人' },
  { value: 3, label: '管理员' }
])



/**
 * 请求
 */
function getUserListPage  ()  {
  let param = {
    curr_page: queryInfo.curPage,
    page_size: queryInfo.curPageSize,
    entity: {
      question_bank_id:route.params.id
    }
  }
    fetchQsBankUserList(param).then(res => {
      if(res.code === 0){
       tableData.value = res.data.list || []
        }else{
           ElMessage({
            type: 'error',
            message: res.msg||res.code.error
          })
      }
  })
}
//添加成员 
function addQsBankUser(formPeopleData){
  const params={
    question_bank_id: route.params.id,
    user_id:formPeopleData.userId,
    role_id:formPeopleData.roleId,
  }
  fetchAddQuestionBankUser(params).then(res =>{
    if(res.code ===  0 &&  res.data){
     getUserListPage()
    }else{
      ElMessage({
        message: res.msg|| res.data.error,
        type: 'error',
      })
    }
})
}
//删除题库成员
const delQsBankUser = (row) => {
  ElMessageBox.confirm('确定要删除该成员吗?',   {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() =>{
      fetchDeleteQuestionBankUser(row. id) .then(res => {
       if (res.code === 0) {
          getUserListPage()
          ElMessage({
            type: 'success',
            message: '删除成功'
          })

        } else {
          ElMessage({
            type: 'error',
            message: res.msg||res.data.error
          })
        }
    })
  })


}

const updateQsBankUser = (row) =>{
  const param = {
    question_bank_id: route.params.id,
    user_id : row.user_id,
    role_id: row.role ,
  }
  fetchUpdateQuestionBankUser(param).then(res => {
    if (!res.code === 0) {
        ElMessage({
        type: 'error',
        message: res.msg||res.code .error
      })
    }
  })

}

function delQuestionBank ()  {
  ElMessageBox.confirm('确定要删除题库吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
      fetchDeleteQuestionBank(route.params.id).then(res => {
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '删除成功！'
          })
          router.push('/workPanel/myQuestionBank')
        } else {
          ElMessage({
            type: 'error',
            message: res.msg||res.code .error
          })
        }
      })
    })
}

function updateQsBank (){
    const param = {
        name: questionBankInfo.name,
        area: questionBankInfo.area,
        visibility:  visibility.value,
        description: questionBankInfo.description,
        icon: questionBankInfo.icon,
        id: route.params.id
      }
    fetchUpdateQuestionBank(param).then(res => {
       if (!res.code === 0) {
            ElMessage.error(   res.msg || res.data.error)
          }  
        })

}

onMounted(() => {
  getUserListPage()
})
</script>

<style lang="scss" scoped>
.cell {
  .el-select {
    width: 120px;
    border: none;
    :deep(.el-input__wrapper) {
      box-shadow: none !important   ;
      outline: none;
    }
  }
}

:deep(.example-showcase .el-dropdown-link) {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.add {
  display: flex;
  justify-content: space-between;
}
.member-set {
  margin-top: 10px;
  margin-bottom: 15px;
  font-weight: bold;
}
.add-btn {
  cursor: pointer;
  margin-right: 50px;
  margin-bottom: 10px;
  color: rgb(5, 67, 199);
  font-weight: bold;
}
.set {
  display: block;
  margin-top: 40px;
  margin-bottom: 10px;
}
.exit {
  margin-left: 10px;
  cursor: pointer;
  color: rgb(11, 52, 235);
}
.del {
  margin-right: 10px;
  cursor: pointer;
  color: rgb(11, 52, 235);
}
.el-pagination {
  margin-left: 68%;
  margin-top: 1%;
}
</style>
