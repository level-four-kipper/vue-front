<template>
  <div class="main">
    <!-- 背景图 -->
    <div class="background-image">
      <div>
        <img src="@/assets/img/index/banner.png" />
      </div>
      <div class="title">
        技术提升平台
        <br />汇聚海量开发者经验
      </div>
    </div>
    <!-- 锚点定位 -->
    <div class="col">
      <ul class="recommend-list">
        <li>
          <a @click="handlePoint('hot')">
            <img src="@/assets/img/index/blog.png" />
            <div class="a-text">
              <p>优质文章</p>
              <span>优质文章不容错过</span>
            </div>
          </a>
        </li>
        <li>
          <a @click="handlePoint('ask')">
            <img src="@/assets/img/index/question.png" />
            <div class="a-text">
              <p>精彩问答</p>
              <span>大神为你解答技术问题</span>
            </div>
          </a>
        </li>
        <li>
          <a @click="handlePoint('select')">
            <img src="@/assets/img/index/question-bank.png" />
            <div class="a-text">
              <p>丰富题库</p>
              <span>海量题库等你来学习</span>
            </div>
          </a>
        </li>
        <li>
          <a @click="handlePoint('exam')">
            <img src="@/assets/img/index/exam.png" />
            <div class="a-text">
              <p>专业考试</p>
              <span>快来挑战一下！</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <!-- 热点资讯 -->
    <div class="hot-information">
      <div class="blog-part">
        <div id="hot" class="anchor-point"></div>
        <div class="blog-head">
          <span class="blog-head-pic">
            <img src="@/assets/img/index/title/blog.png" alt="blog-title" />
          </span>
          <span class="blog-head-title">优质文章</span>
          <span class="blog-head-tip">优质文章不容错过</span>
        </div>
        <div class="blog-body">
          <div class="blog-recommend">
            <div class="blog-recommend-title blog-content-title">
              <div class="recommend-title">
                <img class="icon" src="@/assets/img/index/recommend.png" alt="recommend" />
                <img src="@/assets/img/index/recommend-title.png" alt="title" />
              </div>
              <div class="recommend-change" @click="nextBlogPage">
                <span class="recommend-change-text">换一批</span>
                <span class="recommend-change-pic">
                  <img src="@/assets/img/index/change.png" alt="change" />
                </span>
              </div>
            </div>
            <div class="blog-recommend-content">
              <div
                v-for="item in blogRcommendList.data"
                :key="item.id"
                class="recommend-content-container"
                @click="jumpBlogContent(item.id)"
              >
                <div class="recommend-content-title">{{item.title}}</div>
                <div class="recommend-content-text">{{item.content}}</div>
                <!-- <div class="recommend-content-pic">
                  <img :src="item.image" alt="推荐博客" />
                </div>-->
              </div>
            </div>
          </div>
          <div class="blog-hot-list">
            <div class="blog-hot-title blog-content-title">
              <div class="hot-title">
                <img class="icon" src="@/assets/img/index/pop.png" alt="recommend" />
                <img src="@/assets/img/index/hot-title.png" alt="title" />
              </div>
              <div class="hot-more more-hover" @click="jumpBlogIndex">更多</div>
            </div>
            <div class="blog-hot-content">
              <div
                v-for="(item,index) in blogHotList.data"
                :key="item.id"
                class="blog-hot-item"
                @click="jumpBlogContent(item.id)"
              >
                <span :class="['hot-item-index', index>2?'':'hot-index-before']">{{index+1}}</span>
                <p class="hot-item-title">
                  <span class="item-title-text">{{item.title}}</span>
                  <!-- <span v-if="index<2" class="item-title-pic">
                    <img src="@/assets/img/index/new.png" alt="new" />
                  </span>-->
                  <span v-if="index<3" class="item-title-pic">
                    <img src="@/assets/img/index/hot.png" alt="hot" />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 精彩问答 -->
    <div class="question">
      <div class="qa-part">
        <div id="ask" class="anchor-point"></div>
        <div class="qa-head">
          <img src="@/assets/img/index/title/question.png" />
          <span class="qa-head-title">精彩问答</span>
          <span class="qa-head-tip">大神为你解答技术问题</span>
          <span class="hot-more more-hover" @click="jumpQuizIndex">更多</span>
        </div>
        <div class="qa-body">
          <div class="left">
            <img src="@/assets/img/index/话题.png" />
            <div class="topicqa-item">
              <!-- 题目 -->
              <p
                class="topicqa-item-title text-overflow"
                @click="jumpQuizDetail(qa.data[0]?.article_id)"
              >{{qa.data[0]?.title}}</p>
              <!-- 概述 -->
              <p
                class="topicqa-item-content"
                @click="jumpQuizDetail(qa.data[0]?.article_id)"
              >{{qa.data[0]?.content}}</p>
            </div>
            <el-button type="primary" @click="jumpQuizDetail(qa.data[0]?.article_id)">参与讨论</el-button>
          </div>
          <div class="right">
            <div class="qa-list">
              <div v-for="item in qa.data.slice(1,5)" :key="item.article_id" class="qa-item">
                <!-- 题目 -->
                <p
                  class="qa-item-title text-overflow"
                  @click="jumpQuizDetail(item.article_id)"
                >{{item.title}}</p>
                <!-- 概述 -->
                <p class="qa-item-content" @click="jumpQuizDetail(item.article_id)">{{item.content}}</p>
                <!-- 表尾 -->
                <div class="item-footer">
                  <!-- <div class="qa-item-message"> -->
                  <div class="qa-message-author">
                    <span class="item-time">{{item.gmt_created}}</span>
                  </div>
                  <!-- </div> -->
                  <div class="qa-message-data">
                    <p>
                      <img src="@/assets/img/blog-index/view.png" />
                      <span>{{item.browse_count}}</span>
                    </p>
                    <p>
                      <img src="@/assets/img/blog-index/star.png" />
                      <span>{{item.star_count}}</span>
                    </p>
                    <p>
                      <img src="@/assets/img/blog-index/comment.png" />
                      <span>{{item.comment_count}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 精选题库 -->
    <div class="question-bank">
      <div id="select" class="anchor-point"></div>
      <div class="question-bank_header">
        <div>
          <img src="@/assets/img/index/title/question-bank.png" />
          <span class="question-bank_header-title">丰富题库</span>
          <span class="question-bank_header-describ">海量题库等你来学习</span>
        </div>
        <span class="hot-more more-hover" @click="jumpQuizBankIndex">更多</span>
      </div>
      <div class="question-bank_content">
        <div class="question-bank_content-aside">
          <ul>
            <li
              v-for="(item,index) in meun"
              :key="index"
              ref="menuOption"
              :class="[{'isClick':index===indexOption}]"
              @click="option(index, item)"
            >
              <span class="meun_title">{{item.label}}</span>
              <span class="meun_level-option">
                <span
                  v-for="data in item.type"
                  :key="data"
                  @click.stop="selectType(data,index)"
                >{{ data}}</span>
              </span>
            </li>
          </ul>
          <img class="question-bank_img" src="@/assets/img/index/g-questionBank-img.png" />
        </div>
        <div class="question-bank_content-main">
          <div
            v-for="(item,index) in questionBankData"
            :key="index"
            class="question-bank_item"
            @click="jumpQuestionBankDetail(item)"
          >
            <div class="question-bank_item-header">
              <div class="question-bank_item-title">
                <span>{{item.type}}{{item.title}}</span>
              </div>
              <div class="question-bank_item-content">{{item.content}}</div>
            </div>
            <div class="question-bank_item-footer">
              <div class="question-bank_item-footer-left">
                <span>收录题量：{{item.questionNumber}}</span>
                <span>参与人数：{{item.joinNumber}}</span>
              </div>
              <div>
                <button v-if="false" @click="learn(item.id)">开始学习</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 严选试题 -->
    <div class="exam-bank">
      <div id="exam" class="anchor-point"></div>
      <div class="exam-bank_container">
        <div class="exam-bank_header">
          <div>
            <img src="@/assets/img/index/title/exam.png" />
            <span class="exam-bank_header-title">专业考试</span>
            <span class="exam-bank_header-describ">快来挑战一下！</span>
          </div>
          <!-- <router-link to="/exam">
            <div class="exam-bank_header-more more-hover" v-if="false">MORE+</div>
          </router-link>-->
        </div>
        <div class="exam-bank_content">
          <div class="waiting">敬请期待...</div>
          <!-- <div class="exam-bank_item" v-for="(item,index) in examBankData" :key="index">
            <div class="exam-bank_item-header">
              <div class="exam-bank_item-title">
                <div class="exam-bank_item-title-type">
                  <span>{{item.type}}</span>
                </div>
                <div>{{item.title}}</div>
              </div>
              <div class="exam-bank_item-content">{{item.content}}</div>
            </div>
            <div class="exam-bank_item-footer">
              <div class="exam-bank_item-footer-left">
                <span>试题题量：{{item.examNumber}}</span>
                <span>答题时长：{{item.answerTime}}</span>
                <span>参与人数：{{item.joinNumber}}</span>
              </div>
              <div class="exam-bank_item-footer-right">
                <button @click="challenge(item.id)" v-if="false">开始挑战</button>
              </div>
            </div>
          </div>-->
        </div>
      </div>
    </div>
    <el-backtop :right="40" :bottom="293">
      <img src="@/assets/img/index/g-backtop.png" />
    </el-backtop>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { View, Star, ChatDotSquare, Back, Right } from '@element-plus/icons-vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchQueationBank, fetchExamBoutique, getHotQuestionBank } from '@/api/index.js'
import http from '@/utils/https.js'
import { ElMessage } from 'element-plus'
import { htmlToString, getElementTop } from '@/utils/utils.js'
//精彩问答
const router = useRouter()
const route = useRoute()
const jumpQuizIndex = function () {
  router.push('/quizIndex')
}
const jumpQuizBankIndex = function () {
  router.push('/questionBank')
}
const jumpQuizDetail = function (id) {
  const routeUrl = router.resolve({
    path: `/questionAnswerDetail/${id}`
  })
  window.open(routeUrl.href, '_blank')
}
const jumpBlogIndex = () => {
  const routeUrl = router.resolve({
    path: `/blogIndex`
  })
  window.open(routeUrl.href, '_blank')
}
const qa = reactive({
  data: []
})
defineExpose({
  qa
})
const blogRcommendList = reactive({
  data: [],
  currentPage: 1,
  totalPage: 1
})
const blogHotList = reactive({
  data: []
})
// 题库数据
const getBlogDate = async (page = 1) => {
  await http
    .post('/blog-article/recommend', { curr_page: page, page_size: 6 })
    .then(res => {
      blogRcommendList.data = res.data.list
      blogRcommendList.currentPage = res.data.curr_page
      blogRcommendList.totalPage = res.data.total_page
      // console.log(blogRcommendList.data)
    })
    .catch(err => console.log(err))
  // dom
  const recommendList = document.getElementsByClassName('recommend-content-container')
  // 类数组转化成数组
  let recommendListArray = [].slice.call(recommendList)
  recommendListArray[0].classList.add('recommend-active')
  recommendListArray.map((el, index, arr) => {
    // console.log(el)
    el.onmouseover = function () {
      arr.map(el => {
        el.classList.remove('recommend-active')
      })
      el.classList.add('recommend-active')
    }
  })
}
const nextBlogPage = () => {
  console.log(1)
  blogRcommendList.totalPage == blogRcommendList.currentPage ? (blogRcommendList.currentPage = 1) : blogRcommendList.currentPage++
  getBlogDate(blogRcommendList.currentPage)
}
const jumpBlogContent = id => {
  const routeUrl = router.resolve({
    path: `/blogDetail/${id}`
  })
  window.open(routeUrl.href, '_blank')
}

// 精选题库数据
// 精选题库的菜单
const meun = ref()
meun.value = [
  // { label: 'Java', type: ['基础入门', '进阶', '高级'] },
  // { label: 'C/C++', type: ['基础入门', '进阶', '高级'] },
  // { label: 'Python', type: ['数据可视化', '数据孪生'] },
  // { label: 'Android', type: ['基础入门', '进阶', '高级'] },
  // { label: 'AI', type: ['大数据', '自动驾驶'] }
]
const questionBankData = ref([])
const indexOption = ref(0)
//选择菜单：java
function option(index, item) {
  indexOption.value = index
  getQueationBank(item.id)
  // switch (index) {
  //   case 0:
  //     getQueationBank('Java')
  //     break
  //   case 1:
  //     getQueationBank('C/C++')
  //     break
  //   case 2:
  //     getQueationBank('Python')
  //     break
  //   case 3:
  //     getQueationBank('Android')
  //     break
  //   case 4:
  //     getQueationBank('AI')
  //     break
  // }
  console.log(index)
}
//选择类型：基础入门等
function selectType(type, index) {
  //type为类型 index为li是哪个
  indexOption.value = index
  console.log(type, index)
}
//进入学习
function learn(id) {
  router.push({
    name: 'certainQuestionList',
    params: { questionBank_id: id }
  })
}
function getQueationBank(area_id) {
  const params = {
    entity: {
      area_id: area_id,
      query_condition: 2
    },
    page_size: 6,
    curr_page: 1
    // sidx: 'total_questions'
  }
  fetchQueationBank(params).then(result => {
    if (result.code === 0) {
      questionBankData.value = result.data.list.map(item => {
        return {
          id: item.id,
          title: item.name,
          content: item.description,
          questionNumber: item.total_questions,
          joinNumber: item.browse_count,
          type: item.type ? '【' + item.type + '】' : ''
        }
      })
    } else {
      ElMessage({
        showClose: true,
        message: '重新刷新页面',
        type: 'warning'
      })
    }
  })
}

// 跳转详情页
const jumpQuestionBankDetail = ({ id }) => {
  const routeUrl = router.resolve({
    path: `/questionBank/detail`,
    query: { id: id }
  })
  window.open(routeUrl.href, '_blank')
}

//严选试题
const examBankData = ref([])
function getExamBoutique() {
  fetchExamBoutique().then(result => {
    if (result.code === 0) {
      examBankData.value = result.data.map(item => {
        return {
          id: item.id,
          title: item.exam_name,
          answerTime: item.exam_time,
          examNumber: item.question_number,
          joinNumber: item.user_number,
          content: item.explain_string,
          type: item.area
        }
      })
    }
  })
}
function challenge(id) {
  router.push({
    name: 'answerExam',
    params: { id: id }
  })
}

// 精选题库
function fetchHotQuestionBank() {
  getHotQuestionBank().then(({ code, data }) => {
    if (code === 0) {
      meun.value = data.map(item => {
        item.label = item.name
        item.type = []
        return item
      })
      if (data.length) {
        getQueationBank(data[0].id)
      }
    }
  })
}

// 锚点动画
const handlePoint = id => {
  const dom = document.getElementById(id)
  const top = getElementTop(dom)
  window.scrollTo({
    top: top,
    left: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  getBlogDate()
  http
    .get('/blog-article/hot')
    .then(res => {
      blogHotList.data = res.data
    })
    .catch(err => console.log(err))
  //精选题库
  //精选问答
  http
    .get('/quiz/homePageHot')
    .then(res => {
      res.data.forEach(item => {
        item.content = htmlToString(item.content)
      })
      qa.data = res.data
    })
    .catch(err => console.log(err))
  //严选试题
  getExamBoutique()
  // 精选题库
  fetchHotQuestionBank()
  // getQueationBank('java')
})
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
.text-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.more-hover {
  &:hover {
    color: #0175ff !important;
    cursor: pointer;
  }
}
.main {
  width: 100%;
  min-width: 1200px;
  // overflow-x:scroll;
  // width: 1920px;
  .anchor-point {
    position: absolute;
    top: -64px;
  }
  .background-image {
    // width: 1920px;
    position: relative;
    overflow: hidden;
    height: 360px;
    // display: flex;
    // justify-content: center;
    > div {
      overflow: hidden;
    }
    .title {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 1200px;
      line-height: 58px;
      font-size: 36px;
      font-weight: 600;
      color: #333;
    }
  }
  .col {
    background-color: #f5f8fe;
    height: 100px;
    //min-height: 100px;
    //width: 1920px;
    // width:1200px;
    display: flex;
    justify-content: space-between; //所有的水平居中
    align-items: center; //所有的垂直居中
    //margin: 0 auto;
    position: relative;
    img {
      display: inline-block; //变成行内块
      width: 90px;
      min-width: 90px;
      height: 90px;
      min-height: 90px;
    }
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 90px;
    }
    .a-text {
      display: inline-block;
      margin-left: 10px;
    }
    p {
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: 500;
      color: #333;
      line-height: 25px;
      margin-right: 112px;
    }
    span {
      font-size: 14px;
      line-height: 20px;
      color: #535560;
    }
  }
  .recommend-list {
    //width: 100%;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-content: center;
    li {
      list-style: none;
      width: 300px;
      cursor: pointer;
    }
  }
  .hot-information {
    // background-color: pink;
    height: 490px;
    .blog-part {
      width: 1200px;
      min-width: 1200px;
      margin: 0 auto;
      // height: 490px;
      background-color: white;
      .blog-head {
        height: 83px;
        border-bottom: 1px solid rgba(200, 200, 219, 0.5);
        padding: 44px 0 6px;
        display: flex;
        align-items: flex-end;
        .blog-head-pic {
          width: 36px;
          height: 36px;
        }
        .blog-head-title {
          font-weight: 500;
          font-size: 20px;
          color: #333;
          letter-spacing: 0;
          margin: 0 20px 0 4px;
        }
        .blog-head-tip {
          font-size: 12px;
          color: #9196a6;
        }
      }
      .blog-body {
        height: 408px;
        padding: 6px 0 61px;
        display: flex;
        flex-direction: row;
        .blog-content-title {
          height: 20px;
          margin: 20px 0;
        }
        .blog-recommend {
          width: 800px;
          margin-right: 40px;
          .blog-recommend-title {
            display: flex;
            justify-content: space-between;
            .recommend-title {
              display: flex;
              align-items: center;
              img {
                user-select: none;
                &.icon {
                  height: 18px;
                  margin-right: 6px;
                }
              }
            }
            .recommend-change {
              display: flex;
              align-items: center;
              user-select: none;
              cursor: pointer;
              .recommend-change-text {
                font-size: 14px;
                color: #9196a6;
                letter-spacing: 0;
                margin-right: 6.9px;
              }
              .recommend-change-pic {
                width: 12px;
                height: 21px;
              }
            }
          }
          .blog-recommend-content {
            width: 412px;
            height: 100%;
            position: relative;
            .recommend-content-container {
              margin: 16px 0;
              cursor: pointer;
              position: static;
              .recommend-content-title {
                width: 410px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
              }
              .recommend-content-text {
                display: none;
                height: 45px;
                margin: 10px 0 20px;
                font-size: 14px;
                color: #6d717d;
                letter-spacing: 0;
              }
              .recommend-content-pic {
                display: none;
                position: absolute;
                top: 0;
                left: 432px;
              }
            }
            .recommend-active {
              .recommend-content-title {
                font-weight: 600;
                font-size: 16px;
                color: #333;
                letter-spacing: 0;
              }
              .recommend-content-text {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .recommend-content-pic {
                display: block;
                position: absolute;
                top: 0;
                right: 0;
                width: 368px;
                height: 280px;
                border-radius: 5px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
        }
        .blog-hot-list {
          width: 360px;
          flex: 1;
          .blog-hot-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .hot-title {
              display: flex;
              align-items: center;
              img {
                user-select: none;
                &.icon {
                  height: 18px;
                  margin-right: 6px;
                }
              }
            }
            .hot-more {
              font-size: 14px;
              color: #333333;
              letter-spacing: 0;
              user-select: none;
              cursor: pointer;
            }
          }
          .blog-hot-content {
            display: flex;
            flex-direction: column;
            .blog-hot-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              height: 20px;
              user-select: none;
              .hot-item-index {
                margin-right: 10px;
                font-family: ArialMT;
                font-size: 14px;
                color: #ea846c;
                letter-spacing: 0;
              }
              .hot-index-before {
                font-family: Impact;
                font-size: 16px;
                color: #ea846c;
                letter-spacing: 0;
              }
              .hot-item-title {
                display: flex;
                align-items: center;
                .item-title-text {
                  display: inline-block;
                  width: 100%;
                  max-width: 340px;
                  font-size: 14px;
                  color: #333333;
                  // letter-spacing: 0;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  &:hover {
                    cursor: pointer;
                    color: #0175ff;
                  }
                }
                .item-title-pic {
                  display: flex;
                  align-items: center;
                  margin-left: 6px;
                }
              }
            }
          }
        }
      }
    }
  }
  .question {
    background-color: #f5f8fe;
    height: 557px;
    position: relative;

    .qa-part {
      width: 1200px;
      margin: 0 auto;
      .qa-head {
        // height: 54px;
        width: 100%;
        // border-bottom: 1px solid rgba(200, 200, 219, .5);
        line-height: 43px;
        margin-bottom: 30px;
        // vertical-align: top;
        height: 83px;
        border-bottom: 1px solid rgba(200, 200, 219, 0.5);
        padding: 40px 0 6px;
        display: flex;
        // align-items: flex-end;
        .qa-head-title {
          font-size: 20px;
          font-weight: 500;
          color: #333;
          letter-spacing: 0;
          margin: 0 20px 0 4px;
        }
        .qa-head-tip {
          top: 5px;
          font-size: 12px;
          color: #9196a6;
        }
        .hot-more {
          position: absolute;
          right: 0;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          user-select: none;
          cursor: pointer;
        }
      }
      .qa-body {
        flex-direction: row;
        display: flex;
        height: 384px;
        width: 590px;
        .left {
          position: relative;
          .topicqa-item {
            transform: translate(30px, -350px);
            cursor: pointer;
            .topicqa-item-title {
              font-size: 20px;
              font-weight: 700;
              width: 520px;
            }
            .topicqa-item-content {
              width: 300px;
              margin-top: 32px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 4;
            }
          }
          .el-button {
            background-color: #0175ff;
            min-width: 110px;
            min-height: 42px;
            border-radius: 2px;
            color: #fff;
            font-size: 14px;
            line-height: 20px;
            border-color: #0175ff;
            transform: translate(30px, -280px);
          }
        }
        .qa-list {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          position: relative;
          height: 384px;
          margin-left: 20px;
          .qa-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 16px 20px;
            background: #ffffff;
            border-radius: 4px;
            width: 590px;
            height: 120px;
            &:hover {
              box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
              .qa-item-title {
                color: #0175ff;
              }
            }
          }
          .qa-item-title {
            font-size: 16px;
            line-height: 22px;
            font-weight: 600;
            color: #333333;
            letter-spacing: 0;
            cursor: pointer;
          }
          .qa-item-content {
            font-size: 14px;
            line-height: 20px;
            color: #6d717d;
            letter-spacing: 0;
            margin: 10px 0 16px;
            cursor: pointer;
            // width: 548px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          .item-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .qa-message-author {
              font-size: 14px;
              line-height: 20px;
              color: #333333;
              letter-spacing: 0;
              .item-time {
                font-size: 14px;
                color: #9196a6;
                letter-spacing: 0;
              }
            }
            .qa-message-data {
              display: flex;
              font-size: 14px;
              color: #9196a6;
              user-select: none;
              p {
                display: flex;
                margin-left: 18.5px;
                align-items: center;
                img {
                  width: 18px;
                  margin-right: 6px;
                }
                span {
                  line-height: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
  .question-bank {
    width: 1200px;
    margin: 0 auto;
    height: 593px;
    padding-top: 44px;
    .question-bank_header {
      height: 43px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: solid 1px #c8c8db;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-title {
        display: inline-block;
        margin-right: 20px;
        margin-left: 4px;
        color: #333333;
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
      }
      &-describ {
        color: #9196a6;
        font-size: 12px;
        margin-top: 10px;
      }
      a {
        &:hover {
          background: none;
        }
      }
      &-more {
        font-size: 14px;
        color: #333333;
        cursor: pointer;
      }
    }
    .question-bank_content {
      width: 100%;
      height: 420px;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      .question-bank_content-aside {
        width: 210px;
        height: 100%;
        background-color: #e9f1ff;
        border-radius: 4px;
        ul {
          width: 100%;
          margin-top: 10px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          cursor: pointer;
          li {
            display: inline-block;
            width: 210px;
            height: 68px;
            padding-left: 20px;
            margin-bottom: 7.5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            z-index: 100;
            .meun_title {
              font-size: 16px;
              font-weight: 600;
              color: #333333;
            }
            .meun_level-option {
              display: inline-block;
              font-size: 12px;
              font-weight: 600;
              color: #9196a6;
              span {
                &:hover {
                  color: #0175ff;
                }
                display: inline-block;
                padding: 0 5px;
                height: 100%;
                border-left: 2px solid #9196a6;
                &:first-child {
                  border: none;
                  padding-left: 0;
                }
              }
            }
          }

          .isClick {
            background-image: linear-gradient(270deg, rgba(1, 117, 255, 0) 0%, #0175ff 100%);
            span {
              color: #ffffff;
            }
            .meun_level-option {
              span {
                border-left: 2px solid #ffffff;
              }
            }
          }
        }
        .question-bank_img {
          // position: relative;
          bottom: 92px;
          left: 79px;
        }
      }
      .question-bank_content-main {
        display: flex;
        align-content: space-between;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 990px;
        .question-bank_item {
          margin-left: 20px;
          width: 310px;
          height: 200px;
          border: #e3e3ed 1px solid;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px 17px 20px 20px;
          border-radius: 4px;
          &::before,
          &::after {
            position: absolute;
            left: 0;
            bottom: 0;
            content: '';
            width: 308px;
            height: 2px;
            background: #deeaf8;
          }
          &::after {
            width: 0;
            background: #0175ff;
            transition: all 0.3s;
          }
          &:hover {
            box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
            &::after {
              width: 308px;
            }
          }
          .question-bank_item-header {
            width: 100%;
            .question-bank_item-title {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              span {
                font-size: 16px;
                line-height: 22px;
                font-weight: 600;
                color: #333333;
              }
            }
            .question-bank_item-content {
              margin-top: 10px;
              font-size: 14px;
              line-height: 20px;
              color: #6d717d;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
          .question-bank_item-footer {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            .question-bank_item-footer-left {
              span {
                font-size: 12px;
                color: #9196a6;
                line-height: 17px;
                display: block;
              }
            }
            button {
              width: 88px;
              height: 32px;
              border: 1px solid #0175ff;
              border-radius: 2px;
              font-size: 14px;
              color: #0175ff;
              background-color: #ffffff;
              cursor: pointer;
            }
            button:hover {
              background-color: #0175ff;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .exam-bank {
    background: #f5f8fe;
    height: 593px;
    .exam-bank_container {
      width: 1200px;
      margin: 0 auto;
      padding-top: 40px;
      .exam-bank_header {
        height: 43px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px #c8c8db;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &-title {
          display: inline-block;
          margin-right: 20px;
          margin-left: 4px;
          color: #333333;
          font-size: 20px;
          font-weight: 500;
          line-height: 28px;
          text-align: center;
        }
        &-describ {
          color: #9196a6;
          font-size: 12px;
          margin-top: 10px;
        }
        a {
          &:hover {
            background: none;
          }
        }
        &-more {
          font-size: 14px;
          color: #333333;
          cursor: pointer;
        }
      }
      .exam-bank_content {
        padding-top: 30px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-content: space-between;
        height: 450px;
        width: 1200px;
        .waiting {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .exam-bank_item {
          position: relative;
          width: 386px;
          height: 200px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: #ffffff;
          border-radius: 4px;
          overflow: hidden;
          &::before,
          &::after {
            position: absolute;
            left: 0;
            bottom: 0;
            content: '';
            width: 386px;
            height: 2px;
            background: #deeaf8;
          }
          &::after {
            width: 0;
            background: #0175ff;
            transition: all 0.3s;
          }
          &:hover {
            box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
            &::after {
              width: 386px;
            }
          }
          .exam-bank_item-header {
            width: 100%;
            .exam-bank_item-title {
              color: #333333;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              letter-spacing: 0;
              line-height: 22px;
              div {
                display: inline;
                &:last-child {
                  font-size: 16px;
                  line-height: 22px;
                  font-weight: 600;
                }
                &.exam-bank_item-title-type {
                  display: inline-block;
                  vertical-align: middle;
                  min-width: 40px;
                  height: 18px;
                  margin-right: 6px;
                  padding: 0 5px;
                  background-image: linear-gradient(-270deg, #61b4ff 0%, #2f8cff 100%);
                  border-radius: 1px 8px 1px 8px;
                  span {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: LucidaGrande-Bold;
                    font-size: 12px;
                    line-height: 15px;
                    text-align: center;
                    color: #ffffff;
                  }
                }
              }
            }
            .exam-bank_item-content {
              margin-top: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              font-size: 14px;
              color: #6d717d;
              letter-spacing: 0;
              line-height: 20px;
            }
          }
          .exam-bank_item-footer {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            &-left {
              span {
                font-size: 12px;
                color: #9196a6;
                line-height: 17px;
                display: block;
              }
            }
            button {
              width: 88px;
              height: 32px;
              border: 1px solid #0175ff;
              border-radius: 2px;
              font-size: 14px;
              color: #0175ff;
              background-color: #ffffff;
              cursor: pointer;
              &:hover {
                background-color: #0175ff;
                color: #ffffff;
              }
            }
          }
        }
      }
    }
  }

  .footer {
    background-color: #535c6c;
    .friendly-link {
      width: 1200px;
      margin: 0 auto;
      height: 194px;
      padding-top: 50px;
      padding-bottom: 30px;
      display: flex;
      justify-content: space-between;
      .project-introduce {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
      }
      .more-links {
        display: flex;
        flex-direction: row;
        .support-service,
        .more-friendly-links {
          margin-right: 100px;
        }
        .more-links-share {
          margin-top: 26px;
          display: flex;
          > img {
            margin-right: 12px;
            cursor: pointer;
          }
        }
      }
    }
    .more-links-title {
      font-weight: 600;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      margin-bottom: 8px;
      user-select: none;
    }
    .more-links-content {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 28px;
      user-select: none;
      cursor: pointer;
    }
    .footer-copyRights {
      height: 58px;
      border-top: 1px solid #667083;
      display: flex;
      justify-content: center;
      align-items: center;
      P {
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
  .el-backtop {
    // margin-right: -200px;
    bottom: 48px;
    right: 290;
  }
}
</style>
