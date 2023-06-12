<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <div class="paper-title">Java基础考试</div>
        <div class="paper-description">本次考试由弗迪科技-技术平台部组织</div>
      </div>
      <div v-if="currentIndex  !==-1" class="right">
        <div>
          <span>剩余时长:</span> <span class="remainder-time">{{remainderTime}}</span>
        </div>
        <div>
          <span>答题进度:</span> <span class="progress">{{answerProgress}}</span>
        </div>
      </div>
    </div>

    <template v-if="currentIndex  ===-1">
      <div class="exam-start">
        <div class="title">考试须知</div>
        <ul class="introduce-content">
          <li>1.注意答题时间</li>
          <li>2.注意答题时间</li>
          <li>3.注意答题时间</li>
          <li>4.注意答题时间</li>
          <li>5.注意答题时间</li>
        </ul>
        <div class="confirm"><input type="checkbox" :checked="isChecked" @change="onConfirm" /> <span>我已阅读，并且同意</span></div>
      </div>
      <div class="start-answer"><button class="btn-start" :class="{active:isChecked}" @click="startAnswer">开始答题</button></div>
    </template>
    <template v-else-if="currentQs">
      <div class="exam-qs">
        <KeepAlive>
          <template v-if="currentQs.type==='单选题' ">
            <SingleSelection :question="currentQs" :onAnswerChange="onAnswerChange"></SingleSelection>
          </template>
          <template v-else-if=" currentQs.type==='多选题'">
            <MultipleSelection :question="currentQs" :onAnswerChange="onAnswerChange"></MultipleSelection>
          </template>
          <template v-else-if="currentQs.type==='判断题'">
            <Judge :question="currentQs" :onAnswerChange="onAnswerChange"></Judge>
          </template>
          <template v-else-if="currentQs.type==='问答题'">
            <ShortAnswer :question="currentQs" :onAnswerChange="onAnswerChange"></ShortAnswer>
          </template>
          <template v-else>
            <Programming :question="currentQs" :onAnswerChange="onAnswerChange"></Programming>
          </template>
        </KeepAlive>
        <div class="footer">
          <button v-if="currentIndex !==0" class="btn-last" @click="lastQuestion">上一题</button>
          <button class="btn-next" @click="nextQuestion">下一题</button>
        </div>
      </div>
    </template>
    <template v-else-if="currentIndex  ===  examPaper.questions.length">
      <div class="exam-end">
        <div class="title">您已完成考试，若确认无误，请点击提交</div>
        <div class="content">
          <div class="answer-time">答题用时：{{answerTime}}</div>
          <div class="answer-count">答题统计：{{answerCount}}</div>
        </div>
        <div class="footer">
          <button class="btn-check" @click="checkExam">在检查一下</button>
          <button class="btn-submit" @click="submitExam">提交</button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="exam-finished">
        <span>恭喜您已完成本次考试</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import Programming from '@/views/exam/components/Programming.vue'
import Judge from '@/views/exam/components/Judge.vue'
import ShortAnswer from '@/views/exam/components/ShortAnswer.vue'
import MultipleSelection from '@/views/exam/components/MultipleSelection.vue'
import SingleSelection from '@/views/exam/components/SingleSelection.vue'
import {  dateTransform} from  './utils'
import {ref,reactive,computed,onMounted} from 'vue'
import { useRouter, useRoute  } from 'vue-router'
import {  answerPaper,questionType} from './data.js'
import {fetchExamInfo } from '@/api/exam.js'
import { ElMessage } from 'element-plus'

//考试总时长 分钟
// computed(() =>{
//   const startTime =Date.parse(new Date( examPaper.start_time).toString())
//   const endTime= Date.parse(new Date( examPaper.end_time).toString())
//   return ( endTime-startTime )/1000
// })
localStorage.setItem('answerPaper',JSON.stringify(answerPaper))

const route = useRoute()
const isChecked = ref(false)
const currentIndex  = ref(-1) //当前序号 -1:开始答题界面 | 0:题目列表的下标
const answerTime = ref(  0 )// 答题用时 xx分钟
const  answerCount= ref( 0) //答题数量
let examPaper =  reactive({
    exam_id: '',
    paper_id: '',
    paper_name: '',
    start_time: '',
    end_time: '',
    exam_time: 0,   //考试总时长 分钟
    question_number: 0,
    paper_description: '',
    explain_string: '',
    papaer_icon: '',
    questions: []
})

// 当前选中的题目
const currentQs = computed(() => {
  return  examPaper.questions[currentIndex.value] || null
})
const remainderTime = computed(() => dateTransform(examPaper.exam_time  ) )// 答题剩余时间 mm:ss

