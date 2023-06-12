<template>
  <div class="comment-myComment">
    <img class="comment-myPortrait" :src="avatar" alt="用户头像" />
    <el-input
      type="textarea"
      placeholder="发表你的评论吧～"
      v-model="answerReplay"
      maxlength="200"
      show-word-limit
      :autosize="{ minRows: 3, maxRows: 5 }"
    ></el-input>
  </div>
  <el-button
    class="comment-top comment-right"
    type="primary"
    @click="replayAnswer"
    style="margin-top: 10px;"
  >评论</el-button>

  <div
    class="comment-top"
    v-show="answer.comment_count>0"
    style="margin-top: 30px;margin-bottom: -20px;"
  >
    <span class="comment-title">评论</span>
    <span class="comment-count">{{ answer.comment_count}}</span>
  </div>
  <div v-for="comment in showComments" :key="comment.id">
    <div class="comment-flex comment-info comment-top" style="margin-top: 40px;">
      <User
        :userid="comment.user_id"
        :username="comment.username"
        :time="comment.time_different"
        :avatar="comment.img_url"
        @userClick="jumpPage(`/authorIndex/${comment.user_id}`)"
      >
        <template #user-other>
          <!-- <img class="comment-levelImg" src="@/assets/img/index/newBloger.png" alt="用户等级" /> -->
        </template>
      </User>
      <ReplayAction
        :status="comment.like_flag"
        :count="comment.like_count"
        @toggleLike="toggleLike(comment)"
        @changeReplay="changeReplay(comment)"
      />
    </div>

    <div class="comment-content">
      <p v-html="comment.content"></p>
      <!-- <VMdPreview :text="comment.content" /> -->

      <el-input
        v-show="replayId===comment.id"
        class="comment-top"
        type="textarea"
        :placeholder="'回复  @'+comment.username"
        v-model="commentReplay"
        maxlength="200"
        show-word-limit
        :autosize="{ minRows: 3, maxRows: 5 }"
      ></el-input>
      <el-button
        v-show="replayId===comment.id"
        class="comment-top comment-right"
        type="primary"
        @click="replayComment(comment)"
      >提交回复</el-button>
      <div v-for="(replay, index) in comment.children" :key="replay.id">
        <div
          class="comment-flex comment-info comment-top"
          v-show="index < 2 || (index >=2 && comment.showMoreReplay)"
        >
          <User
            :userid="replay.user_id"
            :username="replay.username"
            :time="replay.created_time"
            :avatar="replay.img_url"
          >
            <template #user-other>
              <div class="tab-3">
                <span class="comment-replay">回复</span>
                <span class="comment-user">{{ comment.username }}</span>
                <span class="comment-time">{{ replay.time_different }}</span>
              </div>
            </template>
          </User>
          <ReplayAction
            :status="replay.like_flag"
            :count="replay.like_count"
            @toggleLike="toggleLike(replay)"
            @changeReplay="changeReplay(replay)"
          />
        </div>
        <div class="comment-content" v-show="index < 2 || (index >=2 && comment.showMoreReplay)">
          <p v-html="replay.content"></p>
          <div v-if="replayId===replay.id">
            <el-input
              class="comment-top"
              type="textarea"
              :placeholder="'回复  @'+replay.username"
              v-model="replays"
              maxlength="200"
              show-word-limit
              :autosize="{ minRows: 3, maxRows: 5 }"
            ></el-input>
            <el-button
              class="comment-top comment-right"
              type="primary"
              @click="replayReplay(comment)"
            >提交回复</el-button>
          </div>
        </div>
      </div>
      <div
        v-if="comment.children?.length > 2 && !comment.showMoreReplay"
        class="comment-showAll comment-top"
        @click="comment.showMoreReplay=true"
      >展开其他{{comment.children.length-2}}条回复 ></div>
    </div>
  </div>
  <div
    v-if="comments?.length > 5 && !showMoreComment"
    class="comment-showMore comment-top hover"
    @click="showMoreComment=true"
  >查看更多评论 ></div>
</template>

<script setup name="CommentDetail">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VMdPreview from '@/components/VMdPreview.vue'
import { ElMessage } from 'element-plus'
import { addComment, updateLike, updateCollect, getAnswerComments, getLikeDetail, getCollectDetail } from '@/api/answer.js'
import User from './User.vue'
import ReplayAction from './ReplayAction.vue'
import { useLoginStore } from '@/stores/login.js'
const props = defineProps({
  answer: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits('updateComments')
const loginStore = useLoginStore()
const { avatar } = storeToRefs(loginStore)
let showMoreComment = ref(false)
let replayId = ref(-1)
let comments = ref([])
let answerReplay = ref('')
let commentReplay = ref('')
let replays = ref('')
const router = useRouter()
const jumpPage = path => {
  const routeUrl = router.resolve({
    path
  })
  window.open(routeUrl.href, '_blank')
}

// 显示所有的comments
const showComments = computed(() => {
  if (!showMoreComment.value && comments.value?.length > 5) {
    return comments.value?.slice(0, 5)
  }
  return comments.value
})

const toggleLike = (comment, type) => {
  if (!comment.id) {
    return
  }
  const params = {
    article_id: comment.id,
    article_type: type
  }
  const commenting = comment.commenting
  updateLike(params)
    .then(async res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: res?.msg, type: 'error' })
      } else {
        // ElMessage({ showClose: true, message: '点赞成功', type: 'success' })
        await queryAnswerComments(props.answer.id, () => {
          comment.commenting = commenting
        })
      }
    })
    .catch(err => {
      console.log(err)
      ElMessage({ showClose: true, message: '点赞失败', type: 'error' })
    })
}

