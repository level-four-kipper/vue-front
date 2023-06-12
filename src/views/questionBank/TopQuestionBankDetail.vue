<!-- 顶部 题库详情公共组件 -->
<template>
  <div class="">
    <!-- <div class="question">
      <div>
        <img class="questionBank-icon" :src="questionBankList.src" />
        <button class="questionBank-type">{{questionBankList.questionBank_name}}</button>
      </div>

      <div class="questionBank-description">
        <span class="title">{{questionBankList.questionBank_name}}题库</span>
        <span class="content">{{questionBankList.description}}</span>
        <span class="detail">{{questionBankList.creator}} 创建于 {{questionBankList.gmt_created}}</span>
      </div>
    </div> -->
    <div class="question">
      <div>
        <img class="questionBank-icon" src="../../assets/img/questionBank/java.png" />
        <button class="questionBank-type">Java</button>
      </div>

      <div class="questionBank-description">
        <span class="title">Java题库</span>
        <span class="content">收录java相关的测试题，涉及知识点包含Java语法、常用集合、多线程的使用等。</span>
        <span class="detail">张三 创建于 2022-11-21 10:10:10</span>
      </div>
    </div>
  </div>
</template>

<script name="TopQuestionBankDetail">
import { onMounted } from 'vue'
// export default {
//     props:{
//     questionBankList:{
//         type:Array,
//         default:() => []
//     }
// },
// setup(){

// }
// }
</script>

<style lang="scss" scoped>
.question {
  // background-color:#f2f2f2;
  height: 20%;
  display: flex;
  .questionBank-icon {
    width: 65px;
    height: 60px;
    margin-left: 250px;
    margin-top: 20px;
  }
  .questionBank-type {
    border: 1px solid #faad14;
    margin-left: 250px;
    border-radius: 10px;
    width: 60px;
    height: 24px;
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
      width: 1200px;
      margin-left: 30px;
    }
    .detail {
      margin-left: 30px;
      width: 1000px;
    }
  }
}
.list {
  margin-left: 250px;
}
</style>
