<!-- 题库设置 -->
<template>
  <div class="">
    <p>可见性</p>
    <el-select v-model="visibility" placeholder="尚未选择" @change="visibilityChange">
      <el-option v-for="(item,index) in visibilityOptions" :key="index" :value="item.value" :label="item.label"></el-option>
    </el-select>
    <!-- 添加成员弹窗 -->
    <div class="add">
      <span class="member-set">成员管理</span>
      <span class="add-btn" @click="dialogFormVisible=true">+ 添加成员</span>
      <el-dialog v-model="dialogFormVisible" title="添加成员">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="140px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          label-position="top"
          require-asterisk-position="right"
          style="margin-top: 15px "
        >
          <el-form-item label="选择用户" prop="selectUser" required="true">
            <el-select v-model="ruleForm.selectUser" placeholder="尚未选择">
              <el-option v-for="(item,index) in selectUserOptions" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择角色" prop="selectRole" required="true">
            <el-select v-model="ruleForm.selectRole" placeholder="尚未选择">
              <el-option v-for="(item,index) in selectRoleOptions" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false"> 添加 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <el-table
      :data="roleData"
      :default-sort="{ prop: 'date', order: 'descending' }"
      style="width: 100%"
      highlight-current-row
      v-loading="loading"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!--type="selection"表格多选  -->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="成员" prop="username" align="center" />
      <el-table-column label="角色" prop="role" align="center">
        <template #default="scope">
          <span>{{scope.row.role}}</span>
          <el-dropdown trigger="click" @command="handleCommand($event,scope.row.user_id)">
            <span class="el-dropdown-link">
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="出题人">出题人</el-dropdown-item>
                <el-dropdown-item command="管理员">管理员</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" />
      <el-table-column label="操作" prop="operation" align="center">
        <template #default="scope">
          <span class="del" @click.stop="del(scope.row)">删除</span>
          <span class="exit" @click.stop="exit()">退出</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[10,20,50,100]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="roleTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <div>
      <span class="set">高级设置</span>
      <el-button type="danger" @click="delQuestionBank(id)">删除题库</el-button>
    </div>
  </div>
</template>

<script setup name="QuestionBankSet">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchDeleteQuestionBank } from '@/api/questionBank.js'
defineProps({
  roleData: { type: Array, default: () => [] },
  roleTotal: { type: Number, default: 0 }
})
const dialogFormVisible = ref(false)
const visibility = ref('') //可见性
const ruleForm = reactive({
  selectUser: [],
  selectRole: []
})
const selectUserOptions = reactive([
  { value: '李四', label: '李四' },
  { value: '王五', label: '王五' }
])
const selectRoleOptions = reactive([
  { value: '出题人', label: '出题人' },
  { value: '审题人', label: '审题人' },
  { value: '管理员', label: '管理员' }
])
const visibilityOptions = reactive([
  { value: '公开', label: '公开' },
  { value: '私有', label: '私有' }
])
const queryInfo = reactive({
  query: '', //查询参数
  pagenum: 1, //当前页码
  pagesize: 10 //每页显示条数
})
//监听pagesize改变的事件
const handleSizeChange = newSize => {
  queryInfo.pagesize = newSize
}
//监听页码值改变的事件
const handleCurrentChange = newPage => {
  queryInfo.pagenum = newPage
}

// const router = useRouter()
//添加成员
// const addMember = () => {
//     router.push({ name: 'addMember' })
//     localStorage.setItem('type', 'second')
// }

// 可见性选中值发生变化时
const visibilityChange = val => {
  console.log('val', val)
  visibility.value = val
  console.log('visibility.value', visibility.value)
}
const emit = defineEmits(['handleCommand'])
//改变角色    val是command属性的值，id是roleData的id
const handleCommand = (val, id) => {
  console.log('val', val, id)
  emit('handleCommand',val, id)
  //调接口
  // getList()
  // roleData.forEach(item => {
  //   if (item.id === id) {
  //     item.role = val
  //   }
  // })

}
//删除成员
const del = () => {
  ElMessageBox.confirm('确定要删除该成员吗?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '该成员已被删除！'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}
//退出操作
const exit = () => {}
//接收路由参数
const route = useRoute()
const id = route.query.id //我的题库页面点击题库名称时传过来的题库id
//删除题库
const router = useRouter()
const delQuestionBank = id => {
  console.log('id', id)
  ElMessageBox.confirm('确定要删除题库吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      fetchDeleteQuestionBank(id).then(res => {
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '题库已删除成功！'
          })
          router.push('/myQuestionBank')
        } else {
          ElMessage({
            type: 'error',
            message: res.msg
          })
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}
// const getUser = async () => {
//   let question_bank_id = id
//   console.log('question_bank_id',question_bank_id);
//   await fetchQuestionBankUser(question_bank_id).then(res => {
//   tableData=res.data|| []
//   })
// }
onMounted(() => {
  // getUser()
})
</script>

<style lang="scss" scoped>
// :deep(.el-input__wrapper) {
//     display: none !important;
// }

:deep(.example-showcase .el-dropdown-link) {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-dropdown {
  cursor: pointer;
  margin-top: 5px;
  margin-left: 10px;
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
