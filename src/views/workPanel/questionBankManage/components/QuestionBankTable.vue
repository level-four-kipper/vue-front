<!-- 题库列表 -->
<template>
  <el-table :data="tableData" v-loading="loading" :default-sort="{ prop: 'gmt_created', order: 'descending', prop: 'gmt_created', order: 'descending' , }" height="500" style="width: 100%" highlight-current-row>
    <el-table-column label="题库编号" prop="question_bank_number" align="center" width="100" />
    <el-table-column label="题库名称" prop="name" align="center" show-overflow-tooltip="true">
      <template #default="scope">
        <span class="questionbank-name" @click.stop="jumpSetQsBank(scope.row)">{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column label="知识领域" prop="area" align="center" width="80" />
    <el-table-column label="可见性" prop="visibility" align="center" width="80">
      <template #default="scope">
        {{scope.row.visibility?'公开':'私有'}}
      </template>
    </el-table-column>
    <el-table-column label="试题总数" prop="total_questions" sortable :sort-by="total_questions" align="center" width="120" />
    <el-table-column label="创建时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" width="200" />
    <el-table-column label="操作" prop="operation" align="center" width="200">
      <template #default="scope">
        <span class="set" @click.stop="jumpSetQsBank(scope.row)">配置</span>
        <span class="del" @click.stop="deleteQsBank(scope.row)">删除</span>
        <span class="edit" @click.stop="handleEdit(scope.row)">编辑</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  tableData:Object,
  loading:Boolean,
  deleteQsBank:Function,

})

const router = useRouter()

//跳转题库设置
const jumpSetQsBank = (row ) => {
  router.push ('/workPanel/setQuestionBank/'+row.id)
}

//编辑题库
const handleEdit = row => {
              router.push( '/workPanel/editQuestionBank/'+row.id)
}
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
