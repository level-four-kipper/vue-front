<!-- 试题列表 -->
<template>
  <!-- :default-sort="{ prop: 'date', order: 'descending' }根据时间排序 -->
  <!-- 数据表格 -->
  <el-table
    :data="tableData"
    :default-sort="{ prop: 'date', order: 'descending' }"
    style="width: 100%"
    highlight-current-row
    v-loading="loading"
    handleSelectionChange
    ref="refTable"
    @row-click="clickTable"
  >
    <!--type="selection"表格多选  -->
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column type="expand" width="1" min-width="1" class="expand-col">
      <template #default="props">
        <el-form>
          <el-form-item label="试题题干">
            <span>{{ props.row.title }}</span>
          </el-form-item>
          <!-- 单选题、多选题 -->
          <el-form-item label="试题选项" v-if="props.row.type=='单选题' || props.row.type=='多选题' ">
            <span class="question-option" v-for="(item,index) in props.row.option_vo_list" :key="index">{{item.option}}.{{ item.content }}</span>
          </el-form-item>
          <el-form-item label="试题答案" v-if="props.row.type=='单选题' || props.row.type=='多选题' || props.row.type=='判断题'">
            <span>{{ props.row.answer }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="试题编号" prop="question_number" width="100" align="center">
      <template #default="scope">
        <span>{{scope.row.question_number}}</span>
        <img src="@/assets/img/questionBank/xiala.png" class="picture" @click="toogleExpand(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column label="收录题库" prop="question_bank_name" align="center" />
    <el-table-column v-if="value==='test'" label="状态" prop="status" align="center" />
    <el-table-column label="试题题干" prop="title" show-overflow-tooltip="true" align="center" />
    <el-table-column label="添加时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" />
    <el-table-column label="操作" prop="operation" align="center">
      <template #default="scope">
        <span @click.stop="clickTable(scope.row,$event)" class="detail">详情</span>
        <span @click.stop="handleEdit(scope.row)" class="edit">编辑</span>
      </template>
    </el-table-column>
  </el-table>
  <!--分页区域-->
  <el-pagination
    v-show="tableData.length>0"
    :current-page="queryInfo.pagenum"
    :page-size="queryInfo.pagesize"
    :page-sizes="[10,20,30,40]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
  </el-pagination>
</template>
<script setup name="TestTable">
import { reactive, ref } from 'vue'
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
defineProps({
  tableData: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  value: { type: String, default: '' }
})
const emits = defineEmits(['handleSizeChange', 'handleCurrentChange'])
let expand = ref([]) //要展开的行
const queryInfo = reactive({
  query: '', //查询参数
  pagenum: 1, //当前页码
  pagesize: 10, //每页显示条数,默认10条
  type: ''
})
//监听pagesize改变的事件
const handleSizeChange = newSize => {
  queryInfo.pagesize = newSize
  emits('sizeChange', newSize)
}
//点击展开行
const toogleExpand = (row, column, event) => {
  if (expand.value.includes(row.id)) {
    expand.value = expand.value.filter(val => val !== row.id)
  } else {
    expand.value.push(row.id)
  }
  console.log('column,event', column, event)
}
//getCurrentInstance方法返回了当前的实例对象
// const currentInstance = getCurrentInstance()
const { proxy } = getCurrentInstance()
//执行点击行调用的方法，展开和折叠行
const clickTable = row => {
  proxy.$refs.refTable.toggleRowExpansion(row)
  console.log(row)
}

//监听页码值改变的事件
const handleCurrentChange = newPage => {
  queryInfo.pagenum = newPage
  emits('currentChange', newPage)
}
//详情
// const router = useRouter()
// function show() {
//   router.push('/testDetail')
// }

const router = useRouter()
//编辑题目
const handleEdit = row => {
  let idEdit = row.id //idEdit是点击编辑按钮时传的题目id
  router.push({
    path: '/addTest',
    query: { idEdit }
  })
}
</script>

<style lang="scss" scoped>
.detail {
  color: rgb(30, 14, 243);
  cursor: pointer;
}
.cell {
  .edit {
    margin-left: 20px;
    cursor: pointer;
    color: rgb(11, 52, 235);
  }
  .picture {
    margin-left: 20px;
    cursor: pointer;
  }
}
.el-table {
  :deep(.el-table__expand-icon) {
    display: none !important;
  }
}
.el-pagination {
  margin-left: 60%;
  margin-top: 2%;
}
.picture {
  width: 15px;
  margin-left: 20px;
  margin-top: 15px;
  cursor: pointer;
}
.question-option {
  margin-right: 20px;
}
</style>
