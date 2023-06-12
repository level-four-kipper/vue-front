<template>
  <div class="qaDetail">
    <Editor v-model="blogHtml" to-edit @save="getBlogContent" />
  </div>
</template>

<script setup name="questionAnswerDetail">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Editor from '@/components/Editor.vue'
// 数据
const breadcrumbList = ['首页', '问答', '问答详情']
const qaDetail = ref({ myAnswer: '' })
const relatedQuestions = ref([])
let showMoreAnswer = ref(false)
let sort = ref(1)
let replayId = ref(-1)

// 显示所有的comments
const showAnswers = computed(() => {
  if (!showMoreAnswer.value && qaDetail.value?.comments?.length > 5) {
    return qaDetail.value?.comments.slice(0, 5)
  }
  return qaDetail.value?.comments
})

// 关注待开发
const subscribe = () => {}
const toggleSort = s => {
  sort.value = s
}

const postAnswer = () => {
  const params = {
    question_id: route.params.id || qaDetail.value.id,
    content: qaDetail.value.myAnswer,
    article_type: 1,
  }
  addAnswer(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ showClose: true, message: '回答成功', type: 'success' })
        qaDetail.value.myAnswer = ''
        getAnswerList()
      } else {
        ElMessage({ showClose: true, message: '回答失败', type: 'error' })
      }
    })
    .catch(err => console.log(err))
}

const toggleLike = (answer, type) => {
  const params = {
    article_id: answer.id,
    article_type: type,
  }
  updateLike(params)
    .then(res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: '点赞失败', type: 'error' })
      }
    })
    .catch(err => {
      console.log(err)
      ElMessage({ showClose: true, message: '点赞失败', type: 'error' })
    })
}
const toggleCollect = (answer, type) => {
  const params = {
    article_id: answer.id,
    article_type: type,
  }
  updateCollect(params)
    .then(res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: '收藏失败', type: 'error' })
      }
    })
    .catch(err => {
      console.log(err)
      ElMessage({ showClose: true, message: '收藏失败', type: 'error' })
    })
}

const showComment = answer => {
  answer.commenting = !answer.commenting
  replayId.value = answer?.id
}

const changeReplay = comment => {
  replayId.value = comment.id
  comment.replay = ''
}

const replayComment = replay => {
  replay.replay = ''
}

const totalNum = ref(0)
const currentPage = ref(1)
const currentPageSize = ref(10)
const answerList = ref([])
const router = useRouter()
const route = useRoute()
const activeName = ref('first')
const harvestList = ref([])

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
    },
  }
  fetchAnswerList(params)
    .then(res => {
      console.log(res.data.list, 'fetchAnswerList')
      answerList.value = res.data.list
      totalNum.value = res.data.total_count
      currentPageSize.value = res.data.page_size
      currentPage.value = res.data.curr_page
    })
    .catch(err => console.log(err))
  getTotal()
}
// 请求点赞/被评论/被收藏总数
function getTotal() {
  const params = {}
  fetchTotal(params)
    .then(res => {
      harvestList.value = res.data
    })
    .catch(err => console.log(err))
}

// 请求问答主页的展示
function getAnswerDetail() {
  const params = {
    id: String(route.query.id),
    sort_status: 0,
  }
  fetchAnswerIndex(params)
    .then(res => {
      if (res.code === 0 && res?.data) {
        qaDetail.value = { ...res.data, myAnswer: '' }
        console.log('fetchAnswerIndex---2---', qaDetail)
      }
    })
    .catch(err => console.log(err))
}

// 请求关联问答
function queryAnswerDetail() {
  const params = {
    list_tags: ['java', 'python', 'c++'] || qaDetail.value?.list_tags,
  }
  getRelatedQuestion(params)
    .then(res => {
      if (res.code === 0 && res?.data) {
        relatedQuestions.value = { ...res.data }
      }
    })
    .catch(err => console.log(err))
}

onMounted(async () => {
  await getAnswerDetail()
  await queryAnswerDetail()
})
defineExpose({
  activeName,
})
</script>

