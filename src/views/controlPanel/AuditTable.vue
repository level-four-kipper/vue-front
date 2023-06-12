<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
  >
    <!-- <el-table-column type="selection" width="55" /> -->
    <el-table-column label="名称" width="200">
        <template #default="scope">{{ scope.row.name }}</template>
    </el-table-column>
    <el-table-column property="employee_number" label="工号" width="300" />
    <el-table-column property="audit_status" label="状态" width="300" />
    <el-table-column property="gmt_created" label="注册时间"  />
     <el-table-column label="操作" width="300" >
      <template #default="scope">
        <el-button
          size="small"
          @click="handleAudit(scope.$index, scope.row)"
          >审核</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script name='UserTables' setup>
import { reactive, ref } from 'vue'
import { ElTable } from 'element-plus'
import {useRouter} from 'vue-router'
 const props=defineProps({
   tableData:Array
 })
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const router=useRouter()
function handleAudit(index, row){
  //router.push({path:`./auditInformation/${row.id}`})
  //console.log(index,row.userId)
  //router.push({path:'./auditInformation',
    //          query:{id:row.id} } )
    router.push({name:'auditInformation',
                 params:{id:row.id} } )
}

</script>