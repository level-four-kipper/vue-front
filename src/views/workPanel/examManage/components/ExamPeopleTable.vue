<template>
  <el-table :data="data " style="width: 100%" @selection-change="handleSelectionChange" :default-sort="{ prop: 'add_time', order: 'descending' }">
    <el-table-column property="userName" label="成员" width="200" align="center">
      <!-- <template #default="scope">{{ scope.row.userId }}</template> -->
    </el-table-column>
    <el-table-column property="roleId" label="角色" width="200" align="center">
      <template #default="select">
        <el-select v-model="select.row.roleId" placeholder="请选择" @change="updateTableData('roleId',select.row.roleId, select.row)">
          <el-option v-for="(item,index) in roleList " :label="item.label" :value="item.value" :key="index" />
        </el-select>
      </template>
    </el-table-column>

    <el-table-column property="add_time" label="添加时间" align="center" />
    <el-table-column property="operate" label="操作" width="300" align="center">
      <template #default="scope">
        <span @click="deleteTableData(scope.row )">删除</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { reactive,ref } from "vue";
import {useRouter} from 'vue-router'
const props= defineProps({
  data:Object,
  deleteExam:Function,
  deleteTableData:Function,
  updateTableData:Function,

})
const roleList =[{  value:1, label:'阅卷人' },  {  value:2, label:'监考人' }]

// const roleId = ref('')
</script>

<style scoped lang="scss">
.el-table__row{
  .cell{
    .el-select{
      width: 120px;
      border: none;
      :deep(.el-input__wrapper){
        box-shadow:none !important   ;
        outline: none;
      }

    }
    span{
      color: #06f;
      cursor: pointer;
    }
  }
}
</style>
