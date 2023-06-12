<template>
  <div class="container">
    <el-input style="width:200px" placeholder="请输入关键字" v-model="queryInfo.query" clearable @clear="getQuestionBankList">
      <template #append>
        <el-button style="width:100px" @click="getQuestionBankList"
          ><el-icon style="width:100px"><Search /></el-icon
        ></el-button>
      </template>
    </el-input>
    <!-- .slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize) -->
    <el-table
      :data="data"
      :default-sort="{ prop: 'date', order: 'descending' }"
      style="width: 100%"
      height="400"
      highlight-current-row
      v-loading="loading"
      @selection-change="handleSelectionChange"
      ref="refTable"
      @row-click="clickTable"
      :row-style="tableRowStyle"
      row-key="id"
    >
      <!--type="selection"表格多选  -->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand" width="1" min-width="1" class="expand-col">
        <template #default="props">
          <el-form>
            <el-form-item label="试题题干">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="试题选项">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="试题答案">
              <span>{{ props.row.title }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="试题编号" prop="id" align="center" width="100px" />
      <el-table-column label="试题类型" prop="type" align="center" />
      <el-table-column label="试题难度" prop="level" align="center" />
      <el-table-column label="试题题干" prop="title" align="center" />
      <el-table-column label="创建时间" prop="date" align="center" />
      <el-table-column label="操作" prop="operation" align="center">
        <el-button type="primary" :icon="Edit" @click="handleDetail(scope.row)">详情</el-button>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <!-- <el-pagination
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[10,20,30,40]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination> -->
  </div>
</template>

<script setup>
// import {} from ''
// import {defineProps} from 'vue'
import { reactive } from "vue";
import {Search} from '@element-plus/icons-vue'
import {getCurrentInstance} from 'vue'
// import Pagination from "../Pagination.vue"
// import { useRouter } from "vue-router"
// import {http} from '@utils/http.js'
// const router = useRouter()

// defineProps({
//   data:Object
//     // default:[1]
// })
// function handleSelectionChange(selection,row){
//   console.log('selection,row')
// }
// const tableData=reactive({
//   selectList:[],
// })
// function handleSelectionChange(val){
//   this.tableData.selectList=val;
// }
const queryInfo = reactive({
  query: '', //查询参数
  pagenum: 1, //当前页码
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
// function handleSizeChange(newSize) {
//     queryInfo.pagesize = newSize
//     getQuestionBankList()
// }
// //监听页码值改变的事件
// function handleCurrentChange(newPage) {
//     queryInfo.pagenum = newPage
//     getQuestionBankList()
// }
const currentInstance = getCurrentInstance()
function clickTable(row,index,e){
               currentInstance.ctx.$refs.refTable.toggleRowExpansion(row)
               console.log(index,e);
            }
</script>

<style lang="scss" scoped>

.el-input {
    position:relative;
    display: inline-flex;
    width: 15%;
    box-sizing: border-box;
    vertical-align: middle;
    z-index: 999;
}
</style>
