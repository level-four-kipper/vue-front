<!-- 题库首页 -->
<template>
  <div class="all">
    <Carousel :cardList="cardList"></Carousel>
    <div class="search-header">
      <div class="search-contanier">
        <div class="exam-search">
          <SearchInput placeholder="你想了解什么"> </SearchInput>
          <span class="title">历史搜索:</span>
          <span class="search-history">
            <span>java</span>
            <span>c#</span>
            <span>python</span>
          </span>
        </div>
        <div class="exam-classify">
          <span class="title">题库分类:</span>
          <span class="classify-name" v-for="item in tabs" :key="item.id" @click="chooseTab(item.name)">
            {{item.name}}
          </span>
        </div>
      </div>
    </div>
    <div class="questionBank-container">
      <el-row>
        <el-col :span="4" class="questionBank-list" v-for="(item,index) in questionBankList" :key="index">
          <div class="icon" @click="goQuestionBankPage(item.questionBank_id)">
            <img class="questionBank-icon" :src="item.src" />
            <div class="questionBank-title">
              <span class="questionBank-word">{{ item.questionBank_name }}</span>
              <span class="num">收录题量：{{item.total}}</span>
            </div>
          </div>
          <p class="questionBank-descript">{{item.description}}</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
import Carousel from '@/components/Carousel.vue'
import SearchInput from '@/components/SearchInput.vue'
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import service from '../../utils/request.js'
import axios from 'axios'
const router = useRouter()
const route = useRoute()
const cardList = [
  { img: '../src/assets/img/blog-index/img1.jpg', title: '1', url: '1' },
  { img: '../src/assets/img/blog-index/img2.jpg', title: '2', url: '1' },
  { img: '../src/assets/img/blog-index/img3.jpg', title: '3', url: '1' },
  { img: '../src/assets/img/blog-index/img4.jpg', title: '4', url: '1' },
  { img: '../src/assets/img/blog-index/img5.jpg', title: '5', url: '1' }
]
//题库分类
const tabs = reactive([
  { id: 1, name: '算法' },
  { id: 2, name: '大数据' },
  { id: 3, name: 'AI' },
  { id: 4, name: 'Linux' },
  { id: 5, name: 'Android' },
  { id: 6, name: 'V2X' },
  { id: 7, name: '嵌入式' }
])
//题库列表
const questionBankList = reactive([
  {
    questionBank_id: '1',
    src: '../src/assets/img/questionBank/java.png',
    questionBank_name: 'Java题库',
    total: '100',
    description: '收录java相关的测试题，涉及知识点包含Java语法、常用集合、多线程...'
  },
  {
    questionBank_id: '2',
    src: '../src/assets/img/questionBank/C.png',
    questionBank_name: 'C/C++题库',
    total: '200',
    description: '收录C/C++相关的测试题，涉及知识点包含Java语法、常用集合、多线程...'
  },
  { questionBank_id: '3', src: '../src/assets/img/questionBank/Go.png', questionBank_name: 'Go题库', total: '300', description: '收录Go相关的测试题，涉及知识点包含Java语法、常用集合、多线程...' },
  {
    questionBank_id: '4',
    src: '../src/assets/img/questionBank/Python.png',
    questionBank_name: 'Python题库',
    total: '100',
    description: '收录Python相关的测试题，涉及知识点包含Java语法、常用集合、多线程...'
  }
])
const goQuestionBankPage = url => {
  router.push('/certainQuestionList/' + url)
  console.log(route)
  console.log(router)
}
</script>
<style scoped lang="scss">
.content {
  padding: 10px 0;
  background-color: #ccc;
}
.carousel-main {
  padding: 40px 20px;
}
.search-header {
  .search-contanier {
    height: 100px;
    background-color: #fff;
    padding: 10px 80px;
    .exam-search {
      height: 60px;
      display: flex;
      align-items: center;
      .title {
        margin-left: 20px;
      }
      .search-history {
        span {
          padding-left: 10px;
        }
      }
    }
    .exam-classify {
      .title {
        padding: 0 10px;
      }
      .classify-name {
        padding: 0 10px;
        cursor: pointer;
        &:hover {
          color: rgba(255, 255, 255, 0.99);
          background-color: rgba(0, 102, 255, 0.988235294117647);
        }
      }
    }
  }
}
.content-exam {
  .exam-contanier {
    padding: 10px 80px;
    .exam-list {
      padding: 0;
    }
  }
}
.all {
  height: 100%;
}
.questionBank-container {
  background-color: #f2f2f2;
  width: 100%;
  display: flex;
  flex: 1;
  height: 100%;
}
.questionBank-list {
  margin-left: 80px;
  background-color: #ffffff;
  width: 18%;
  height: 160px;
  margin-top: 30px;
}
.icon {
  display: flex;
  margin-bottom: 20px;
}
.questionBank-title {
  display: flex;

  flex-wrap: wrap;
  margin-top: 15px;
}
.questionBank-icon {
  width: 65px;
  margin-left: 25px;
  margin-top: 20px;
  cursor: pointer;
}
.questionBank-word {
  cursor: pointer;
  font-size: 15px;
  margin-left: 25px;
  margin-top: 20px;
  height: 30px;
  width: 190px;
  font-weight: bold;
}
.num {
  margin-left: 25px;
  color: gray;
  font-size: 13px;
  margin-top: 5px;
}
.questionBank-descript {
  margin: 10px 20px;
}
</style>
