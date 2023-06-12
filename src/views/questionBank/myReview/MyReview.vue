<template>
  <div class="container">
    <div class="btn">
      <h2>我的审核</h2>
      <!-- <el-button type="primary" @click="goToAudit">开始审核</el-button> -->
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
        <!-- value="true"控制审核按钮的显示与隐藏 ，reason="true"控制拒绝原因字段的显示与隐藏, pass="true"控制开始审核按钮的显示与隐藏-->
        <el-tab-pane label="未审核" name="2"> <ReviewTable value="true" pass="true" :tableData="tableData" :total="total" @currentChange="getcurrentChange" @sizeChange="getsizeChange" /></el-tab-pane>
        <el-tab-pane label="已通过" name="1"> <ReviewTable :tableData="tableData" :total="total" @currentChange="getcurrentChange" @sizeChange="getsizeChange" /> </el-tab-pane>
        <el-tab-pane label="已拒绝" name="0">
          <ReviewTable reason="true" :tableData="tableData" :total="total" @currentChange="getcurrentChange" @sizeChange="getsizeChange" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="MyReview">
import ReviewTable from './ReviewTable.vue'
import { Search } from '@element-plus/icons-vue'
import { reactive, ref, onMounted, watch } from 'vue'
import { fetchQuestionReview } from '@/api/questionBank.js'
import { ElMessage } from 'element-plus'
const activeName = ref('2')
const handleClick = (tab, event) => {
  console.log(tab, event)
}
const tableData = ref([]) // 表格数据
const total = ref(0) //数据总条数
const queryInfo = reactive({
  pageSize: 10, //每页条数
  currentPage: 1, //当前页
  keywords: ''
})

// 根据关键字搜索
const search = () => {
  queryInfo.pageSize = 10
  queryInfo.currentPage = 1
  // 获取数据
  getList()
}
// tab切换时触发,每次切换tab时搜索框和分页数据都要恢复默认，并改变当前activeName：  activeName=0，1,2
const tabChange = val => {
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
      keywords: queryInfo.keywords,
      status_id: activeName.value
    }
  }
  //接口联调 查询我的审核
  await fetchQuestionReview(param)
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
})
</script>    
<style lang="scss" scoped>
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


