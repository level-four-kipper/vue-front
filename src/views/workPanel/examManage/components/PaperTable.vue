<template>
  <el-table :data="data" style="width: 100%" height="434" @selection-change="handleSelectionChange" @cell-click="testDetailClick" :default-sort="{ prop: 'createTime', order: 'descending' }">
    <el-table-column type="selection" width="55" />
    <el-table-column property="id" label="试卷编号" width="200" align="center">
      <!-- <template #default="scope">{{ scope.row.id }}</template> -->
    </el-table-column>
    <el-table-column property="name" label="试卷名称" width="200" align="center">
      <template #default="scope">
        <span class="paper-name">{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column property="status" label="状态" align="center" />
    <el-table-column property="createTime" label="创建时间" width="200" />
    <!-- <el-table-column property="operate" label="操作" width="150" /> -->
    <el-table-column label="操作" prop="operate" width="150">
      <template #default="scope">
        <span @click="editPaper(scope.row.paperId)">编辑</span>
        <span @click="deletePaper(scope.row.paperId)">删除</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
// import { reactive } from "vue";
import {useRouter} from "vue-router"
import {ElMessage} from 'element-plus'
defineProps({
  data:Object,
  loading:Boolean,
  deletePaper:Function,
})
//console.log(props.data,'data')
//试卷详情
const router=useRouter();
function testDetailClick(row,column) {
  let paperId=row.paperId
  if(column.label === '试卷名称') {
      router.push({
        path:'/workPanel/paperDetail',
        query:{paperId}
      })
  }

}

//编辑试卷
function editPaper(id){
  router.push("/workPanel/testSelect")
}
</script>

<style lang="scss" scoped>
.paper-name{
  cursor: pointer;
  color: rgb(60, 12, 236);
}
.el-table__row{
  .cell{
    span{
      padding-right: 10px;
      color: #06f;
      cursor: pointer;
    }
  }
}
</style>
