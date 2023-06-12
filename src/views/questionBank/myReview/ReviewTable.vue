<template>
  <!-- :default-sort="{ prop: 'date', order: 'descending' }根据时间排序 -->
  <!-- 数据表格 -->
  <el-button type="primary" @click="goToAudit" v-show="pass">开始审核</el-button>
  <el-table
    :data="tableData"
    :default-sort="{ prop: 'date', order: 'descending' }"
    style="width: 100%"
    highlight-current-row
    v-loading="loading"
    @selection-change="handleSelectionChange"
    ref="refTable"
    @row-click="clickTable"
  >
    <!--type="selection"表格多选  -->
    <el-table-column type="selection" width="55" align="center" />
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
    <el-table-column label="收录题库" prop="type" align="center" />
    <el-table-column label="试题题干" prop="title" show-overflow-tooltip="true" align="center" />
    <el-table-column label="拒绝原因" prop="reason" v-if="reason" show-overflow-tooltip="true" align="center" />
    <el-table-column label="添加时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" />
    <el-table-column label="操作" prop="operation" align="center">
      <template #default="scope">
        <span class="detail" @click.stop="clickTable(scope.row)">详情</span>
        <span class="audit" v-show="value" @click.stop="audit(scope.row)">审核</span>
      </template>
    </el-table-column>
  </el-table>
  <!--分页区域-->
  <el-pagination
    v-show="tableData.length>0"
    :current-page="queryInfo.pagenum"
    :page-size="queryInfo.pagesize"
    :page-sizes="[10,50,100,200]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
  </el-pagination>
  <pagination></pagination>
</template>
<script setup name="ReviewTable">
import { reactive, ref } from 'vue'
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const loading=ref(true)
defineProps({
  value: { //控制审核按钮的显示与隐藏
    type: Boolean,
    default: false
  },
  reason: { //控制拒绝原因字段的显示与隐藏
    type: Boolean,
    default: false
  },
  pass: { //控制开始审核按钮的显示与隐藏
    type: Boolean,
    default: false
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
const emit = defineEmits(['handleSizeChange', 'handleCurrentChange'])
const queryInfo = reactive({
  query: '', //查询参数
  pagenum: 1, //当前页码
  pagesize: 10, //每页显示条数,默认10条
  name: '' //题库名称
})
let expand = ref([]) //要展开的行
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
const currentInstance = getCurrentInstance()
//执行点击行调用的方法，展开和折叠行
const clickTable = (row, index, e) => {
  currentInstance.ctx.$refs.refTable.toggleRowExpansion(row)
  console.log(index, e)
}
//监听pagesize改变的事件
const handleSizeChange = newSize => {
  queryInfo.pagesize = newSize
  emit('sizeChange', newSize)
}
//监听页码值改变的事件
const handleCurrentChange = newPage => {
  queryInfo.pagenum = newPage
  emit('currentChange', newPage)
}
//审核
const router = useRouter()
const audit = row => {
  let id = row.id
  router.push({
    path: '/audit',
    query: { id }
  })
}
const questionSelection = reactive([])
const selectNumber = ref('')//表格select选中的条数
// 获取多选框数据并且回显数据
const handleSelectionChange = val => {
  questionSelection.value = val
  selectNumber.value=questionSelection.values.length
  questionSelectionList = []
  if(val){
    val.forEach(row => {
      if(row) questionSelectionList.push(row.id)
    });
  }
}
//传已勾选的试题id至试题审核页面
let questionSelectionList = reactive([])
const goToAudit = () => {
  if (Object.keys(questionSelection).length === 0) {
     ElMessage({
            type: 'error',
            message: '您当前选择的试题为空,请先勾选要审核的试题哦！！！'
          })
    // alert('您当前选择的试题为空,请先勾选要审核的试题哦！！！')
  } else {
    // console.log(questionSelection)
    for (let i = 0; i < questionSelection.value.length; i++) {
      questionSelectionList[i] = questionSelection.value[i].question_id
      console.log('questionSelectionList........', questionSelectionList)
    }
    let question_id = questionSelectionList //已勾选的试题id
    router.push({
      path: 'doAudit',
      query: { question_id }
    })
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  :deep(.el-table__expand-icon) {
    display: none !important;
  }
}
.picture {
  width: 15px;
  margin-left: 20px;
  margin-top: 15px;
  cursor: pointer;
}
.el-pagination {
  margin-left: 60%;
  margin-top: 2%;
}
.detail {
  margin-right: 10px;
  cursor: pointer;
  color: rgb(11, 52, 235);
}
.audit {
  margin-left: 10px;
  cursor: pointer;
  color: rgb(11, 52, 235);
}
</style>
