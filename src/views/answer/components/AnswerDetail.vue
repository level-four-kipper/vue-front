<template>
  <div class="answer-content">
    <!-- <div class="answer-title">我来回答</div> -->
    <!-- <div class="answer-myAnswer">
      <img class="answer-myPortrait" :src="avatar" alt="用户头像" />
      <el-input ref="myAnswerRef" type="textarea" placeholder="请输入回答" v-model="myAnswer" maxlength="200" show-word-limit :autosize="{ minRows: 3, maxRows: 5 }"> </el-input>
    </div>-->
    <template v-if="!isPreview">
      <!-- <el-button class="answer-top answer-right" type="primary" @click="postAnswer">提交回答</el-button> -->
      <div class="answer-tops">
        <div>
          <span class="answer-title">全部回答</span>
          <span class="answer-count">{{ answers?.length}}</span>
          <span
            :class="['answer-new', 'hover', sort === 0 ? 'answer-active': '']"
            @click="toggleSort(0)"
          >最新</span>
          <span
            :class="['answer-popular', 'hover', sort === 1 ? 'answer-active': '']"
            @click="toggleSort(1)"
          >最热</span>
        </div>

        <div class="answer-all" v-for="(answer) in showAnswers" :key="answer.id">
          <AnswerContent v-if="answer.id" :answer="answer" @subscribe="subscribe" />
          <!-- 操作 -->

          <!-- <AnswerAction :answer="answer" @toggleLike="toggleLike(answer, 3)" @toggleCollect="toggleCollect(answer, 3)" @showComment="showComment(answer)" /> -->
          <div class="answer-action answer-top">
            <div class="hover" @click="toggleLike(answer, 3)">
              <img v-show="!answer.like_flag" src="@/assets/img/approval.png" alt="赞同" />
              <img v-show="answer.like_flag" src="@/assets/img/approvaled.png" alt="已赞同" />
              <span :class="[answer.like_flag?'answer-active':'']">赞同 {{ answer.like_count }}</span>
            </div>
            <div @click="toggleCollect(answer, 3)" class="answer-left hover">
              <img v-show="!answer.star_flag" src="@/assets/img/collect.png" alt="收藏" />
              <img v-show="answer.star_flag" src="@/assets/img/collected.png" alt="已收藏" />
              <span :class="[answer.star_flag?'answer-active':'']">收藏 {{ answer.star_count }}</span>
            </div>
            <!-- <div class="answer-right hover" v-show="answer.comment_count=0&&!answer.commenting" @click="showComment(answer)">
              <img src="@/assets/img/comment.png" />
              <span>评论{{answer.comment_count}}</span>
              <el-icon>
                <ArrowDown />
              </el-icon>
            </div>-->
            <div
              class="answer-right hover"
              v-show="!answer.commenting"
              @click="showComment(answer)"
            >
              <img src="@/assets/img/comment.png" />
              <span v-if="answer.comment_count>0">展开{{answer.comment_count}}条评论</span>
              <span v-else>评论{{answer.comment_count}}条</span>
              <el-icon>
                <ArrowDown />
              </el-icon>
            </div>
            <div
              class="answer-right hover"
              v-show="answer.commenting"
              @click="answer.commenting = false"
            >
              <img src="@/assets/img/comment.png" alt="收起评论" />
              <span>收起评论</span>
              <el-icon>
                <ArrowUp />
              </el-icon>
            </div>
          </div>

          <!-- 评论回答 -->
          <div class="answer-comment" v-show="answer.commenting">
            <CommentDetail :answer="answer" @updateComments="queryQuestionAnswers" />
          </div>
        </div>
      </div>
      <div
        v-if="!showMoreAnswer && answers?.length > 5"
        class="answer-showAll answer-top hover"
        @click="showMoreAnswer=true"
      >查看全部{{ answers?.length - 5 }}个回答 ></div>
    </template>
  </div>
</template>

<script setup name="AnswerDetail">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addAnswer, updateLike, updateCollect, getQuestionAnswers, changeFollow } from '@/api/answer.js'
// import AnswerAction from './AnswerAction.vue'
import AnswerContent from './AnswerContent.vue'
import CommentDetail from './CommentDetail.vue'

import { useLoginStore } from '@/stores/login.js'
const props = defineProps({
  showAnswer: {
    type: Boolean
  },
  detail: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['updateComment'])
const loginStore = useLoginStore()
const { avatar } = storeToRefs(loginStore)
const myAnswerRef = ref()
const myAnswer = ref('')
const answers = ref([])

let replayId = ref(-1)
let answer = ref({})
let sort = ref(1)

let showMoreAnswer = ref(false)
const isPreview = computed(() => {
  return route.query.preview
})

watch(
  () => props.showAnswer,
  newVal => {
    if (newVal) {
      answer.value = newVal
      console.log('AnswerDetail======', newVal)
    }
  }
)
const postAnswer = () => {
  if (!myAnswer.value) {
    ElMessage({ message: '请输入回答', type: 'warning' })
    return
  }
  const params = {
    question_id: String(route.params.id),
    content: myAnswer.value,
    article_type: 1
  }
  addAnswer(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ showClose: true, message: '回答成功', type: 'success' })
        myAnswer.value = ''
        sort.value = 0
        queryQuestionAnswers({ id: String(route.params.id), sort_status: sort.value })
      } else {
        ElMessage({ showClose: true, message: res?.msg, type: 'error' })
      }
    })
    .catch(err => console.log(err))
}

