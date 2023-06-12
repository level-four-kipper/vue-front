<template>
  <div style="display: flex">
    <div v-if="question.answer_image_list && question.answer_image_list?.length === 1" class="quiz-cover-img">
      <img :src="question.answer_image_list[0]" />
    </div>
    <div class="text-content">
      <div class="text-header">
        <p class="qa-title" @click="jumpQuizDetail(index, question.id)">{{ question.title }}</p>
        <span class="qa-answer-total">{{ question.comment_count }}人回答</span>
      </div>
      <div class="comment-content" v-if="question.comment_count">
        <div class="answer-head">
          <ComUser :userId="question.hot_answer?.user_id || ''" style="display: inline-block; vertical-align: middle" />:
          <!-- 热门回答 -->
          <span ref="answerContent" class="content" :class="{ 'answer-detailHeight': showMore && !showMoreContent }">
            <span @click="jumpQuizDetail(index, question.id)">{{ question.hot_answer?.content }}</span>
          </span>
          <span class="look-more" @click="jumpQuizDetail(index, question.id)" v-show="showMore && !showMoreContent" type="text">查看更多 ></span>
        </div>
        <div v-if="question.answer_image_list?.length > 1 && question.answer_image_list?.length < 4" class="quiz-cover-img2">
          <img v-for="img in question.answer_image_list" :key="img" :src="img" />
        </div>
      </div>
      <div class="item-footer">
        <div class="qa-message-data">
          <!-- 点赞 -->
          <div class="support">
            <p class="answer-support" @click="addQuizPraise(index, question.id)">
              <span v-show="!question.like_flag">
                <img src="@/assets/img/answerPhoto/点赞-蓝.png" alt="未点赞" />
              </span>
              <span v-show="question.like_flag">
                <img src="@/assets/img/answerPhoto/点赞备份.png" alt="点赞" />
              </span>
              <span>{{ question.like_count }}人赞同</span>
            </p>
          </div>
          <!-- 收藏 -->
          <p @click="addCollect(index, question.id)">
            <span v-show="!question.star_flag">
              <img src="@/assets/img/answerPhoto/收藏.png" alt="未收藏" />
            </span>
            <span v-show="question.star_flag">
              <img src="@/assets/img/answerPhoto/收藏备份2.png" alt="收藏" />
            </span>
            <span>{{ question.star_count }}</span>
          </p>
          <!-- 评论 -->
          <p @click="jumpQuizDetail(index, question.id)">
            <img src="@/assets/img/answerPhoto/评论.png" />
            <span>{{ question.comment_count }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VMdPreview from '@/components/VMdPreview.vue'
import { htmlToString } from '@/utils/utils.js'
import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue'
import ComUser from '@/components/ComUser.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/utils/https.js'
import { fetchAnswerList, fetchAnswerIndex } from '@/api/answer.js'
import { useRouter, useRoute } from 'vue-router'
const navList = [
  // { lable: '推荐', sort_status: 0 },
  { lable: '最新', sort_status: 1 },
  { lable: '最热', sort_status: 2 }
]
const router = useRouter()
const route = useRoute()
const text = ref('')
const answerList = ref([])
const questiontitle = ref('')
const props = defineProps({
  question: Object
})
const jumpPage = (path, query) => {
  router.push({ path, query })
}
const answerContent = ref(null)
const showMore = ref(false)

const emit = defineEmits(['updateLike', 'updateCollect'])
// 跳转详情页
const jumpQuizDetail = (index, id) => {
  addView(index, id)
  const routeUrl = router.resolve({
    path: `/questionAnswerDetail/${id}`
  })
  window.open(routeUrl.href, '_blank')
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
          // emit('updateCollect', obj)
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
          // answerList.value.splice(index, 1, { ...obj })
          emit('updateCollect', { ...obj })
        }
      })
    })
    .catch(err => console.log(err))
}
// 点赞 添加点赞状态后再加上是否点赞的参数
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
          // answerList.value.splice(index, 1, { ...answerList.value[index], ...obj })
          emit('updateLike', obj)
        }
      })
    })
    .catch(err => console.log(err))
}

onMounted(() => {
  // getAnswerList()
  setTimeout(() => {
    if (answerContent.value?.offsetHeight > 52) {
      showMore.value = true
    } else {
      showMore.value = false
    }
  }, 500)
})
</script>

<style lang="scss" scoped>
.qa-item {
  // display: flex;
  align-items: center;
  margin-top: 30px;
  // padding-bottom: 30px;
  border-bottom: 1px solid rgba(200, 200, 219, 0.5);
  .quiz-cover-img {
    img {
      width: 210px;
      height: 150px;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
  .quiz-cover-img2 {
    img {
      width: 210px;
      height: 150px;
      border-radius: 4px;
      margin-right: 20px;
      margin-top: 16px;
    }
  }
  .text-content {
    margin-bottom: 30px;
    position: relative;
    .text-header {
      display: flex;
      align-items: center;
      line-height: 25px;
      margin-bottom: 20px;
      // margin-top: 30px;
      .qa-title {
        margin-right: 10px;
        font-size: 18px;
        color: #333333;
        cursor: pointer;
        font-weight: 700;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .qa-answer-total {
        font-size: 14px;
        color: #0175ff;
        font-weight: 400;
        min-width: 50px;
      }
    }
  }
  .comment-content {
    margin-top: 20px;
    .answer-head {
      max-height: 52px;
      overflow: hidden;
      .user-photo {
        width: 32px;
        height: 32px;
        border-radius: 32px;
        margin-top: -5px;
      }
      .content {
        top: 0;
        display: inline;
        cursor: pointer;
      }
      // .answer-detailHeight {
      //   max-height: 110px;
      //   overflow: hidden;
      // }
      .user-name {
        line-height: 20px;
        font-size: 14px;
        font-weight: 600;
        color: #333;
        text-overflow: nowrap;
        overflow: hidden;
        max-width: 84px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .content {
        left: 5px;
        margin-right: 5px;
        font-size: 14px;
        overflow: hidden;
        word-break: break-all;
      }
      .look-more {
        position: absolute;
        right: 0;
        bottom: -4px;
        background-color: #fff;
        color: #0175ff;
        cursor: pointer;
        white-space: nowrap;
        padding-left: 3px;
        &::before {
          content: '...   ';
          color: #333;
        }
      }
    }
  }
  .item-footer {
    // position: absolute;
    // bottom: 0;
    // right: 0;
    display: flex;
    bottom: 35px;
    margin-top: 60px;
    .qa-message-data {
      font-size: 14px;
      color: #9196a6;
      display: flex;
      position: absolute;
      align-content: center;
      justify-items: center;
      justify-content: center;
      .support {
        display: flex;
        background-color: #eef3fd;
        align-items: center;
        width: 113px;
        height: 32px;
        span {
          color: #0175ff;
          cursor: pointer;
        }
      }
      p {
        margin-right: 18.5px;
        align-items: center;
        display: flex;
        span {
          margin-left: 10px;
          align-items: center;
          display: flex;
        }
        img {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
