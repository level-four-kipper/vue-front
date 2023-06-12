<template>
  <div class="main">
    <!-- 背景图 -->
    <div class="background">
      <div class="background_desc">
        <div class="head-title">问答</div>
        <div class="head-text">汇集知识碎片，解决技术难题</div>
      </div>
    </div>
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <Breadcrumb :list="[{name: '问答',path: ''}]" />
    </div>
    <div class="ask-topic">
      <div class="left">
        <!-- 问答列表 -->
        <div class="qa-list">
          <div class="qa-list-head">
            <span class="all-question">全部问题</span>
            <div class="module-list">
              <div v-for="(item, index) in navList" :key="index" class="index" @click="handleNavClick(index, item)">
                <span :class="{'active': item.sort_status === curSortStatus}">{{item.lable}}</span>
              </div>
            </div>
          </div>
          <div class="qa-item" v-for="(item, index) in answerList" :key="item.id">
            <QuestionContent :question="item" @updateCollect="handleUpdateCollect($event, index)" @updateLike="handleUpdateLike($event,index)" />
          </div>
          <!-- 加载更多 -->
          <div class="qa-load">
            <el-icon v-if="loading" class="is-loading">
              <Loading />
            </el-icon>
            <span v-else :class="{'more': loadStatus === 2}" @click="loadStatus === 2 && getAnswerList() ">{{loadMap[loadStatus]}}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <!-- 提问题/我的问答 -->
        <div class="quiz-btn">
          <div @click="jumpPage(`/publishQuestion`)">
            <img src="@/assets/img/blog-index/writeblog-icon.png" />
            <p>提问题</p>
          </div>
          <div @click="jumpPage(`/personalIndex`,{tabIndex:1})">
            <img src="@/assets/img/answerPhoto/我的问答.png" />
            <p>我的问答</p>
          </div>
        </div>
        <!-- 热门问题 -->
        <div class="hot-question-list">
          <div class="hot-question-title">
            <span class="hot-ask">近期热门问题</span>
          </div>
          <div class="hot-question-content">
            <div class="hot-question-item" v-for="(item,index) in qa.data" :key="item.id">
              <span v-if="index<3" class="hot-item-num">
                <img v-if="index === 0" src="@/assets/img/answerPhoto/hotOne.png" />
                <img v-else-if="index === 1" src="@/assets/img/answerPhoto/hotTwo.png" />
                <img v-else src="@/assets/img/answerPhoto/hotThree.png" />
              </span>
              <span v-else class="hot-item-num" :class="[ index>2?'hot-index-after':'']">{{index+1}}</span>
              <span class="item-title" :class="[ index>2?'hot-title-after':'']" @click="jumpQuizDetail(index, item.id)">{{item.title}}</span>
            </div>
          </div>
        </div>
        <!-- 热门回答 -->
        <div class="hot-answer-list">
          <div class="hot-answer-title">
            <span class="hot-answer">近期热门回答</span>
          </div>
          <div class="hot-answer-item" v-for="(item,index) in answerHotList" :key="item.id">
            <div class="answer-head">
              <div class="answer-head-left">
                <ComUser :userId="item.user_id" style="margin-top:-5px" />
                <!-- <img src="@/assets/img/answerPhoto/个人.png" /> -->
                <!-- <img src="@/assets/img/answerPhoto/团队.png" /> -->
                <!-- <span class="user-name" @click="toAuthorIndex(item.user_id)">{{item.user_name}}</span> -->
              </div>
              <div class="answer-head-right">
                <p class="answer-support" @click="addAnswerPraise(item.article_id)">
                  <span v-show="!item.like_flag">
                    <img src="@/assets/img/answerPhoto/点赞.png" alt="未点赞" />
                  </span>
                  <span v-show="item.like_flag">
                    <img src="@/assets/img/answerPhoto/点赞备份.png" alt="点赞" />
                  </span>
                  <span>{{item.like_count}}人赞同</span>
                </p>
              </div>
              <!-- <img :src="codeSrcImg(code)" /> -->
              <!-- <img src="@/assets/img/answerPhoto/金牌博主.png" />
                            <img src="@/assets/img/answerPhoto/新晋博主.png" />
                            <img src="@/assets/img/answerPhoto/银牌博主.png" />
              <img src="@/assets/img/answerPhoto/钻石博主.png" />-->
            </div>
            <div class="hot-answer-content" @click="jumpQuizDetail(index, item.question_id)">{{item.content}}</div>
            <div class="answer-foot">
              <img src="@/assets/img/answerPhoto/问题.png" class="ask-photo" />
              <p class="qa-title" @click="jumpQuizDetail(index, item.question_id)">{{item.title}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-backtop :right="40" :bottom="293">
      <img src="@/assets/img/index/g-backtop.png" />
    </el-backtop>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue'
import VMdPreview from '@/components/VMdPreview.vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowRight, Message } from '@element-plus/icons-vue'
import { crtTimeFtt } from '@/utils/timeDiff.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import ComUser from '@/components/ComUser.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import QuestionContent from './components/QuestionContent.vue'
import http from '@/utils/https.js'
import { fetchAnswerList, fetchQuestionHotList, fetchAnswerHotList, fetchAnswerIndex } from '@/api/answer.js'
import { htmlToString } from '@/utils/utils.js'
const jumpPage = (path, query) => {
  router.push({ path, query })
}
// 跳转详情页
const jumpQuizDetail = (index, id) => {
  addView(index, id)
  const routeUrl = router.resolve({
    path: `/questionAnswerDetail/${id}`
  })
  window.open(routeUrl.href, '_blank')
}
const navList = [
  // { lable: '推荐', sort_status: 0 },
  { lable: '最新', sort_status: 1 },
  { lable: '最热', sort_status: 2 }
]
const router = useRouter()
const route = useRoute()
const text = ref('')
const isFocus = ref(false)
const currentIndex = ref(0)
const answerList = ref([])
const totalNum = ref(0)
const totalPage = ref(0)
const currentPage = ref(1)
const currentPageSize = ref(10)
const answerHotList = ref([])
const questiontitle = ref('')
const questiondiscribe = ref('')
const questiontag = ref([])
const loadStatus = ref(1)
const curSortStatus = ref(1)
const list_tags = ref([])
//加载更多
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})
const handleFinish = () => {
  if (answerList.value.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (currentPage.value < totalPage.value) {
    currentPage.value++
    // 加载更多
    loadStatus.value = 2
  } else if (currentPage.value === totalPage.value) {
    // 没有更多了
    loadStatus.value = 3
  }
}
// 加载更多
// function loadMore() {
//   currentPageSize.value += 10
//   getAnswerList()
// }
//标签
const saveTag = () => {
  list_tags.value.push(questiontag.value)
  questiontag.value = ''
}
const handleClose = item => {
  list_tags.value.splice(list_tags.value.indexOf(item), 1)
}
// 问答列表
const qa = reactive({})
// 跳转作者首页
const toAuthorIndex = function (id) {
  const routeUrl = router.resolve({
    path: `/authorIndex/${id}`
  })
  window.open(routeUrl.href, '_blank')
}
// 发布问题
const inputQuestion = type => {
  http
    .post('/quiz/create', {
      title: questiontitle.value,
      content: questiondiscribe.value,
      list_tags: list_tags.value,
      status: 0,
      hide: 0,
      issue: 0
    })
    .then(res => {
      if (res.code === 0) {
        curSortStatus.value = 1
        questiontitle.value = ''
        questiondiscribe.value = ''
        list_tags.value = ''
      } else {
        ElMessage({
          message: res.msg || res.data.error,
          type: 'error'
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}
// 推荐最新最热
const handleNavClick = (index, item) => {
  currentPageSize.value = 10
  currentPage.value = 1
  curSortStatus.value = item.sort_status
}
// 请求问答首页展示
function getAnswerList() {
  const params = {
    page_size: currentPageSize.value,
    curr_page: currentPage.value,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      issue: 0,
      hide: 0,
      sort_status: curSortStatus.value
    }
  }
  fetchAnswerList(params)
    .then(res => {
      if (res.code === 0 && res.data) {
        res.data.list.forEach(item => {
          console.log(item.hot_answer)
          if (item.hot_answer == null) {
            item.content = ''
          } else if (item.hot_answer.content == null) {
            item.hot_answer.content = ''
          } else {
            item.hot_answer.content = handleContent(htmlToString(item.hot_answer.content.replace(/(!\[DESC\]\()+[\S]+\)/g, '')))
            console.log(item.hot_answer.content)
          }
        })
        answerList.value = [...answerList.value, ...res.data.list]
        console.log('answerList', answerList.value)

        totalNum.value = res.data.total_count
        totalPage.value = res.data.total_page
        handleFinish()
      } else {
        ElMessage({
          message: res.msg || res.data.error,
          type: 'error'
        })
      }
    })
    .catch(err => console.log(err))
}
// 请求热门回答
function getHotAnswer() {
  fetchAnswerHotList()
    .then(res => {
      answerHotList.value = res.data.slice(0, 4)
    })
    .catch(err => console.log(err))
}
// 浏览 添加浏览状态后再加上是否浏览的参数
const addView = (index, id) => {
  http
    .post('/browse-info/add', {
      article_id: id,
      article_type: 1
    })
    .then(() => {
      fetchAnswerIndex({
        id,
        sort_status: 0
      }).then(res => {
        if (res.code === 0) {
          const obj = { look_flag: res.data.look_flag || 0, look_count: res.data.look_count || 0 }
          answerList.value.splice(index, 1, { ...answerList.value[index], ...obj })
        }
      })
    })
    .catch(err => console.log(err))
}
// 收藏 添加收藏状态后再加上是否收藏的参数
const addCollect = (index, id) => {
  http
    .post('/collect-info/add', {
      article_id: id,
      article_type: 1
    })
    .then(() => {
      fetchAnswerIndex({
        id,
        sort_status: 0
      }).then(res => {
        if (res.code === 0) {
          const obj = { star_flag: res.data.star_flag || 0, star_count: res.data.star_count || 0 }
          answerList.value.splice(index, 1, { ...answerList.value[index], ...obj })
        }
      })
    })
    .catch(err => console.log(err))
}
// 点赞 添加点赞状态后再加上是否点赞的参数
const addAnswerPraise = id => {
  http
    .post('/like-info/add', {
      article_id: id,
      article_type: 3
    })
    .then(() => {
      getHotAnswer()
    })
    .catch(err => console.log(err))
}
const addQuizPraise = (index, id) => {
  http
    .post('/like-info/add', {
      article_id: id,
      article_type: 1
    })
    .then(() => {
      fetchAnswerIndex({
        id,
        sort_status: 0
      }).then(res => {
        if (res.code === 0) {
          const obj = { like_flag: res.data.like_flag || 0, like_count: res.data.like_count || 0 }
          answerList.value.splice(index, 1, { ...answerList.value[index], ...obj })
        }
      })
    })
    .catch(err => console.log(err))
}
//处理显示文字长度
const handleContent = str => {
  // let newStr = ''
  // let length = 0
  // for (let i = 0; i < str.length; i++) {
  //   if (length > 125) {
  //     newStr = newStr + '...'
  //     break
  //   }
  //   //使用的正则表达式
  //   str.charAt(i).match(/[^\x00-\xff]/g) ? (length += 2) : (length += 1)
  //   newStr += str[i]
  // }
  return str
}

const handleUpdateCollect = (obj, index) => { 
  answerList.value[index].star_flag = obj.star_flag
  answerList.value[index].star_count = obj.star_count
}
const handleUpdateLike = (obj, index) => {
  answerList.value[index].like_flag = obj.like_flag
  answerList.value[index].like_count = obj.like_count
}
//监听数据
watch(curSortStatus, (newVal, oldVal) => {
  answerList.value = []
  currentPage.value = 1
  currentPageSize.value = 10
  getAnswerList()
})
//content获取高度
const showMore = ref(false)
const showMoreContent = ref(false)
const answerContent = ref(null)
// const height = document.getElementClassName("look-more".offsetHeight)

onMounted(() => {
  getAnswerList()
  //热门问题
  fetchQuestionHotList()
    .then(res => {
      qa.data = res.data.slice(0, 8)
      console.log(qa.data)
    })
    .catch(err => console.log(err))
  // 热门回答
  getHotAnswer()
})
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
.main {
  width: 100%;
  min-width: 1200px;
  .background {
    width: 100%;
    background: url('@/assets/img/answerPhoto/0003.png') no-repeat center;
    background-size: cover;
    height: 200px;
    min-width: 1200px;
    position: relative;
    .background_desc {
      top: 50%;
      transform: translateY(-50%);
      width: 1200px;
      margin: 0 auto;
      color: #333333;
      .head-title {
        margin-bottom: 16px;
        line-height: 42px;
        font-size: 30px;
        font-weight: 600;
      }
      .head-text {
        line-height: 28px;
        font-size: 20px;
      }
    }
  }
  .breadcrumb {
    font-family: PingFangSC-Regular;
    margin: 0px auto 0;
    width: 1200px;
  }
  .ask-topic {
    display: flex;
    justify-content: center;
    .left {
      width: 780px;
      flex-shrink: auto;
      display: flex;
      flex-direction: column;
      max-width: 1140px;
      .ask-title {
        font-family: PingFangSC-Semibold;
        font-size: 18px;
        color: #333333;
        padding-top: 40px;
        font-weight: 600;
      }
      .ask-body {
        .ask-row-avatar {
          display: flex;
          align-items: center;
          padding-top: 20px;
          .user-photo {
            width: 54px;
            height: 54px;
          }
          .text-title {
            flex: 1;
            margin-left: 16px;
            width: 708px;
            :deep(.el-input__inner) {
              height: 54px;
            }
          }
        }
        .ask-row-content {
          margin-left: 70px;
          width: 710px;
          margin-top: 10px;
          :deep(::el-textarea__inner) {
            height: 80px;
          }
          :deep(::placeholder) {
            padding-top: 17px;
          }
        }
        .ask-row-tag {
          margin-left: 70px;
          width: 710px;
          margin-top: 10px;
          :deep(.el-input__wrapper) {
            height: 52px;
          }
          :deep(.is-closable) {
            margin-right: 12px;
            margin-bottom: 5px;
          }
        }
        .deliver {
          float: right;
          margin-top: 16px;
          background-color: #0175ff;
          border-radius: 4px;
          width: 120px;
          height: 42px;
        }
      }
      .qa-list {
        max-width: 1140px;
        display: flex;
        flex-direction: column;
        .qa-list-head {
          .all-question {
            display: flex;
            font-family: PingFangSC-Semibold;
            font-size: 18px;
            color: #333333;
            margin-top: 30px;
            font-weight: 600;
          }
          .module-list {
            display: flex;
            float: right;
            justify-content: flex-end;
            width: 108px;
            margin-top: -20px;
            .index {
              width: 28px;
              margin-left: 20px;
              text-align: center;
              span:hover {
                color: #0175ff;
              }
              .active {
                color: #0175ff;
              }
            }
            span {
              display: flex;
              cursor: pointer;
              font-size: 14px;
              color: #333333;
            }
          }
        }
        .qa-item {
          align-items: center;
          margin-top: 30px;
          border-bottom: 1px solid rgba(200, 200, 219, 0.5); 
        }
        .qa-load {
          margin: 30px 0 60px;
          text-align: center;
          font-size: 16px;
          line-height: 22px;
          span {
            color: #6d717d;
            &.more {
              color: #0175ff;
              &:hover {
                cursor: pointer;
                opacity: 0.85;
              }
            }
          }
        }
      }
    }
    .right {
      margin-left: 60px;
      width: 360px;
      flex-shrink: auto;
      display: flex;
      flex-flow: column;
      align-items: center;
      .select-topic {
        flex-direction: column;
        padding-top: 40px;
        display: flex;
        .select {
          font-size: 18px;
          color: #333333;
        }
        .img-topic {
          margin-top: 20px;
        }
        .topic-footer {
          .man-total {
            font-size: 14px;
            color: #9196a6;
            margin-top: 27px;
            max-width: 101px;
          }
          .deliver {
            float: right;
            background-color: #0175ff;
            border-radius: 4px;
            width: 120px;
            height: 42px;
            margin-top: -30px; 
          }
        }
      }
      .quiz-btn {
        display: flex;
        justify-content: space-between;
        margin-top: 60px;
        left: -10px;
        div {
          width: 170px;
          height: 83px;
          line-height: 0;
          text-align: center;
          background: #ffffff;
          box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
          border-radius: 4px;
          margin-left: 20px;
          &:hover {
            cursor: pointer;
            opacity: 0.85;
          }
          img {
            width: 34px;
            height: 30px;
            margin: 16px 0 5px;
          }
          p {
            font-size: 14px;
            line-height: 20px;
            color: #333;
          }
        }
      }
      .hot-question-list {
        width: 100%;
        .hot-question-title {
          display: flex;
          .hot-ask {
            font-size: 18px;
            color: #333333;
            margin-top: 60px;
            font-weight: 600;
          }
        }
        .hot-question-content {
          .hot-question-item {
            .hot-item-num {
              top: 25px;
              display: flex;
            }
            .item-title {
              font-size: 16px;
              color: #333333;
              margin-left: 30px;
              display: flex;
              cursor: pointer;
              font-weight: 400;
              &:hover {
                cursor: pointer;
                color: #0175ff;
              }
            }
            .hot-index-after {
              font-family: Impact;
              font-size: 16px;
              color: #ea846c;
            }
            .hot-title-after {
              font-size: 14px;
              color: #333333;
            }
          }
        }
      }
      .hot-answer-list {
        width: 100%;
        margin-top: 60px;
        .hot-answer-title {
          display: flex;
          .hot-answer {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
            font-weight: 600;
          }
        }
        .hot-answer-item {
          .answer-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .answer-head-left {
              cursor: pointer;
              .user-name {
                font-size: 14px;
                color: #333333;
                margin-left: 12px;
                top: -10px;
                font-weight: 600;
              }
            }
            .answer-head-right {
              right: 0;
              display: flex;
              position: absolute;
              align-content: center;
              justify-items: center;
              justify-content: center;
              .answer-support {
                cursor: pointer;
                align-items: center;
                display: flex;
                span {
                  font-size: 14px;
                  color: #9196a6;
                  margin-left: 4px;
                }
                img {
                  margin-top: 4px;
                }
              }
            }
          }
          .hot-answer-content {
            font-size: 14px;
            color: #6d717d;
            max-width: 360px;
            margin-top: 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 58em;
            white-space: nowrap;
            cursor: pointer;
            // text-align: justify;
            // display: -webkit-box;
            // -webkit-line-clamp: 3;
            // -webkit-box-orient: vertical;
            &:hover {
              cursor: pointer;
              color: #0175ff;
            }
          }
          .answer-foot {
            height: 41px;
            background-color: #eef3fd;
            margin-top: 10px;
            margin-bottom: 30px;
            .ask-photo {
              margin-left: 10px;
              margin-top: 12px;
            }
            .qa-title {
              font-size: 14px;
              color: #333333;
              margin-left: 38px;
              top: -25px;
              text-overflow: ellipsis;
              text-align: justify;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
              cursor: pointer;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
}
</style>
