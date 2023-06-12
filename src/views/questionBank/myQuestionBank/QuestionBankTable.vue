<!-- 题库列表 -->
<template>
  <el-table :data="tableData" :default-sort="{ prop: 'gmt_created', order: 'descending' }" style="width: 100%" highlight-current-row v-loading="loading" @cell-click="questionBankClick">
    <!--type="selection"表格多选  -->
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="题库编号" prop="question_bank_number" align="center" />
    <el-table-column label="题库名称" prop="name" align="center">
      <template #default="scope">
        <span class="questionbank-name">{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column label="知识领域" prop="area" align="center" />
    <el-table-column label="可见性" prop="visibility" align="center" />
    <el-table-column label="试题总数" prop="total_questions" sortable :sort-by="total_questions" align="center" />
    <el-table-column label="创建时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" />
    <el-table-column label="操作" prop="operation" align="center">
      <template #default="scope" v-if="value">
        <span class="set" @click.stop="handleSet(scope.row)">配置</span>
        <span class="del" @click.stop="handleDelete(scope.row)">删除</span>
        <span class="edit" @click.stop="handleEdit(scope.row)">编辑</span>
      </template>
    </el-table-column>
  </el-table>
  <!--分页区域-->
  <el-pagination
    v-show="tableData.length>0"
    :current-page="queryInfo.pagenum"
    :page-size="queryInfo.pagesize"
    :page-sizes="[10,50,100,200]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
  </el-pagination>
</template>
<script setup name="QuestionBankTable">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
 defineProps({
  value: {
    type: String,
    default: ''
  },
  tableData: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['handleSizeChange', 'handleCurrentChange','handleDelete'])
const queryInfo = reactive({
  query: '', //查询参数
  pagenum: 1, //当前页码
  pagesize: 10, //每页显示条数,默认10条
  name: '' //题库名称
})
//监听每页条数改变的事件
function handleSizeChange(newSize) {
  console.log('ssss')
  queryInfo.pagesize = newSize
  emit('sizeChange', newSize)
}
//监听当前页改变的事件
function handleCurrentChange(newPage) {
  queryInfo.pagenum = newPage
  emit('currentChange', newPage)
}
const router = useRouter()
const questionBankClick = (row, column, cell, event) => {
  let id = row.id //id是点击题库名称时传的题库id
  console.log('........................', id)
  if (column.label === '题库名称') {
    router.push({
      path: '/clickQuestionBank',
      query: { id }
    })
  }
  console.log('id,row, column, cell, event', id, row, column, cell, event)
}
//配置
const handleSet = row => {
  let idSet = row.id //idSet是点击配置按钮时传的题库id
  router.push({
    path: '/clickQuestionBank?tab=0', //将题库设置的tab名传到题库设置页后把activeName设为题库设置的tab名
    query: { idSet }
  })
  // localStorage.setItem('type', '0')
}
//删除题库
const handleDelete = row => {
  let idDelete = row.id
  console.log('idDelete',idDelete);
  emit('deleteQuestionBank', idDelete)
}
//编辑题库
const handleEdit = row => {
  let idEdit = row.id //idEdit是点击编辑按钮时传的题库id
  router.push({
    path: '/addQuestionBank',
    query: { idEdit }
  })
  //  localStorage.setItem('type', '1')
}
// 暴露方法和属性给父（MyQuestionBank）组件
// defineExpose({queryInfo,tableData})
</script>
<style lang="scss" scoped>
:deep(.el-table_6_column_35) {
  cursor: pointer !important;
  user-select: none !important;
}
.el-pagination {
  margin-left: 60%;
  margin-top: 2%;
}
.questionbank-name {
  cursor: pointer;
  color: rgb(60, 12, 236);
}
.cell {
  span {
    margin-right: 15px;
    cursor: pointer;
    color: rgb(11, 52, 235);
  }
}
.el-pagination__total is-first {
  margin-right: 20px;
}
</style>