// 答题进度
const answerProgress = computed(() => {
  return  currentIndex .value >=  examPaper.questions.length ? answerProgress.value:`${currentIndex .value+1}/${ examPaper.questions.length}`
})


function onConfirm(){
  isChecked.value = !isChecked.value
}

function startAnswer(){
  currentIndex .value = 0
  getRemainderTime( examPaper.start_time, examPaper.end_time)
}

function lastQuestion( ){
   currentIndex .value--
}
function nextQuestion( ){
  currentIndex .value++
}
function checkExam(){
  currentIndex .value = 0
}


//计算考试时间
function getRemainderTime(startTime, endTime) {
  let timestamp = Date.parse(new Date(endTime).toString()) - Date.parse(new Date(startTime).toString())
  let seconds = timestamp / 1000
  let userTime = 0
  seconds--
  if (seconds <= 0) return
  let timer = setInterval(() => {
     remainderTime.value = dateTransform(seconds--)
     answerTime.value =Math.ceil ((userTime++)/60)
       if (seconds < 0  ) {
      currentIndex .value =  examPaper.questions.length
      submitExam()
      clearInterval(timer) //倒计时结束，清除定时器，避免内存溢出
    }

  }, 1000)
}


// 提交试卷
function submitExam(){
  currentIndex .value++
  console.log('提交试卷');
}
//答题界面触发
function onAnswerChange(value ){
  const answerPaper =JSON.parse( localStorage.getItem('answerPaper'))
  const answerCurrentQs = answerPaper.questions[currentQs.value.question_number-1]
  answerCurrentQs.answer === null && answerCount.value++
  value === null && answerCount.value--
   answerCurrentQs.answer= value
   answerPaper.questions[currentQs.value.question_number-1] = answerCurrentQs
   localStorage.setItem('answerPaper',JSON.stringify(answerPaper))
  //  console.log(JSON.parse( localStorage.getItem('answerPaper')),'paper');
}


//请求
function getExamInfo(){
  fetchExamInfo(route.params.id).then(res => {
    if(res.code === 0 && res.data){
      for (const key in  res.data) {
        examPaper[key] = res.data[key]
      }
    }else{
      ElMessage({
        message: res.msg ||  res.data.error,
        type: 'error',
      })
    }
  })

}
onMounted(() =>{
  getExamInfo()
})
</script>

<style lang="scss">
.container{
  background-color: #f2f2f2;
  padding: 50px 200px;
  height: 100%;
  .header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
     .right{
        span{
          font-size: 12px;
          font-weight: 700;
        }
        .remainder-time{
          color: #d81e06;
        }
        .progress{
          color: #8ad50f;
        }
    }
  }

  .paper-title{
    font-size: 18px;
    font-weight: 700;
  }
  .paper-description{
    font-size: 12px;
    font-weight: 700;
  }
  .start-answer{
    text-align: center;
     .btn-start{
        height: 30px;
        width:68px;
        color:#fff;
        text-align: center;
        background-color: #c6c6c6;
        border: none;
        :hover{
          background-color: #c2b1b1;
        }
        &.active{
          background-color:   #0066fffc;
          cursor: pointer;
        }

      }
  }
  .exam-start{
    .title{
      text-align: center;
      font-size: 16px;
      font-weight: 700;
    }
     .introduce-content{
        background-color: #fff;
        padding: 10px 10px;
        margin:  30px 30px;
        li{
          list-style: none;
        }
      }
    .confirm{
     margin:  0 30px 10px;
     height: 20px;

    }
  }

  .exam-qs{
    width: 1000px;
    .qs-container{
      background: #fff;
      border: 1px solid #dedede;
      .qs-content{
      height: 360px;
      padding: 10px 40px;
        background: #fff;
      }
    }
    .footer{
      padding-top:30px ;
      .btn-last{
        float: left;
        height: 30px;
        width: 80px;
        background-color: #fff;
        border: none;

      }
      .btn-next{
        float: right ;
        height: 30px;
        width: 80px;

        background-color: #fff;
        border: none;

      }

    }

  }
  .exam-end{
    height: 300px;
      .content{
        height: 360px;
        width: 1000px;
        background-color: #fff;
        padding: 20px 30px;

      }
    .footer{
      padding-top: 30px;
      .btn-check{
        width: 80px;
        height: 30px;
        background-color: #fff;
        color: #06f;
        border: none;
      }
      .btn-submit{
        width: 80px;
        height: 30px;
        margin-left: 200px;
        background-color: #06f;
        border: none;
        color: #fff;

      }

    }
  }
  .exam-finished{
    height: 452px;
    width: 1000px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

  }


}
</style>