<style lang="scss" scoped>
.qaDetail {
  width: 100vw;
  .qaDetail-top {
    margin-top: 20px;
  }
  .qaDetail-left {
    margin-left: 20px;
  }
  .qaDetail-flex {
    display: flex;
  }
  .qaDetail-right {
    display: flex;
    margin-left: auto;
  }
  .qaDetail-active {
    color: #0175ff;
  }
  .qaDetail-banner {
    background-color: #ffffff;
    margin: 20px 18.75%;
    .qaDetail-question {
      margin-top: 20px;
      .qaDetail-question-title {
        color: #333333;
        display: inline-block;
        vertical-align: middle;
        font-weight: 800;
        font-size: 26px;
      }
      button {
        border: 1px solid #0175ff;
        background-color: #ffffff;
        border-radius: 4px;
        line-height: 32px;
        padding: 0 12px;
        vertical-align: middle;
        img,
        i {
          vertical-align: middle;
          padding-right: 4px;
        }
      }
      .qaDetail-question-content {
        margin: 20px 0;
        font-size: 14px;
        color: #333333;
      }
      .qaDetail-question-info {
        color: #9196a6;
        font-size: 14px;
        line-height: 32px;
        span {
          padding-right: 20px;
        }
      }
      .qaDetail-question-tag {
        color: #0175ff;
        height: 32px;
        font-size: 14px;
        border-radius: 16px;
        background: #eef3fd;
        display: inline-block;
        margin: 20px 20px 10px 0px;
        padding: 4px 16px;
      }
    }
  }
  .qaDetail-answer {
    display: flex;
    justify-content: space-between;
    background-color: #eef3fd;
    padding: 40px 18.75%;
    .qaDetail-answer-title {
      color: #333333;
      font-size: 18px;
      font-weight: 800;
      margin-right: 10px;
    }
    .qaDetail-answer-count {
      color: #9196a6;
      font-weight: 700;
    }
    .qaDetail-answer-popular {
      float: right;
      margin: 0px 10px;
      line-height: 30px;
    }
    .qaDetail-answer-new {
      float: right;
      line-height: 30px;
    }
    .qaDetail-answer-content {
      width: 65%;
      .qaDetail-answer-myAnswer {
        display: flex;
        vertical-align: middle;
        margin-top: 20px;
      }
      .qaDetail-answer-myPortrait {
        width: 54px;
        height: 54px;
        margin-right: 18px;
        border-radius: 50%;
        vertical-align: middle;
        display: inline-block;
      }
      .qaDetail-answer-all {
        background: #ffffff;
        border-radius: 4px;
        margin-top: 20px;
        padding: 20px;
      }
      .qaDetail-answer-info {
        font-size: 14px;
        line-height: 32px;
        justify-content: space-between;
        span,
        img {
          vertical-align: middle;
        }
        .qaDetail-answer-img {
          width: 18px;
          height: 18px;
          display: inline-block;
          vertical-align: middle;
        }
        .qaDetail-answer-portrait {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 10px;
          vertical-align: middle;
          display: inline-block;
        }
        .qaDetail-answer-levelImg {
          height: 18px;
          margin: 0 10px;
          display: inline-block;
          vertical-align: middle;
          width: 18px;
        }
        .qaDetail-answer-time {
          color: #9196a6;
          font-size: 12px;
        }
        .qaDetail-answer-subscribeButton {
          color: #0175ff;
          text-align: center;
          background: #eef3fd;
          border-radius: 2px;
          line-height: 32px;
          margin-left: auto;
          font-size: 14px;
          border: 0px;
          width: 62px;
          padding: 0 12.5px;
        }
      }
      .qaDetail-answer-detail {
        color: #333333;
        font-size: 14px;
      }
      .qaDetail-answer-detailHeight {
        max-height: 150px;
        overflow: hidden;
      }
      .qaDetail-answer-action {
        color: #9196a6;
        display: flex;
        font-size: 14px;
        line-height: 20px;
        img {
          width: 18px;
          height: 18px;
          margin-right: 4px;
          border-radius: 50%;
          vertical-align: sub;
        }
      }
    }
    .qaDetail-answer-showAll {
      text-align: center;
      font-size: 16px;
      color: #0175ff;
    }
    .qaDetail-related {
      color: #333333;
      font-size: 14px;
      width: 30%;
      .qaDetail-related-desc {
        color: #9196a6;
      }
      .qaDetail-related-blogTitle {
        color: #333333;
        margin-top: 60px;
        font-size: 18px;
        font-weight: 800;
      }
      .qaDetail-related-blogs {
        display: flex;
        margin-top: 20px;
      }
      .qaDetail-related-blogImage {
        width: 120px;
        height: 74px;
        margin-right: 12px;
      }
      .qaDetail-related-blogInfo {
        width: 218px;
        .qaDetail-related-blogDesc {
          color: #6d717d;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          bottom: 2px;
          width: 100%;
        }
      }
    }
  }
  .qaDetail-comment {
    .qaDetail-answer-commentContent {
      margin: 6px 0 0 42px;
    }
    .qaDetail-answer-replayButton {
      color: #6d717d;
      background: #eef3fd;
      border-radius: 2px;
      font-size: 12px;
      height: 28px;
      border: 0px;
      width: 56px;
    }
  }

  .footer {
    background-color: #535c6c;
    height: 253px;
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
        font-family: PingFangSC-Regular;
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
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      margin-bottom: 8px;
      user-select: none;
    }
    .more-links-content {
      display: flex;
      flex-direction: column;
      font-family: PingFangSC-Regular;
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
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
}
</style>
