<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%;"
    @selection-change="handleSelectionChange"
  >
    <!-- <el-table-column type="selection" width="55" /> -->
    <el-table-column label="名称" width="200">
        <template #default="scope">{{ scope.row.name }}</template>
    </el-table-column>
    <el-table-column property="charactor" label="角色" width="300" />
    <el-table-column property="employee_number" label="工号" width="200" />
    <el-table-column property="gmt_created" label="注册时间" width="550"  />
     <el-table-column label="操作" >
      <template #default="scope">
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >移出</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script name='UserTables' setup>
import { ref } from 'vue'
import { ElTable } from 'element-plus'
const props=defineProps({
  tableData:Array,
})
const emit=defineEmits()
const handleDelete = (index, row) => {
  emit('delete',row.id)
}

//表格数据
</script>
<style lang="scss" scoped>
</style>