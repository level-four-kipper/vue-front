<template>
  <div class="container">
    <div class="header">
      <h2>试题分数</h2>
      <el-button type="primary" ng-disabled="" @click="dialogVisible=true">提交</el-button>
      <el-dialog v-model="dialogVisible" title="提交" width="30%">
        <span>确认提交？</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div>
      <div>
        <div class="totalScore-container">
          <span class="total-score">试卷总分：</span>
          <el-input v-model="totalScore" required placeholder="请输入试卷总分" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
        </div>

        <div v-for="(item,index) in paperData.list" :key="index"> 
        <!-- <div>{{number.indexOf(index)}}</div> -->
        <div class="question-stem">
          {{paperData.shift[number.indexOf(index)]}}、{{paperData.map[index-1]}}
          <span class="title-score">每题分数：</span>
          <el-input v-show="index==1" v-model="singleChoice" placeholder="请输入单选题分数" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          <el-input v-show="index==2" v-model="multipleChoice" placeholder="请输入多选题分数" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          <el-input v-show="index==3" v-model="judgeQuestion" placeholder="请输入判断题分数" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          <el-input v-show="index==4" v-model="essayQuestion" placeholder="请输入问答题分数" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          <el-input v-show="index==5" v-model="programmingProblem" placeholder="请输入编程题分数" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
        </div>
        <!-- <div v-for="test in item[0]" :key="test.index"> -->
        <div class="question">
        <!-- 试题题目 -->
        {{number.indexOf(index)+1}}、{{item[0].title}}<br />
        <!-- 试题选项 -->
        {{item[0].option}}<br />
        <!-- 试题答案 -->
        {{item[0].answer}}<br />
        </div>
        <!-- </div> -->
        <!-- <div v-for="(test,index) in item[number.indexOf(index)]" :key="index">
            {{index+1}}、{{test}}
          </div> -->
        <!-- </div> -->

        <!-- <div v-for="(item,index) in paperList.list" :key="item.id">
          <div class="title-container">
            <span>{{paperList.map[item.type-1]}}</span>
            <span class="test-title">{{paperList.shift[index]}}、{{paperList.map[item.type-1]}}</span>
            <span v-show="type==0">试题数：{{}}</span>
            <span v-show="index==1">试题数：4</span>
            <span v-show="index==2">试题数：3</span>
            <span v-show="index==3">试题数：3</span>
            <span v-show="index==4">试题数：2</span> -->
          <!-- <div v-for="(test,index) in item.id" :key="index">{{index+1}}、{{test}}</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter, useRoute} from 'vue-router'
import {ref,reactive,onMounted} from 'vue'
import { ElMessage } from 'element-plus'
// import { fetchTestList } from '/api/paper.js'

const router=useRouter()
const route=useRoute()
const dialogVisible=ref(false)

const totalScore=ref('')
const singleChoice=ref('')
const multipleChoice=ref('')
const judgeQuestion=ref('')
const essayQuestion=ref('')
const programmingProblem=ref('')

//选题id数组
let selectList=route.query.selectList
console.log(selectList,'选题id数组')
//题库列表id
let QsBankIdList=route.query.QsBankIdList
console.log(QsBankIdList,'题库列表id')
//试卷名称和简介
const paperName=route.query.paperName
console.log(paperName,'试卷名称')
const paperDetail=route.query.paperDetail
console.log(paperDetail,'试卷简介')

const loading = ref(true)
const paperData=reactive({
  list:[],
  map:['单选题','多选题','判断题','问答题','编程题'],
  shift:['一','二','三','四','五','六','七','八','九','十'],
})
const number=ref([])//题干索引数组

