<!-- 试题列表 -->
<template>
  <el-table
    :data="tableData"
    :default-sort="{ prop: 'gmt_created', order: 'descending' }"
    style="width: 100%"
    highlight-current-row
    v-loading="loading"
    handleSelectionChange
    ref="testTable"
    @row-click="clickTable"
    height="500"
  >
    <el-table-column label="试题编号" prop="question_number" width="100" align="center">
      <template #default="scope">
        <span>{{scope.row.question_number}}</span>
        <img src="@/assets/img/questionBank/xiala.png" class="picture" @click="showExpand(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column type="expand" width="1" min-width="1">
      <template #default="props">
        <div class="expand-content">
          <h4>试题题干</h4>
          <div class="content test-title ">{{props.row.title}}</div>
          <h4>试题选项</h4>
          <div class="content test-option-list">
            <span v-for="(item,index) in props.row.option_vo_list" :key="index"> {{`${item.option}. ${item.content}`}}</span>
          </div>
          <h4>试题答案</h4>
          <div class="content test-answer">{{props.row.answer}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="收录题库" prop="question_bank_name" align="center" />
    <el-table-column label="题目类型" prop="type" align="center">
      <template #default="props">
        {{ questionType[props.row.type].name}}
      </template>
    </el-table-column>

    <el-table-column v-if="value==='test'" label="状态" prop="status" align="center" />
    <el-table-column label="试题题干" prop="title" show-overflow-tooltip="true" align="center" />
    <el-table-column label="添加时间" prop="gmt_created" sortable :sort-by="gmt_created" align="center" />
    <el-table-column label="操作" prop="operation" align="center">
      <template #default="scope">
        <div class="operate-list">
          <span @click.stop="showExpand(scope.row )" class="detail">详情</span>
          <span @click.stop="JumpEditQs(scope.row)" class="edit">编辑</span>
          <span @click.stop="deleteQuestion(scope.row)" class="delete">删除</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup name="TestTable">
import { reactive, ref } from 'vue'
import {questionType} from '@/views/workPanel/data.js'
import { useRouter } from 'vue-router'
const props = defineProps({
  tableData:Object,
  loading:Boolean,
  deleteQuestion:Function,
})

const router = useRouter()
const testTable = ref(null)

//展开和折叠行
const showExpand = row => {
 testTable.value.toggleRowExpansion(row)
}
const JumpEditQs = row => {
  router.push('/workPanel/editTest/'+row.id)
}
</script>

<style lang="scss" scoped>
.el-table {
  :deep(.el-table__expand-icon) {
    display: none !important;
  }
  .el-table__expanded-cell{
    .expand-content{
      padding: 10px 20px;
    h4{
        color: #333;
        font-weight: 700;
        // margin-bottom: 20px;
      }
      .content{
        margin-top: 10px;
        &:not(:last-child){
          margin-bottom: 14px;
        }
      }
      .test-option-list{
        span{
          margin-right: 20px;
        }
      }
    }

  }
  .cell {
    .picture {
      margin-left: 20px;
      cursor: pointer;
    }
    .operate-list{
      span {
      color: rgb(30, 14, 243);
      cursor: pointer;
      margin-right: 10px;

    }
}
}



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
