<template>
  <div class="container">
    <div class="header" style="">试卷详情</div>
    <hr />
    <div class="paper-container">
      <div class="title">{{paper.title}}</div>
      <hr />
      <div style="margin-left:20px">
        考试须知<br />
        1.**********<br />
        2.****************<br />
        3.************<br />
        4.**********************<br />
        5.**************<br /><br />
      </div>
      <hr />
      <div v-for="(item,index) in paperDetail.list" :key="index">
        <!-- <div>{{number.indexOf(index)}}</div> -->
        <div class="question-stem">{{paperDetail.shift[number.indexOf(index)]}}、{{paperDetail.map[index-1]}}</div>
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
      </div>
    </div>
    <!-- <div v-show="a">111</div>
    <div class="box" v-show="a">222</div> -->
  </div>
</template>

<script setup>
import {ref,reactive,onMounted} from 'vue'
import { useRoute } from "vue-router"
import { fetchPaperDetail } from '@/api/paper.js'
import {ElMessage} from 'element-plus'
// const a = ref(true);

const route=useRoute()
let paperId=route.query.paperId
console.log(paperId)
const loading = ref(true)
const number=ref([])//题干索引数组
// const testNumber=ref([])//试题索引数组

const paperDetail=reactive({
  list:[],
  map:['单选题','多选题','判断题','问答题','编程题'],
  shift:['一','二','三','四','五','六','七','八','九','十'],
})
onMounted(()=>{
  getPaperDetail()
})
//获取试卷详情
function getPaperDetail(){
  const params = {
      paper_id:paperId,
  }
  fetchPaperDetail(params).then( result => {
    console.log(params,'params')
    console.log(result,'result')
      loading.value = false
      if(result.code === 0 ){
        paperDetail.list = result.data
        console.log(paperDetail.list,'paperDetail.list')
        console.log(paperDetail.list,'paperDetail.list')
        let i=0;
        Object.keys(paperDetail.list).forEach((key)=>{//查询题干类型数量
          console.log(key)
          number.value[i]=key
          i++
        })
        // Object.keys(paperDetail.list).forEach((key)=>{//查询相应题干下试题数量
        //   console.log(key)
        //   number.value[i]=key
        //   i++
        // })
      }else{
        ElMessage({
        message:  result.data.error,
        type: 'error',
        })
      }
  })
}
const paper = reactive(
  {
    id:1,
    title: 'Java基础测验',
    list:[//试卷表单，type为试题题型，id为试题id
      {type:1,id:[1,2,3,4,5]},//单选题
      {type:2,id:[1,2,3,4]},//多选题
      {type:3,id:[1,2,3]},//判断题
      {type:4,id:[1,2,3]},//问答题
      {type:5,id:[1,2]},//编程题
    ],
    map:['单选题','多选题','判断题','问答题','编程题'],
    shift:['一','二','三','四','五','六','七','八','九','十'],
  }
)
</script>

<style lang="scss" scoped>
.container{
  position: absolute;
  width: 1720px;
  right: 0;
  left: 0;
  padding: 0px 100px;
  .header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    font-size:16px;
    font-weight:bold;
    margin-bottom:10px
  }
  .btn{
    margin: 30px 30px 30px;
  }
}

.paper-container{
  margin: 20px 200px 0 200px;
  .question-stem{
    font-weight: bold;
    margin: 10px 0 10px 0;
  }
}
.title{
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
