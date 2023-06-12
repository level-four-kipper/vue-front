<template>
  <div class="container">
    <!-- <el-input style="width=200px" placeholder="请输入关键字" v-model="queryInfo.query" clearable @clear="getQuestionBankList">
      <template #append>
        <el-button style="width=100px" @click="getQuestionBankList"
          ><el-icon style="width=100px"><Search /></el-icon
        ></el-button>
      </template>
    </el-input> -->
    <el-table :data="tableData">
      <el-table-column label="考生编号" prop="id" align="center" width="100px" />
      <el-table-column label="考生姓名" prop="name" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="danger" @click="deleteExaminee(scope.row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
      :current-page="queryInfo.pageNum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[10,20,30,40]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script setup name="ExamineeTable">

import { reactive } from "vue";
// import {Search} from '@element-plus/icons-vue'
// import {getCurrentInstance} from 'vue'

function deleteExaminee(id){
  console.log(id)
}
const tableData = reactive([
  {
    id: '1',
    name:'张三'
  },
    {
    id: '2',
    name:'李四'
  },
    {
    id: '3',
    name:'王五'
  },
    {
    id: '4',
    name:'小红'
  },
  {
    id: '5',
    name:'小明'
  }
])
const queryInfo = reactive({
  query: '', //查询参数
  pageNum: 1, //当前页码
  pagesize: 10 //每页显示条数,默认10条
})


async function  getQuestionBankList() {
    // const { data: res } = await http.get('http://localhost:3000/clickQuestionBank',{
    //     params: this.queryInfo
    // })
    // if(res.meta.status !==200)
    //     return this.$message.console.error('获取题库列表失败')
    // tableData = res.data.questionBank
    // total.value = res.data.total
    // console.log(res);
}
//监听pagesize改变的事件
function handleSizeChange(newSize) {
    queryInfo.pagesize = newSize
    getQuestionBankList()
}
//监听页码值改变的事件
function handleCurrentChange(newPage) {
    queryInfo.pageNum = newPage
    getQuestionBankList()
}
</script>

<style lang="scss" scoped>
.container{
//   position: absolute;
}
.el-input {
    position:relative;
    display: inline-flex;
    width: 15%;
    box-sizing: border-box;
    vertical-align: middle;
    z-index: 999;
}
</style>
