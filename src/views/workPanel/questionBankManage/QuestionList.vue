<!-- 某一题库下的题目列表 -->
<template>
  <div class="">
    <el-button type="primary" @click="addTest">添加试题</el-button>
    <!-- <el-input placeholder="请输入关键字" v-model="queryInfo.query" clearable @clear="getQuestionBankList">
            <template #append>
                <el-button @click="getQuestionBankList"
                    ><el-icon><Search /></el-icon
                ></el-button>
            </template>
        </el-input> -->
    <el-input placeholder="请输入试题题干关键字" v-model="queryInfo.keywords" clearable>
      <template #prefix>
        <el-icon @click="search" class="el-input__icon"><Search /></el-icon>
      </template>
    </el-input>
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
      <el-table-column label="试题类型" prop="type" align="center" />
      <el-table-column label="试题难度" prop="difficulty" align="center" />
      <el-table-column label="试题题干" prop="title" show-overflow-tooltip="true" align="center" />
      <el-table-column label="添加时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" />
      <el-table-column label="操作" prop="operation" align="center">
        <template #default="scope">
          <span class="detail" @click.stop="clickTable(scope.row)">详情</span>
          <span class="del" @click.stop="delQuestion(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[10,20,30,40]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script setup name="QuestionList">
import { reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
// import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
//接收路由参数
const route = useRoute()
const id = route.query.id //我的题库页面点击题库名称时传过来的题库id
const addTest = () => {
  router.push({
    path: '/addQuestion',
    query: { id } //通过路由传题库id至添加试题页面
  })
}
defineProps({
  tableData: { type: Array, default: () => [] },
  total: { type: Number, default: 0 }
})
const emit = defineEmits(['search', 'handleCurrentChange', 'handleSizeChange', 'delQuestion'])
const queryInfo = reactive({
  query: '', //查询参数
  pagenum: 1, //当前页码
  pagesize: 10 //每页显示条数,默认10条
})
//搜索，传自定义事件给父组件
const search = keywords => {
  emit('search', keywords)
}
let expand = ref([]) //要展开的行
//点击展开行
const toogleExpand = row => {
  if (expand.value.includes(row.number)) {
    expand.value = expand.value.filter(val => val !== row.number)
  } else {
    expand.value.push(row.number)
  }
  console.log('row', row.number)
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
//删除试题
const delQuestion = row => {
  let idDelete = row.id
  console.log('idDelete', idDelete)
  emit('delQuestion', idDelete)
  // ElMessageBox.confirm('确定要删除试题吗?', 'Warning', {
  //   confirmButtonText: 'OK',
  //   cancelButtonText: 'Cancel',
  //   type: 'warning'
  // })
  //   .then(() => {
  //     ElMessage({
  //       type: 'success',
  //       message: '该试题已被删除！'
  //     })
  //   })
  //   .catch(() => {
  //     ElMessage({
  //       type: 'info',
  //       message: '已取消删除'
  //     })
  //   })
}
</script>

<style lang="scss" scoped>
.el-button {
  position: relative;
}
.el-input {
  position: absolute;
  width: 20%;
  margin-left: 72%;
  .el-input__icon {
    cursor: pointer;
  }
}
.detail {
  margin-right: 10px;
  cursor: pointer;
  color: rgb(11, 52, 235);
}
.del {
  margin-left: 10px;
  cursor: pointer;
  color: rgb(11, 52, 235);
}
.el-table {
  :deep(.el-table__expand-icon) {
    display: none !important;
  }
  .picture {
    width: 15px;
    margin-left: 20px;
    margin-top: 15px;
    cursor: pointer;
  }
}
.question-option {
  margin-right: 20px;
}

.el-pagination {
  margin-left: 62%;
  margin-top: 1%;
}
</style>