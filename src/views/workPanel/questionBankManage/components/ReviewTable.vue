<template>
  <el-button type="primary" @click="goToAudit" v-show="pass">开始审核</el-button>
  <el-table
    :data="tableData"
    :default-sort="{ prop: 'gmt_created', order: 'descending' }"
    style="width: 100%"
    highlight-current-row
    v-loading="loading"
    @selection-change="handleSelectionChange"
    ref="refTable"
    @row-click="clickTable"
    height="500"
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
    <el-table-column label="收录题库" prop="question_bank_name" align="center" />
    <el-table-column label="试题题干" prop="title" show-overflow-tooltip="true" align="center" />
    <el-table-column label="拒绝原因" prop="reason" v-if="reason" show-overflow-tooltip="true" align="center" />
    <el-table-column label="添加时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" />
    <el-table-column label="操作" prop="operation" align="center">
      <template #default="scope">
        <span class="detail" @click.stop="clickTable(scope.row)">详情</span>
        <span class="audit" v-show="value" @click.stop="jumpPage(scope.row)">审核</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup name="ReviewTable">
import { reactive, ref } from 'vue'
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'


const props = defineProps({
  tableData:Object,
  loading:Boolean,
})
const router = useRouter()
let expand = ref([])
const toogleExpand = (row, column, event) => {
  if (expand.value.includes(row.id)) {
    expand.value = expand.value.filter(val => val !== row.id)
  } else {
    expand.value.push(row.id)
  }
  console.log('column,event', column, event)
}
const currentInstance = getCurrentInstance()
const clickTable = (row, index, e) => {
  currentInstance.ctx.$refs.refTable.toggleRowExpansion(row)
  console.log(index, e)
}

//审核
const jumpPage = row => {
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