onMounted(()=>{
  getTestList()
})
//获取试题信息
function getTestList(){
  // const params = {
  //   entity:{
  //     select_List:selectList
  //   }
  // }
  // fetchTestList(params).then( result => {
  //   console.log(params,'params')
  //   console.log(result,'result')
  //     loading.value = false
  //     if(result.code === 0 ){
  //       paperData.list = result.data
  //       let i=0;
  //       Object.keys(paperData.list).forEach((key)=>{//查询题干类型数量
  //         console.log(key)
  //         number.value[i]=key
  //         i++
  //       })
  //     }else{
  //       ElMessage({
  //       message:  result.data.error,
  //       type: 'error',
  //       })
  //     }
  // })
}

const paperList = reactive(
  {
    //试题列表
    list:[
      {
        id:10033,//试题id
        type:'1',//试题类型
        title:'java全称',//试题题干
        optionsList: ['','','',''],//单选题、多选题和判断题选项及答案
        answer: '',//试题答案
        codeList: [],//编程题答案
        score:'',//分数
      },{
        id:10034,
        type:'1',
        title:'java全称',
         optionsList: ['','','',''],
        answer: '',
        codeList: [],
        score:'',
      },{
        id:10035,
        type:'1',
        title:'java全称',
         optionsList: ['','','',''],
        answer: '',
        codeList: [],
        score:'',
      },{
        id:10036,
        type:'2',
        title:'java全称',
        optionsList: ['','','',''],
        answer: '',
        codeList: [],
        score:'',
      },{
        id:10037,
        type:'2',
        title:'java全称',
         optionsList: ['','','',''],//单选题、多选题和判断题选项及答案
        answer: '',//试题答案
        codeList: [],//编程题答案
        score:'',//分数
      },{
        id:10038,
        type:'2',
        title:'java全称',
         optionsList: ['','','',''],//单选题、多选题和判断题选项及答案
        answer: '',//试题答案
        codeList: [],//编程题答案
        score:'',//分数
      },{
        id:10039,
        type:'3',
        title:'java全称',
         optionsList: ['','','',''],//单选题、多选题和判断题选项及答案
        answer: '',//试题答案
        codeList: [],//编程题答案
        score:'',//分数
      },{
        id:10040,
        type:'3',
        title:'java全称',
         optionsList: ['','','',''],//单选题、多选题和判断题选项及答案
        answer: '',//试题答案
        codeList: [],//编程题答案
        score:'',//分数
      },{
        id:10041,
        type:'4',
        title:'java全称',
        optionsList: ['','','',''],//单选题、多选题和判断题选项及答案
        answer: '',//试题答案
        codeList: [],//编程题答案
        score:'',//分数
      },{
        id:10042,
        type:'4',
        title:'java全称',
        optionsList: ['','','',''],//单选题、多选题和判断题选项及答案
        answer: '',//试题答案
        codeList: [],//编程题答案
        score:'',//分数
      },{
        id:10043,
        type:'5',
        title:'java全称',
         optionsList: ['','','',''],//单选题、多选题和判断题选项及答案
        answer: '',//试题答案
        codeList: [],//编程题答案
        score:'',//分数
      },

    ],
    map:['单选题','多选题','判断题','问答题','编程题'],
    shift:['一','二','三','四','五','六','七','八','九','十'],
  }
)

//试卷提交
function submit(){
  // this.dialogVisible = false;
  // let score=singleChoice*+multipleChoice
  if(this.totalScore)
  ElMessage({
    showClose: true,
    message: '创建试题成功！',
    type: 'success'
  })
  router.push('/workPanel/myPaper');
}
</script>

<style lang="scss" scoped>
.container{
  padding: 10px 50px;
  .header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  .type{
    font-size: 18px;
    font-weight: bold;
  }
  .totalScore-container{
    margin-bottom: 20px;
    .total-score{
      font-size: 20px;
      font-weight: bold;
    }
  }
  .title-container{
    display: flex;
    .test-title{
      margin-right: 50px;
      font-weight: bold;
    }
    .title-score{
      margin-left: 50px;
    }
  }
  .el-input{
    width: 150px;
  }
}
</style>
