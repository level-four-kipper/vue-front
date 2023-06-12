<!-- 点击某一题库之后跳转到的页面 -->
<template>
  <div v-if="currentRouterName !== 'addMember'">
    <div class="description">
      <div class="question">
        <div>
          <img class="questionBank-icon" :src="questionBankInfo.icon" alt="icon" />
          <button class="questionBank-type">{{questionBankInfo.area}}</button>
        </div>

        <div class="questionBank-description">
          <p class="title">{{questionBankInfo.name}}</p>
          <p class="content" :title="questionBankInfo.description">{{questionBankInfo.description}}</p>
          <span class="detail"> 创建于 {{questionBankInfo.gmt_created}}</span>
        </div>
      </div>
    </div>
    <div class="below">
      <el-tabs v-model=" activeName" class="demo-tabs" @tab-change="tabChange">
        <el-tab-pane label="题目列表" name="1">
          <QuestionList />
        </el-tab-pane>
        <el-tab-pane label="题库设置" name="0">
          <QuestionBankSet :questionBankInfo="questionBankInfo" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <RouterView v-else />
</template>

<script setup name="ClickQuestionBank">
import QuestionList from './components/QuestionList.vue'
import QuestionBankSet from './components/QuestionBankSet.vue'
import {   onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchQuestionBankId,fetchPicture} from '@/api/qsBankManage.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const activeName = ref('1')
const questionBankInfo = reactive({
  area: '',
  icon: '',
  name: '',
  description: '',
  creator: '',
  gmt_created: '',
  visibility:''
})
 
/**
 * 请求
 */

function getQsBankSetInfo()   {
  fetchQuestionBankId(route.params.id).then(res => {
      if(res.code === 0){
        for (const key in res.data) {
          questionBankInfo[key] = res.data[key]
        }
      } else{
          ElMessage({
          message: res.msg || res.data.error,
          type: 'error'
        })
      }
  })

}


onMounted(() => {
  getQsBankSetInfo()
})
</script>
<style lang="scss" scoped>
// Tabs标签页样式
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.description {
  height: 150px;
  .question {
    height: 20%;
    display: flex;
    .questionBank-icon {
      min-width: 60px;
      height: 60px;
      margin-left: 250px;
      margin-top: 20px;
    }
    .questionBank-type {
      border: 1px solid #faad14;
      margin-left: 250px;
      margin-top: 10px;
      border-radius: 20px;
      min-width: 83px;
      min-height: 30px;
      background-color: #faad14;
      color: #fff;
    }
    .questionBank-description {
      display: flex;
      flex-flow: wrap;
      .title {
        font-weight: bold;
        font-size: 20px;
        width: 1000px;
        margin-top: 20px;
        margin-left: 30px;
      }
      .content {
        width: 400px;
        margin-left: 30px;
        color: black;
        margin-bottom: 1%;
        margin-top: 1%;
        font-size: 16px;
        overflow: hidden; //超出部分隐藏
        text-overflow: ellipsis; //用一个省略号代替超出的内容
        display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
        -webkit-line-clamp: 2; //限制行数
        // &:hover{
        //   text-overflow: inherit;
        //   overflow: visible;
        //   white-space: pre-line;
        // }
      }
      .detail {
        margin-left: 30px;
        width: 1000px;
        color: black;
        font-size: 16px;
      }
    }
  }
}
.below {
  margin-left: 40px;
  :deep(.el-button) {
    position: relative;
    margin-bottom: 20px;
    margin-top: 10px;
  }
}
</style>
