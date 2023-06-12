<!-- 我的题库 -->
<template>
  <div class="container">
    <div class="btn">
      <h2>我的题库</h2>
      <el-button type="primary" @click="addQuestionBank">创建题库</el-button>
    </div>

    <div class="tabs">
      <div class="search">
        <!-- @change当输入框失焦的时候触发   @input是输入框发生变化时触发，也就是输入框一动就出触发了 -->
        <el-input placeholder="请输入题库名称关键字" v-model="queryInfo.keywords" clearable>
          <template #prefix>
            <el-icon @click="search" class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <!-- tab-click tab被选中时触发    tab-change	activeName改变时触发 -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" @tab-change="tabChange">
        <el-tab-pane label="全部" name="0"><QuestionBankTable :tableData="tableData" :total="total" @currentChange="getcurrentChange" @sizeChange="getsizeChange" /></el-tab-pane>
        <el-tab-pane label="由我创建" name="1"
          ><QuestionBankTable value="test" :tableData="tableData" :total="total" @currentChange="getcurrentChange" @deleteQuestionBank="deleteQuestionBank" @sizeChange="getsizeChange"
        /></el-tab-pane>
        <el-tab-pane label="我参与的" name="2"><QuestionBankTable :tableData="tableData" :total="total" @currentChange="getcurrentChange" @sizeChange="getsizeChange" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="QuestionBank">
import QuestionBankTable from './QuestionBankTable.vue'
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, watch,onUnmounted } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { fetchQuestionBank } from '@/api/questionBank.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchDeleteQuestionBank } from '@/api/questionBank.js'
const activeName = ref('0') // tabs标签页默认选中第一个
let tableData = ref([]) // 表格数据
const total = ref(0) //数据总条数
const queryInfo = reactive({
  pageSize: 10, //每页条数
  currentPage: 1, //当前页
  keywords: '',
  gmt_created: ''
})
const handleClick = (tab, event) => {
  console.log(tab, event)
}
const router = useRouter()
function addQuestionBank() {
  router.push('/addQuestionBank')
}
//接收路由参数
const route = useRoute()
const activeTab = route.query.tab //在新增题库页面点击取消按钮时路由传‘由我创建’的tabName
activeName.value = activeTab //当前tab名等于传过来的tab
// 根据关键字搜索
const search = () => {
  queryInfo.pageSize = 10
  queryInfo.currentPage = 1
  // 获取数据
  getList()
}
// tab切换时触发,每次切换tab时搜索框和分页数据都要恢复默认，并改变当前activeName：  activeName=0，1,2
const tabChange = val => {
  localStorage.setItem('type', activeName.value) //将tab标签名存储到type字段， 以键值对key:value的形式存储到本地
  queryInfo.keywords = ''
  activeName.value = val
  queryInfo.pageSize = 10
  queryInfo.currentPage = 1
  // 获取数据
  getList()
}
// 当前页切换，获取数据
const getcurrentChange = val => {
  queryInfo.currentPage = val
  // 获取数据
  getList()
}
// 条数切换，获取数据
const getsizeChange = val => {
  queryInfo.pageSize = val
  // 获取数据
  getList()
}
watch(activeName, () => getList())
// 获取表格数据接口    async 用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成
const getList = async () => {
  const param = {
    curr_page: queryInfo.currentPage, //当前页
    page_size: queryInfo.pageSize, //每页数据
    sidx: queryInfo.gmt_created, //排序字段-创建时间
    
    entity: {
      query_condition: activeName.value,
      keywords: queryInfo.keywords,
    }
  }
  //接口联调 分页查询题库
  await fetchQuestionBank(param)
    .then(res => {
      total.value = res.data.total_count || 0
      tableData.value = res.data.list || []
      console.log('res.data', res.data)
      if (res.code !== 0) {
        ElMessage({
          message: '获取题库数据失败！',
          type: 'error'
        })
      }
    })
    .catch(err => {
      console.log('err', err)
      ElMessage({
        message: err,
        type: 'error'
      })
    })
}
// 从子组件传过来的自定义事件的方法，删除题库
const deleteQuestionBank = idDelete => {
  ElMessageBox.confirm('是否确定删除该题库？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      fetchDeleteQuestionBank(idDelete).then(res => {
        console.log('res', res)
        const index = tableData.value.findIndex(function (item) {
          return item.id == idDelete
        })
        tableData.value.splice(index, 1)
        total.value = total.value - 1
        console.log('total.value', total.value)
        console.log('tableData.value', tableData.value)
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '删除题库成功!'
          })
        } else {
          ElMessage({
            type: 'error',
            message: '删除题库失败!'
          })
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消!'
      })
    })
}
onMounted(() => {
  getList()
  const type = localStorage.getItem('type') //获取tab标签名
  type && (activeName.value = type)
})
onUnmounted(() => {
  localStorage.removeItem('type') //删除存储在本地的tab标签名
})
</script>

<style lang="scss" scoped>
// Tabs标签页样式
.demo-tabs {
  .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
}
.container {
  height: 100%;
  .btn {
    margin: 30px 30px 30px;
    display: flex;
    justify-content: space-between;
  }
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


