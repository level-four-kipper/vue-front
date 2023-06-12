<template>
  <!-- 题库首页 -->
  <div class="main">
    <!-- 背景图 -->
    <div class="background">
      <div class="background_desc">
        <h3>题库</h3>
        <p>收集海量题目，积累知识精华</p>
      </div>
    </div>
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <Breadcrumb :list="[{ name: '题库', path: '' }]" />
    </div>
    <!-- 领域 -->
    <AreaHeader @handle-area-change="handleAreaChange" />
    <!-- 展示区 -->
    <div class="ask-topic">
      <div class="left">
        <!-- 题库 -->
        <div class="qa">
          <div class="qa-list-head">
            <div class="all-question">
              已为您展示
              <span>{{ answerList.length }}</span> 条
            </div>
            <div class="module-list">
              <div v-for="(item, index) in navList" :key="index" class="index">
                <span :class="{ active: item.query_condition === curSortStatus }" @click="handleNavClick(index, item)">{{
                  item.lable
                }}</span>
              </div>
            </div>
          </div>
          <!-- 题库列表 -->
          <div class="qa-list">
            <div v-for="item in answerList" :key="item.article_id" class="qa-item">
              <!-- 题目 -->
              <div class="qa-header">
                <div class="btn-2">
                  <div class="exam-bank_item-title-type">
                    <span>{{ item.area }}</span>
                  </div>
                  <p class="qa-item-title" @click="jumpLearn(index, item.id)">{{ item.name }}</p>
                </div>
                <div class="qa-message-data" @click="addCollect(item)">
                  <span v-show="!item.is_collect">
                    <img src="@/assets/img/answerPhoto/收藏.png" alt="未收藏" />
                  </span>
                  <span v-show="item.is_collect">
                    <img src="@/assets/img/answerPhoto/收藏备份2.png" alt="收藏" />
                  </span>
                  <span>{{ item.collect_count }}</span>
                </div>
              </div>
              <!-- 题目概述 -->
              <p class="qa-item-content">{{ item.description }}</p>
              <!-- 表尾 -->
              <div class="item-footer">
                <div class="qa-message-data">
                  <span>收录题量：{{ item.total_questions }}</span>
                  <span>访问：{{ item.browse_count }}</span>
                </div>
                <div class="qa-learn">
                  <el-button type="primary" plain color="#0175FF" @click="jumpLearn(index, item.id)">
                    <span>开始学习</span>
                  </el-button>
                </div>
              </div>
            </div>
            <!-- 加载更多 -->
            <div class="qa-load">
              <el-icon v-if="loading" class="is-loading">
                <Loading />
              </el-icon>
              <span v-else :class="{ more: loadStatus === 2 }" @click="loadStatus === 2 && handleLoadMore()">{{
                loadMap[loadStatus]
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <!-- 创建题库/我的题库 -->
        <div class="quiz-btn">
          <div @click="jumpPage({ path: '/questionBank/create', type: 'newTab' })">
            <img src="@/assets/img/blog-index/writeblog-icon.png" />
            <p>创建题库</p>
          </div>
          <div @click="jumpPage({ path: `/personalIndex`, query: { tabIndex: 3 } })">
            <img src="@/assets/img/questionPhoto/我的题库.png" />
            <p>我的题库</p>
          </div>
        </div>
        <!-- 热门题库 -->
        <div class="hot-question-list">
          <div class="hot-question-title">
            <span class="hot-ask">热门题库</span>
          </div>
          <div class="hot-question-content">
            <div
              v-for="(item, index) in qa.data"
              :key="item.id"
              class="hot-question-item"
              @click="jumpPage({ path: '/questionBank/detail', query: { id: item.id } })">
              <span v-if="index < 3" class="hot-item-num">
                <img v-if="index === 0" src="@/assets/img/answerPhoto/hotOne.png" />
                <img v-else-if="index === 1" src="@/assets/img/answerPhoto/hotTwo.png" />
                <img v-else src="@/assets/img/answerPhoto/hotThree.png" />
              </span>
              <span v-else class="hot-item-num" :class="[index > 2 ? 'hot-index-after' : '']">{{ index + 1 }}</span>
              <span class="item-title" :class="[index > 2 ? 'hot-title-after' : '']" @click="jumpQuizDetail(index, item.id)">{{
                item.name
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 回到顶部 -->
    <el-backtop :right="40" :bottom="293">
      <img src="@/assets/img/index/g-backtop.png" />
    </el-backtop>
  </div>
</template>

<script setup>
import http from '@/utils/https.js'
import { fetchQuestionBank } from '@/api/qsBankManage.js'
import Breadcrumb from '@/components/Breadcrumb.vue'
import AreaHeader from '@/components/AreaHeader.vue'

const router = useRouter()

const loading = ref(false)
const tagId = ref()
const answerList = ref([])
const totalNum = ref(0)
const totalPage = ref(0)
const currentPage = ref(1)
const currentPageSize = ref(10)
const loadStatus = ref(1)
const curSortStatus = ref(1)

// 加载更多
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了',
})
// 问答列表
let qa = reactive({
  data: [],
})

const navList = [
  { lable: '最新', query_condition: 1 },
  { lable: '最热', query_condition: 2 },
]

const jumpPage = ({ path, query, type }) => {
  if (!type) {
    router.push({ path, query })
  } else {
    const routeUrl = router.resolve({ path, query })
    window.open(routeUrl.href, '_blank')
  }
}
const handleAreaChange = id => {
  tagId.value = id
  answerList.value = []
  getQuestionBank()
}
const handleFinish = () => {
  if (answerList.value.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (currentPage.value < totalPage.value) {
    // 加载更多
    loadStatus.value = 2
  } else if (currentPage.value === totalPage.value) {
    // 没有更多了
    loadStatus.value = 3
  }
}
// 跳转详情页
const jumpLearn = (index, id) => {
  addView(index, id)
  const routeUrl = router.resolve({
    path: `/questionBank/detail`,
    query: { id: id },
  })
  window.open(routeUrl.href, '_blank')
}
// 最新最热
const handleNavClick = (index, item) => {
  currentPageSize.value = 10
  currentPage.value = 1
  curSortStatus.value = item.query_condition
}
// 请求题库列表展示
function getQuestionBank(status = null) {
  const params = {
    page_size: currentPageSize.value,
    curr_page: currentPage.value,
    order: 'desc',
    entity: {
      area_id: tagId.value,
      query_condition: status ? status : curSortStatus.value,
    },
  }
  loading.value = true
  fetchQuestionBank(params)
    .then(({ data }) => {
      loading.value = false
      if (data) {
        // 最新
        if (!status) {
          answerList.value = [...answerList.value, ...data.list]
          totalNum.value = data.total_count
          totalPage.value = data.total_page
          handleFinish()
        }
        if (params.entity.query_condition === 2) {
          qa.data = data.list.slice(0, 8) ? data.list.slice(0, 8) : []
        }
      } else {
        // ElMessage({
        //   message: res.msg || res.data.error,
        //   type: 'error'
        // })
      }
    })
    .catch(() => (loading.value = false))
}
// 浏览 添加浏览状态后再加上是否浏览的参数
const addView = (index, id) => {
  http
    .post('/browse-info/add', {
      article_id: id,
      article_type: 5,
    })
    .then(() => {})

    .catch(err => {
      console.log(err)
    })
}
// 收藏 添加收藏状态后再加上是否收藏的参数
const addCollect = item => {
  http
    .post('/collect-info/add', {
      article_id: item.id,
      article_type: 5,
    })
    .then(res => {
      if (!res.code) {
        !item.is_collect ? item.collect_count++ : item.collect_count--
        item.is_collect = !item.is_collect
      }
    })
    .catch(err => console.log(err))
}
const handleLoadMore = () => {
  currentPage.value++
  getQuestionBank()
}
//监听数据
watch(curSortStatus, () => {
  answerList.value = []
  currentPage.value = 1
  currentPageSize.value = 10
  getQuestionBank()
})
onMounted(() => {
  getQuestionBank()
  getQuestionBank(2)
})
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  min-width: 1200px;
  .background {
    width: 100%;
    background: url('@/assets/img/questionPhoto/header.png') no-repeat center;
    background-size: cover;
    height: 200px;
    min-width: 1200px;
    position: relative;
    .background_desc {
      top: 50%;
      transform: translateY(-50%);
      width: 1200px;
      margin: 0 auto;
      h3 {
        font-size: 30px;
        font-weight: 600;
        margin-bottom: 16px;
        line-height: 42px;
      }
      p {
        font-size: 20px;
        line-height: 28px;
      }
    }
  }
  .breadcrumb {
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
      .qa {
        max-width: 1140px;
        display: flex;
        flex-direction: column;
        .qa-list-head {
          .all-question {
            font-size: 14px;
            line-height: 20px;
            span {
              color: #0175ff;
            }
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
        .qa-list {
          display: flex;
          flex-flow: column;
          align-items: center;
          position: relative;
          margin-top: 30px;
          .qa-item {
            width: 780px;
            border: 1px solid rgba(200, 200, 219, 0.5);
            padding: 20px 20px;
            background: #ffffff;
            border-radius: 4px;
            margin-bottom: 15px;
            &:hover {
              box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
            }
          }
          .qa-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .btn-2 {
              display: inline;
              align-items: center;
              display: flex;
              .exam-bank_item-title-type {
                display: inline-block;
                vertical-align: middle;
                min-width: 40px;
                height: 18px;
                margin-right: 8px;
                padding: 0 5px;
                background-image: linear-gradient(-270deg, #61b4ff 0%, #2f8cff 100%);
                border-radius: 1px 8px 1px 8px;
                span {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  line-height: 15px;
                  top: 2px;
                  text-align: center;
                  color: #ffffff;
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
            }
            .qa-message-data {
              display: flex;
              font-size: 14px;
              align-items: center;
              color: #9196a6;
              float: right;
              cursor: pointer;
              img {
                top: 2px;
              }
              span {
                margin-left: 6px;
              }
            }
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
            -webkit-line-clamp: 2;
          }
          .item-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .qa-message-data {
              font-size: 14px;
              color: #9196a6;
              span {
                margin-right: 30px;
              }
            }
            .qa-learn {
              .el-button {
                background-color: #ffffff;
                border-color: #0175ff;
                width: 88px;
                span {
                  font-weight: 400;
                  color: #0175ff;
                }
                &:hover {
                  background-color: #0175ff;
                  span {
                    color: #fff;
                  }
                }
              }
            }
          }
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
      .quiz-btn {
        display: flex;
        justify-content: space-between;
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
      //   .hot-man-list {
      //     width: 100%;
      //     .man-list {
      //       display: flex;
      //       font-size: 18px;
      //       color: #333333;
      //       margin-top: 60px;
      //       font-weight: 600;
      //     }
      //   }
    }
  }
}
</style>
