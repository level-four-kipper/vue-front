<template>
  <el-button @click="submitSelection">批量选择</el-button>
  <el-table 
    :data="props.data" 
    style="width: 100%" 
    :row-key="getRowKeys"
    @selection-change="handleSelectionChange"
    >
    <el-table-column :reserve-selection="true" type="selection" width="30" />
    <el-table-column prop="id" label="题库编号" width="200" align="center" />
    <el-table-column prop="icon" label="题库图标" width="200" align="center">
      <!-- <img :src="icon" alt="#"> -->
      <template #default="scope">
        <img style="height:50px;width:50px" :src="scope.row.icon" alt="error" />
      </template>
    </el-table-column>
    <el-table-column prop="name" label="题库名称" width="200" align="center" />
    <el-table-column prop="testCount" label="收录数量" width="200" align="center" />
    <el-table-column prop="describe" label="题库简介" width="400" align="center" />
    <!-- <el-table-column property="" sortable :sort-by="createTime" label="创建时间" width="200" /> -->
    <el-table-column label="操作" prop="operation" align="center">
      <template #default="scope">
        <el-button @click="select(scope.row.QsBankId)">选择</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import { onMounted, reactive,ref } from "vue";
import {useRouter,useRoute} from "vue-router"
import {ElMessage} from 'element-plus'
const props=defineProps({
  labels:Array,
  data:Object,
  paperName:String,//试卷名称
  paperDetail:String,//试卷简介
})
const router=useRouter();
const route=useRoute();
const QsBankSelection =reactive([]);//表格选中当前所有数据
let QsBankSelectList=reactive([])//表格选择题库的id数据
const selectNumber = ref('')//表格select选中的条数
onMounted(()=>{
  console.log(props.data.QsBankId,"QsBankId")
})

function getRowKeys(row){
  return row.QsBankId
}
// 获取多选框数据并且回显数据
function handleSelectionChange(rows){
  QsBankSelection.value=rows;
  console.log(QsBankSelection)
  selectNumber.value=QsBankSelection.value.length;
  QsBankSelectList=[];
  if(rows){
    rows.forEach((row)=>{
      if(row){
        QsBankSelectList.push(row.QsBankId)
      }
    })
  }
}

// 路由传单个题库id至试题选择页面
function select(QsBankId){
  console.log(QsBankId)
  if(props.paperName==''){
    // alert("试卷名称为空！")
    ElMessage({
      message:  '试卷名称为空！',
      type: 'error',
    })
  }else if(props.paperDetail==''){
    // alert("试卷简介为空！")
    ElMessage({
      message:  '试卷简介为空',
      type: 'error',
    })
  }else{
    router.push({
    name:'testSelect',
    query:{
      id:QsBankId,
      paperName:props.paperName,
      paperDetail:props.paperDetail,
      }
  })
  }
}

//路由传多个题库id至试题选择页面
function submitSelection(){
  console.log(props.paperName)
  console.log(props.paperDetail)
  if(props.paperName==''){
    // alert("试卷名称为空！")
    ElMessage({
      message:  '试卷名称为空！',
      type: 'error',
    })
  }else if(props.paperDetail==''){
    // alert("试卷简介为空！")
    ElMessage({
      message:  '试卷简介为空',
      type: 'error',
    })
  }else{
    if(QsBankSelection.value.length===0){
    // alert("选择题库为空")
    ElMessage({
      message:  '选择题库为空!',
      type: 'error',
    })
    }else{
    console.log(QsBankSelection)
    for(let i=0;i<QsBankSelection.value.length;i++){
      QsBankSelectList[i]=QsBankSelection.value[i].QsBankId;
    }
      //  console.log(selectList instanceof Array)
      //  let selectObj = JSON.stringify(selectList)
      router.push({
        name:"testSelect",
        query:{
          QsBankSelectList:QsBankSelectList,//题库数组
          paperName:props.paperName,
          paperDetail:props.paperDetail,
        }
      })
      console.log(route)
      // console.log('对象不为空')
    }
  }
  
}
</script>
<style scoped></style>
