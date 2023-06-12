<!-- 点击某一题库之后跳转到的页面 -->
<template>
  <div class="container">
    <div class="header">
      <h2>试题选择</h2>
      <el-button style="margin-left:auto" type="primary" @click="dialogTableVisible=true">试题提交</el-button>
      <el-dialog v-model="dialogTableVisible" title="已选试题">
        <el-table :data="multipleSelection.value">
          <el-table-column label="试题类型" prop="type" align="center" />
          <el-table-column label="试题难度" prop="level" align="center" />
          <el-table-column label="试题题干" prop="title" align="center" />
          <el-table-column label="创建时间" prop="date" align="center" />
          <el-table-column label="操作" prop="" align="center">
            <template #default="scope">
              <span type="primary" @click="handleDelete(scope.row)">移除</span>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="submit"> 确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 题库试题表单 -->
    <div class="below">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="题目列表" name="first">
          <!-- <TestTable :data="tableData" /> -->
          <div class="container">
            <el-input style="width:300px" placeholder="请输入关键字" v-model="searchName" clearable @clear="getTestList">
              <template #append>
                <el-button style="width:50px" @click="searchTest"
                  ><el-icon style="width:20px"><Search /></el-icon
                ></el-button>
              </template>
            </el-input>
            <!-- :default-sort="{ prop: 'date', order: 'descending' }"
              style="width: 100%"
              height="400"
              highlight-current-row
              v-loading="loading"
              @selection-change="handleSelectionChange"
              ref="refTable"
              @row-click="clickTable"
              :row-style="tableRowStyle" -->
            <el-table
              :data="tableData"
              :default-sort="{ prop: 'date', order: 'descending' }"
              style="width: 100%"
              highlight-current-row
              v-loading="loading"
              @selection-change="handleSelectionChange"
              ref="refTable"
              @row-click="clickTable"
              :row-style="tableRowStyle"
              :row-key="getRowKeys"
             >
              <!--type="selection"表格多选  -->
              <el-table-column type="selection" :reserve-selection="true" width="55" align="center" />
              <el-table-column type="expand" width="1" min-width="1" class="expand-col">
                <template #default="props">
                  <el-form>
                    <el-form-item label="试题题干：">
                      <span>{{ props.row.title }}</span>
                    </el-form-item>
                    <el-form-item label="试题选项：" v-if="props.row.type=='单选题'||props.row.type=='多选题' ">
                      <span class="question-option" v-for="(item,index) in props.row.option" :key="index"> {{item.option}}.{{item.content}} </span>
                    </el-form-item>
                    <el-form-item label="试题答案：" v-if="props.row.type=='单选题' ||props.row.type=='多选题'||props.row.type=='判断题'">
                      <span>{{ props.row.answer }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="试题编号" prop="id" align="center" width="100px" />
              <el-table-column label="试题类型" prop="type" align="center" />
              <el-table-column label="试题难度" prop="level" align="center" />
              <el-table-column label="试题题干" prop="title" align="center" />
              <el-table-column label="创建时间" prop="date" align="center" />
              <el-table-column label="操作" align="center">
                <span type="primary" @click="handleDetail(scope.row)">详情</span>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        v-model:current-page="curPage "
        v-model:page-size="curPageSize"
        :page-sizes="[10, 20, 30, 40]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next  "
        :total="total"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref,reactive,onMounted } from 'vue'
import { useRouter,useRoute } from "vue-router"
import {Search} from '@element-plus/icons-vue'
import {getCurrentInstance} from 'vue'
import {fetchTest} from '@/api/paper.js'
import {ElMessage} from 'element-plus'

// import {http} from '@utils/http.js'
const router = useRouter()
const route = useRoute()

const loading=ref(true)
const curPageSize = ref(10)
const curPage  = ref(1)
const searchName = ref('')
const total = ref(0)
const tableData  =ref([])

const QsBankIdList=ref([])//题库列表id

const multipleSelection =reactive([]);//表格选中当前所有数据
let testSelectList=reactive([])//表格选择题库的id数据
const selectNumber = ref('')//表格select选中的条数

function getRowKeys(row){
  return row.id
}

// 获取多选框数据并且回显数据
function handleSelectionChange(rows){
  multipleSelection.value=rows;
  console.log(multipleSelection)
  selectNumber.value=multipleSelection.value.length;
  testSelectList=[];
  if(rows){
    rows.forEach((row)=>{
      if(row){
        testSelectList.push(row.id)
      }
    })
  }
}
//试题详情
const currentInstance = getCurrentInstance()
function clickTable(row,index,e){
    currentInstance.ctx.$refs.refTable.toggleRowExpansion(row)
  console.log(index,e);
}
onMounted(()=>{
  
  getTestList()
})
//分页显示数据
function onPageChange(value) {
 curPage .value = value
 getTestList()
}
function onPageSizeChange(value){
 curPageSize.value = value
 curPage.value = 1
 getTestList()
}

