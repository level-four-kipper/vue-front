<!-- 我的题目页面-->
<template>
  <div class="container">
    <div class="btn">
      <h2>我的题目</h2>
      <el-button type="primary" @click="addTest">添加题目</el-button>
    </div>

    <div class="tabs">
      <div class="search">
        <el-input placeholder="请输入试题题干关键字" v-model="queryInfo.keywords" clearable>
          <template #prefix>
            <el-icon @click="search" class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <!-- tab-click tab被选中时触发    tab-change	activeName改变时触发 -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" @tab-change="tabChange">
        <el-tab-pane label="全部" name="3"><TestTable value="test" :tableData="tableData" :total="total" @sizeChange="getsizeChange" @currentChange="getcurrentChange" /></el-tab-pane>
        <el-tab-pane label="审核中" name="2"> <TestTable :tableData="tableData" :total="total" @sizeChange="getsizeChange" @currentChange="getcurrentChange" /></el-tab-pane>
        <el-tab-pane label="已通过" name="1"> <TestTable :tableData="tableData" :total="total" @sizeChange="getsizeChange" @currentChange="getcurrentChange" /></el-tab-pane>
        <el-tab-pane label="已拒绝" name="0"><TestTable :tableData="tableData" :total="total" @sizeChange="getsizeChange" @currentChange="getcurrentChange" /> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup name="MyTest">
import TestTable from './TestTable.vue'
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchQuestionMy } from '@/api/questionBank.js'
import { ElMessage } from 'element-plus'
const activeName = ref('3')
const handleClick = (tab, event) => {
  console.log(tab, event)
}

const router = useRouter()
function addTest() {
  router.push('/addTest')
}
const tableData = ref([]) // 表格数据
const total = ref(0) //数据总条数
const queryInfo = reactive({
  pageSize: 10, //每页条数
  currentPage: 1, //当前页
  keywords: '',
  gmt_created: ''
})
const search = () => {
  queryInfo.pageSize = 10
  queryInfo.currentPage = 1
  // 获取数据
  getList()
}
// tab切换时触发,每次切换tab时搜索框和分页数据都要恢复默认，并改变当前activeName：  activeName=0，1,2
const tabChange = val => {
  activeName.value = val
  queryInfo.keywords = ''
  queryInfo.pageSize = 10
  queryInfo.currentPage = 1
  getList()
}
const getsizeChange = val => {
  queryInfo.pageSize = val
  getList()
}
const getcurrentChange = val => {
  queryInfo.currentPage = val
  getList()
}
const getList = async () => {
  const param = {
    curr_page: queryInfo.currentPage, //当前页
    page_size: queryInfo.pageSize, //每页数据
    sidx: queryInfo.gmt_created, //排序字段-创建时间
    entity: {
      keywords: queryInfo.keywords,
      status_id: activeName.value
    }
  }
  //接口联调 查询我的试题
  await fetchQuestionMy(param)
    .then(res => {
      total.value = res.data.total_count || 0
      tableData.value = res.data.list || []
      console.log('res.data', res.data)
      if (res.code !== 0) {
        ElMessage({
          message: '获取试题数据失败！',
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
onMounted(() => {
  getList()
  console.log('activeName.value', typeof activeName.value)
})
</script>
<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.container .btn {
  margin: 30px 30px 30px;
  display: flex;
  justify-content: space-between;
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