<!-- 某一题库下的全部试题 -->
<template>
  <div class="container">
    <div class="top">
      <div class="question">
        <div>
          <img class="questionBank-icon" :src="questionBankList.src" />
          <button class="questionBank-type">{{questionBankList.questionBank_name}}</button>
        </div>

        <div class="questionBank-description">
          <span class="title">{{questionBankList.questionBank_name}}题库</span>
          <span class="content">{{questionBankList.description}}</span>
          <span class="detail">{{questionBankList.creator}} 创建于 {{questionBankList.gmt_created}}</span>
        </div>
      </div>
    </div>
    <div class="container-children">
      <div class="middle">
        <div class="title" v-if="show==true">
          <span class="word1">全部试题</span>
          <div class="search">
            <div class="input-button">
              <el-input placeholder="请输入题目名称关键字" v-model="keywords" clearable>
                <template #prefix>
                  <el-icon @click="search" class="el-input__icon"><Search /></el-icon>
                </template>
              </el-input>
              <el-button @click="showForm">
                <el-icon class="xiala__icon"><CaretBottom /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <div class="form" v-else>
          <div class="hide-button">
            <span class="word2">全部试题</span>
            <div class="button-icon">
              <span class="text">高级搜索</span>
              <el-button @click="hideForm">
                <el-icon class="xiala__icon"><CaretTop /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="form-list">
            <el-form :inline="true" :model="form">
              <el-form-item label="试题编号">
                <el-input v-model="form.question_num" placeholder="根据试题编号进行搜索" />
              </el-form-item>
              <el-form-item label="考核点">
                <el-select v-model="form.check_point" placeholder="请选择考核点">
                  <el-option label="多线程" value="thread" />
                  <el-option label="基本概念" value=" profile" />
                </el-select>
              </el-form-item>
              <el-form-item label="创建日期">
                <el-col :span="11">
                  <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%" />
                </el-col>
                <el-col :span="2" class="text-center">
                  <span class="text-gray-500">-</span>
                </el-col>
                <el-col :span="11">
                  <el-date-picker v-model="form.date2" placeholder="Pick a date" style="width: 100%" />
                </el-col>
              </el-form-item>
              <el-form-item label="试题类型">
                <el-select v-model="form.question_type" placeholder="请选择试题类型">
                  <el-option label="选择题" value="select" />
                  <el-option label="判断题" value="judge" />
                  <el-option label="概述题" value="overview" />
                  <el-option label="编程题" value="code" />
                </el-select>
              </el-form-item>
              <el-form-item label="题干描述">
                <el-input v-model="form.description" placeholder="根据题干描述信息搜索" />
              </el-form-item>
              <el-form-item label="创建人">
                <el-select v-model="form.creator" placeholder="请选择创建人">
                  <el-option label="张三" value="shanghai" />
                  <el-option label="李四" value="beijing" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <el-form-item>
            <el-button type="primary" @click="formSearch">搜索</el-button>
            <el-button type="primary" @click="formReset">重置</el-button>
          </el-form-item>
        </div>
      </div>
      <el-divider />
      <div class="question-list">
        <div v-for="(item,index) in questionList" :key="item.id">
          <div class="title-row">
            <div>
              <span>T{{index+1}}.</span>
              <span>{{item.title}}</span>
            </div>
            <button class="question-type">基础</button>
          </div>
          <p class="option-show" v-for="(options,index) in item.optionList" :key="index">{{options.option}}. {{options.content}}</p>
          <el-divider />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="CertainQuestionList">
import TopQuestionBankDetail from './TopQuestionBankDetail.vue'
import { CaretBottom } from '@element-plus/icons-vue'
import { CaretTop } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
const form = reactive({
  question_num: '',
  check_point: '',
  question_type: '',
  description: '',
  creator: '',
  date1: '',
  date2: ''
})
const questionBankList = reactive({
  src: '../../assets/img/java.png',
  questionBank_name: 'Java',
  description: '收录java相关的测试题，涉及知识点包含Java语法、常用集合、多线程的使用等。',
  creator: '张三',
  gmt_created: '2022-11-21 10:10:10'
})
const questionList = reactive([
  {
    id: 1,
    title: '下列选项中哪些是Java面向对象的特性？',
    optionList: [
      { option: 'A', content: '多态' },
      { option: 'B', content: '聚合' },
      { option: 'C', content: '封装' },
      { option: 'D', content: '继承' }
    ]
  },
  {
    title: '如何创建线程？'
  },
  {
    title: '用代码实现一个计算器'
  },
  {
    title: '比较XA、TCC、最终一致性的优劣'
  }
])
const show = ref(true)
//搜索框搜索
const search = () => {}
//点击展示表单信息
const showForm = () => {
  show.value = false
  console.log(show.value)
}
//点击隐藏表单信息
const hideForm = () => {
  show.value = true
}
//表单搜索
const formSearch = () => {}
//表单重置
const formReset = () => {}
</script>

<style lang="scss" scoped>
.el-main {
  --el-main-padding: 20px;
  padding: 0px;
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
}
.container {
  height: 100%;
  .top {
    background-color: #f2f2f2;
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
  }
  .container-children {
    .question-list {
      .title-row {
        width: 86%;
        display: inline-flex;
        justify-content: space-between;
        .question-type {
          border: 1px solid #c280ff;
          border-radius: 10px;
          width: 60px;
          height: 24px;
          background-color: #c280ff;
          color: #fff;
        }
      }
    }
    margin-left: 250px;
    :deep(.el-divider--horizontal) {
      width: 86%;
    }
    .middle {
      margin-top: 20px;
      width: 1450px;
      .title {
        display: inline-flex;

        width: 1630px;
        .word1 {
          font-weight: bold;
          font-size: 14px;
          margin-top: 10px;
        }
        .search {
          margin-left: 1082px;
          margin-top: 11px;
          .input-button {
            display: inline-flex;
            .el-input {
              border-radius: 0px;
              :deep(.el-input__icon) {
                cursor: pointer;
              }
            }
            :deep(.el-button) {
              width: 32px;
              height: 32px;
              border-radius: 0px;
              .xiala__icon {
                color: #c6c6c6;
              }
            }
          }
        }
      }
      .form {
        .hide-button {
          height: 44px;
          display: inline-flex;
          .word2 {
            font-weight: bold;
            font-size: 14px;
          }
          .button-icon {
            margin-left: 1218px;
            .text {
              color: #c1c1c1;
              font-size: 13px;
              width: 50px;
              height: 32px;
              border: 1px solid #dae0db;
              padding: 4px 15px 9px 15px;
              text-align: center;
            }
            :deep(.el-button) {
              width: 32px;
              height: 32px;
              border-radius: 0px;
              .xiala__icon {
                color: #c6c6c6;
              }
            }
          }
        }
        .form-list {
          width: 900px;
          border: 1px solid #dae0db;
          padding: 20px 20px 0px;
          width: 1390px;
          margin-bottom: 15px;
        }
        .text-gray-500 {
          margin-left: 14px;
        }
      }
    }
  }
}
</style>