function searchTest(e) {
 e.keyCode === 13 && getTestList()
}

//题库选择页面获取的单个题库id
let QsBankId=route.query.id
console.log(QsBankId,'QsBankId')

//试卷名称和描述
const paperName=route.query.paperName
console.log(paperName,'paperName')
const paperDetail=route.query.paperDetail
console.log(paperDetail,'paperDetail')


//题库选择页面获取的多个题库id
// console.log(route)
let QsBankSelectList=route.query.QsBankSelectList
console.log(QsBankSelectList)

//判断传过来的题库是单个还是数组
if(QsBankId){
  QsBankIdList.value[0]=QsBankId
  console.log(QsBankIdList.value,'单个题库')
}else{
  console.log(QsBankSelectList)
  for(let i=0;i<QsBankSelectList?.length;i++){
    QsBankIdList.value[i]=QsBankSelectList[i];
  }
  console.log(QsBankIdList.value,'多个题库')
  console.log(QsBankIdList.value instanceof Array)
}

//获取题库试题
function getTestList(){
  const params = {
    page_size:curPageSize.value,
    curr_page:curPage.value,
    paper_name:searchName.value,
    entity:{
        question_bank_ids:QsBankIdList.value
    }
  }
  fetchTest(params).then( result => {
    console.log(params,'params')
    console.log(result,'result')
      loading.value = false
      total.value = result.data.total_count
      if(result.code === 0 ){
        tableData.value = result.data.list.map(item =>  {
          return {
            testId:item.id,
            id:item.question_number,
            type:item.type,
            level:item.difficulty,
            title:item.title,
            date:item.gmt_created,
            option:item.option_vo_list,
            answer:item.answer,
          }
      })
      }else{
        ElMessage({
        message:  result.data.error,
        type: 'error',
        })
      }
  })
}

// tabs标签页默认选中第一个
const activeName = ref('first')
const dialogTableVisible=ref(false)

//已选试题删除
function handleDelete(val){
  console.log(val.id)
  let i=0;
  for(i=0;i<multipleSelection.value.length;i++){
    if(multipleSelection.value[i].id==val.id){
       break;
    }
  }
  multipleSelection.value.splice(i,1);
  console.log(i)
  console.log(multipleSelection.value)
  console.log(val)
}

// console.log(typeof multipleSelection)
let selectList=reactive([])

//选题提交
function submit() {
  console.log(multipleSelection.value)
  // console.log(Object.keys(multipleSelection).length)
  if(multipleSelection.value.length===0){
    dialogTableVisible.value=false;
    alert("已选试题为空")
  }else{
  console.log(multipleSelection,'已选题')
  console.log(QsBankIdList,'题库id列表')
    for(let i=0;i<multipleSelection.value.length;i++){
      selectList[i]=multipleSelection.value[i].testId;
    }
    //  console.log(selectList instanceof Array)
    //  let selectObj = JSON.stringify(selectList)
    router.push({
      // name:'testScore',
      path:"testScore",
      query:{
        selectList:selectList,//试题列表id
        paperName:paperName,//试卷名称
        paperDetail:paperDetail,//试卷简介
        QsBankIdList:QsBankIdList.value//题库列表id
      }
    })
    console.log(route)
    // console.log('对象不为空')
  }
}

</script>

<style lang="scss" scoped>
.icon-style{
  width:80px;
  height:150px;
  .icon-container{
    width:100%;
    height:80px;
    .icon{
      height:60px;
      width:60px
    }
  }
}
.QsBank-container{
  width:500px;
  height:150px;
  .QsBank-title{
    width:100%;
    height:60px;
    font-size:18px;
    font-weight:bold
  }
  .QsBank-describe{
    width:100%;
    height:40px;
    font-size:12px;
    color:1F1F1F
  }
  .QsBank-createTime{
    width:100%;
    height:40px;
    font-size:12px;
    color:797979
  }
}


.container{
  padding: 10px 50px;
  .header{
    display: flex;
    // justify-content: space-between;
    margin-bottom: 30px;
    height:100px ;
  }
  .btn{
    margin: 30px 30px 30px;
  }

}
// Tabs标签页样式
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.logo{
  width:66px;
  height:20px;
  background: #F59A23;
  display: flex;
  justify-content: center;
  align-items: center;
  .font-style{
    color: #FFFFFF;
    font-size: 12px;
    }
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
.question-option{
  margin-right: 30px;
}
</style>
