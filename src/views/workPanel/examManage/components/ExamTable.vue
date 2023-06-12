<template>
  <el-table v-loading="loading" :data="data " height="434" style="width: 100%" @selection-change="handleSelectionChange" :default-sort="{ prop: 'createTime', order: 'descending' }">
    <el-table-column type="selection" width="55" />
    <el-table-column property="id" label="考试编号" width="200" align="center">
      <!-- <template #default="scope">{{ scope.row.id }}</template> -->
    </el-table-column>
    <el-table-column property="name" label="考试名称" align="center" />
    <el-table-column property="state" label="状态" width="300" align="center">
      <template #default="scope">
        <div class="exam-state">
          <el-tag size="large">{{scope.row.state}}</el-tag>
          <el-tag v-if="scope.row.publish" size="large" type="success">已发布</el-tag>
          <el-tag v-else size="large" type="warning">未发布</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column property="createTime" label="创建时间" width="200" align="center" />
    <el-table-column property="operate" label="操作" width="300" align="center">
      <template #default="scope">
        <div class="operate-list">
          <span :class="{'is-active':scope.row.publish} " @click="jumpEditExam(scope.row )">编辑</span>
          <span :class="{'is-active':scope.row.publish} " @click="deleteExam(scope.row)">删除</span>
          <span @click="jumpPaperDetail(scope.row.id)">查看试卷</span>
          <el-button type="primary" @click="publishExam(scope.row.id)" :disabled="scope.row.publish">发布 </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { reactive,ref } from "vue";
import {useRouter} from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  setSelectExamIds:Array,
  data:Object,
  loading:Boolean,
  deleteExam:Function,
  publishExam:Function

})

const router = useRouter()

function handleSelectionChange(rows){
  const ids=  rows.map(item => item.id )
  props.setSelectExamIds(ids)
}



function jumpEditExam(row){
  if(row.publish){
     ElMessage({
        message:  '考试已发布，不允许修改',
        type: 'error',
     })
  }else{
   router.push(`/workPanel/editExam/${row.id}`)
  }

}
function jumpPaperDetail() {
  router.push('./paperDetail')
}
</script>

<style scoped lang="scss">
.el-table__row{
  .operate-list{
     span{
      padding-right: 10px;
      color: #06f;
      cursor: pointer;
      &.is-active{
       color: #ccc;
       cursor: not-allowed;
      }
    }
  }
   .exam-state{
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        margin-left:10px;
        cursor: pointer;
      }

    }
}
</style>