const queryAnswerComments = async id => {
  await getAnswerComments(id)
    .then(res => {
      if (res?.data?.length) {
        comments.value = res?.data
      }
    })
    .catch(err => console.log(err))
}

const replayAnswer = async () => {
  if (!answerReplay.value) {
    ElMessage({ message: '请输入评论', type: 'warning' })
    return
  }
  await postComment(props.answer.id, 4, answerReplay.value)
  answerReplay.value = ''
}

const replayComment = async comment => {
  if (!commentReplay.value) {
    ElMessage({ message: '请输入回复', type: 'warning' })
    return
  }
  await postComment(comment.blog_id, 4, commentReplay.value, comment)
  commentReplay.value = ''
}

const replayReplay = async comment => {
  if (!replays.value) {
    ElMessage({ message: '请输入回复', type: 'warning' })
    return
  }
  await postComment(comment.blog_id, 4, replays.value, comment)
  replays.value = ''
}

const postComment = (blog_id, type, replay, parent) => {
  const params = {
    article_type: type,
    blog_id: blog_id,
    content: replay,
    parent_id: parent?.id || -1,
    parent_user_id: parent?.user_id || -1
  }
  addComment(params)
    .then(async res => {
      if (res.code === 0) {
        replay = ''
        replayId.value = -1
        ElMessage({ showClose: true, message: '评论成功', type: 'success' })
        emit('updateComments')
        await queryAnswerComments(props.answer.id)
      } else {
        ElMessage({ showClose: true, message: res?.msg, type: 'error' })
      }
    })
    .catch(err => console.log(err))
}

const changeReplay = comment => {
  if (replayId.value !== comment.id) {
    replayId.value = comment.id
    comment.replay = ''
  }
}

onMounted(async () => {
  await queryAnswerComments(props.answer.id)
})
defineExpose({})
</script>

<style lang="scss" scoped>
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
.comment-top {
  margin-top: 20px;
}
.comment-left {
  margin-left: 20px;
}
.comment-flex {
  display: flex;
}
.comment-right {
  display: flex;
  margin-left: auto;
}
.tab-3 {
  display: flex;
  align-items: center;
  margin-left: 10px;
  .comment-replay {
  }
  .comment-user {
    margin-left: 10px;
    font-weight: 800;
  }
  .comment-time {
    margin-left: 20px;
    color: #9196a6;
    font-size: 12px;
    margin-top: 2px;
  }
}
:deep(.user-name.hover) {
  line-height: 20px;
  font-size: 14px;
  font-weight: 700;
  color: #333;
  cursor: default;
  pointer-events: none;
}
.comment-active {
  color: #0175ff;
}
.comment-banner {
  background-color: #ffffff;
  margin: 20px 18.75%;
}
.comment-myComment {
  display: flex;
  vertical-align: middle;
  margin-top: 20px;
  :deep(.el-textarea) {
    textarea {
      resize: none;
    }
  }
}
.comment-title {
  color: #333333;
  font-size: 18px;
  font-weight: 800;
  margin-right: 10px;
}
.comment-count {
  color: #9196a6;
  font-weight: 700;
}
.comment-popular {
  float: right;
  margin: 0px 10px;
  line-height: 30px;
}
.comment-new {
  float: right;
  line-height: 30px;
}
.comment-myAnswer {
  display: flex;
  vertical-align: middle;
  margin-top: 20px;
}
.comment-myPortrait {
  width: 54px;
  height: 54px;
  margin-right: 18px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.comment-all {
  background: #ffffff;
  border-radius: 4px;
  margin-top: 20px;
  padding: 20px;
}
.comment-info {
  font-size: 14px;
  // line-height: 32px;
  justify-content: space-between;
  .comment-user {
    font-weight: 800;
  }
  span,
  img {
    vertical-align: middle;
  }
  .comment-img {
    width: 18px;
    height: 18px;
    display: inline-block;
    vertical-align: middle;
  }
  .comment-portrait {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
    display: inline-block;
  }
  .comment-levelImg {
    height: 18px;
    display: inline-block;
    vertical-align: middle;
    width: 18px;
  }

  .comment-subscribeButton {
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
  .comment-detail {
    color: #333333;
    font-size: 14px;
  }
  .comment-detailHeight {
    max-height: 150px;
    overflow: hidden;
  }
  .comment-action {
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
.comment-showAll {
  //   text-align: center;
  font-size: 14px;
  color: #0175ff;
  cursor: pointer;
}
.comment-showMore {
  text-align: center;
  font-size: 16px;
  color: #0175ff;
  cursor: pointer;
  margin-top: 40px;
}
.comment-content {
  margin: 9px 0 0 42px;
  p {
    color: #333333;
    font-size: 14px;
    word-wrap: break-word;
    word-break: normal;
  }
  :deep(.el-textarea) {
    textarea {
      resize: none;
    }
  }
}
.comment-replayButton {
  color: #6d717d;
  background: #eef3fd;
  border-radius: 2px;
  font-size: 12px;
  height: 28px;
  border: 0px;
  width: 56px;
}
</style>