const toggleSort = s => {
  sort.value = s
  queryQuestionAnswers({ id: String(route.params.id), sort_status: sort.value })
}

const subscribe = authorId => {
  const formData = new FormData()
  formData.append('authorId', authorId)
  changeFollow(formData)
    .then(res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: res?.msg, type: 'error' })
      } else {
        ElMessage({ showClose: true, message: res.data ? '已关注' : '已取消', type: 'success' })
        queryQuestionAnswers({ id: String(route.params.id), sort_status: sort.value })
      }
    })
    .catch(err => {
      console.log(err)
      ElMessage({ showClose: true, message: '关注失败', type: 'error' })
    })
}

const toggleLike = (answer, type) => {
  if (!answer.id) {
    return
  }
  const params = {
    article_id: answer.id,
    article_type: type
  }
  updateLike(params)
    .then(res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: res?.msg, type: 'error' })
      } else {
        // ElMessage({ showClose: true, message: '点赞成功', type: 'success' })
        queryQuestionAnswers({ id: String(route.params.id), sort_status: sort.value })
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
    article_type: type
  }
  updateCollect(params)
    .then(res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: res?.msg, type: 'error' })
      } else {
        // ElMessage({ showClose: true, message: '收藏成功', type: 'success' })
        queryQuestionAnswers({ id: String(route.params.id), sort_status: sort.value })
      }
    })
    .catch(err => {
      console.log(err)
      ElMessage({ showClose: true, message: '收藏失败', type: 'error' })
    })
}

const showComment = answer => {
  answer.commenting = !answer.commenting
  answer.replay = ''
  replayId.value = answer?.id
}

const route = useRoute()

const queryQuestionAnswers = () => {
  const commentingArray = answers.value.filter(item => item.commenting).map(item => item.id)
  getQuestionAnswers({ id: String(route.params.id), sort_status: sort.value })
    .then(res => {
      answers.value = (res?.data || []).map(item => {
        if (commentingArray.includes(item.id)) {
          item.commenting = true
        }
        return item
      })

      emit('updateComment', answers.value.length)
    })
    .catch(err => console.log(err))
}

const focusMyAnswer = () => {
  myAnswerRef.value.ref.focus()
}

// 显示所有的答案Answer
const showAnswers = computed(() => {
  if (!showMoreAnswer.value && answers.value?.length > 5) {
    return answers.value?.slice(0, 5)
  }
  return answers.value || []
})

onMounted(async () => {
  console.log('xh11-->', route.params.id)
  await queryQuestionAnswers({ id: String(route.params.id), sort_status: sort.value })
})

defineExpose({
  focusMyAnswer
})
</script>

<style lang="scss" scoped>
.el-icon {
  top: 2px;
  left: 4px;
}
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
.answer-flex {
  display: flex;
}
.answer-top {
  margin-top: 20px;
}
.answer-left {
  margin-left: 20px;
}
.answer-right {
  display: flex;
  margin-left: auto;
}
.answer-title {
  color: #333333;
  font-size: 18px;
  font-weight: 800;
  margin-right: 10px;
}
.answer-active {
  color: #0175ff;
}
.answer-count {
  color: #9196a6;
  font-weight: 700;
}
.answer-new {
  float: right;
  line-height: 30px;
}
.answer-popular {
  float: right;
  margin: 0px 10px;
  line-height: 30px;
}
.answer-content {
  width: 780px;
  .answer-myAnswer {
    display: flex;
    vertical-align: middle;
    margin-top: 30px;
    :deep(.el-textarea) {
      textarea {
        resize: none;
      }
    }
  }
  .answer-myPortrait {
    width: 54px;
    height: 54px;
    margin-right: 18px;
    border-radius: 50%;
    vertical-align: middle;
    display: inline-block;
  }
  .answer-all {
    background: #ffffff;
    border-radius: 4px;
    margin-top: 20px;
    padding: 20px;
  }
  .answer-info {
    font-size: 14px;
    line-height: 32px;
    justify-content: space-between;
    span,
    img {
      vertical-align: middle;
    }
    .answer-img {
      width: 18px;
      height: 18px;
      display: inline-block;
      vertical-align: middle;
    }
    .answer-portrait {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
      vertical-align: middle;
      display: inline-block;
    }
    .answer-levelImg {
      height: 18px;
      margin: 0 10px;
      display: inline-block;
      vertical-align: middle;
      width: 18px;
    }
    .answer-time {
      color: #9196a6;
      font-size: 12px;
    }
    .answer-subscribeButton {
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
  .answer-detail {
    color: #333333;
    font-size: 14px;
    word-wrap: break-word;
    word-break: normal;
  }
  .answer-detailHeight {
    max-height: 150px;
    overflow: hidden;
  }
  .answer-action {
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
  .answer-comment {
    .answer-commentContent {
      margin: 6px 0 0 42px;
    }
    :deep(.comment-myComment) {
      margin-top: 30px;
    }
    .answer-replayButton {
      color: #6d717d;
      background: #eef3fd;
      border-radius: 2px;
      font-size: 12px;
      height: 28px;
      border: 0px;
      width: 56px;
    }
  }
  .answer-showAll {
    text-align: center;
    font-size: 16px;
    color: #0175ff;
  }
}
</style>
