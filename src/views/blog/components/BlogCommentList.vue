<template>
  <div class="comment-main" v-if="list.length">
    <template v-for="(item, index) in list" :key="item.id">
      <div class="comment-cell" v-if="(index < 5 && !showAllComment) || showAllComment">
        <!-- 评论人信息 -->
        <div class="comment-cell-head">
          <div>
            <ComUser :userId="item.user_id" :authorId="userId" />
            <span class="comment-time">{{item.time_different}}</span>
          </div>
          <div>
            <!-- 回复按钮 -->
            <div class="comment-reply-btn hover" @click="handleCommentClick(index)">
              <img src="@/assets/img/blog-index/comment.png" alt />
              <span
                class="comment-reply-btn-text"
              >{{index + '' === clickCommentIndex && !closeReplyEditor ? '收起' : ''}}回复</span>
            </div>
            <!-- 点赞按钮 -->
            <div class="comment-like hover" @click="handleLikeClick(item.id, 2)">
              <img v-if="item.like_flag" src="@/assets/img/blog-index/like-hover.png" alt />
              <img v-else src="@/assets/img/blog-index/like.png" alt />
              <span class="comment-like-count">{{item.like_count * 1 || '赞'}}</span>
            </div>
          </div>
        </div>
        <div class="comment-cell-main">
          <!-- 评论内容 -->
          <div class="comment-content">
            <el-input
              v-model="item.content"
              type="textarea"
              readonly
              autosize
              style="border: none;"
            ></el-input>
          </div>
          <!-- 输入回复 -->
          <div class="reply-form" v-if="index + '' === clickCommentIndex && !closeReplyEditor">
            <el-input
              v-model="comment"
              rows="3"
              maxlength="60"
              show-word-limit
              type="textarea"
              :placeholder="`回复 ${item.username}：`"
            />
            <div class="reply-form-btn">
              <button
                class="hover"
                :disabled="loading"
                @click="handleCommentAdd(item.blog_id, item.id, item.user_id)"
              >回复</button>
            </div>
          </div>
          <!-- 评论回复列表 -->
          <div class="comment-reply">
            <!-- 回复列表 -->
            <template v-for="(reply, idx) in item.children" :key="reply.id">
              <div
                class="comment-reply-cell"
                v-if="(idx < 2 && !item.showReply) || item.showReply || showReplyIds.includes(item.id)"
              >
                <div class="comment-reply-head">
                  <div>
                    <ComUser :userId="reply.user_id" :authorId="userId" />
                    <span class="comment-reply-type">回复</span>
                    <span
                      class="comment-reply-user hover"
                      @click="jumpAuthor(reply.parent_user_id)"
                    >{{reply.parent_user_name}}</span>
                    <span class="comment-reply-time">{{reply.time_different}}</span>
                  </div>
                  <div>
                    <!-- 回复按钮 -->
                    <div class="comment-reply-btn hover" @click="handleCommentClick(index, idx)">
                      <img src="@/assets/img/blog-index/comment.png" alt />
                      <span
                        class="comment-reply-btn-text"
                      >{{index + '_' + idx === clickCommentIndex && !closeReplyEditor ? '收起' : ''}}回复</span>
                    </div>
                    <!-- 点赞按钮 -->
                    <div class="comment-like hover" @click="handleLikeClick(reply.id, 2)">
                      <img v-if="reply.like_flag" src="@/assets/img/blog-index/like-hover.png" alt />
                      <img v-else src="@/assets/img/blog-index/like.png" alt />
                      <span class="comment-like-count">{{reply.like_count * 1 || '赞'}}</span>
                    </div>
                  </div>
                </div>
                <!-- 回复内容 -->
                <div class="comment-content reply-content">
                  <el-input
                    v-model="reply.content"
                    type="textarea"
                    readonly
                    autosize
                    style="border: none;"
                  ></el-input>
                </div>
                <!-- 输入回复 -->
                <div
                  class="reply-form"
                  v-if="index + '_' + idx === clickCommentIndex && !closeReplyEditor"
                >
                  <el-input
                    v-model="comment"
                    rows="3"
                    maxlength="60"
                    show-word-limit
                    type="textarea"
                    :placeholder="`回复 ${reply.username}：`"
                  />
                  <div class="reply-form-btn">
                    <button
                      class="hover"
                      :disabled="loading"
                      @click="handleCommentAdd(reply.blog_id, reply.parent_id, reply.user_id)"
                    >回复</button>
                  </div>
                </div>
              </div>
            </template>
            <!-- 展开其他回复 -->
            <div
              v-if="item.children.length > 2 && !item.showReply && !showReplyIds.includes(item.id)"
              class="comment-reply-more"
            >
              <span
                class="hover"
                @click="item.showReply = true; showReplyIds.push(item.id)"
              >展开其他{{item.children.length - 2}}条回复 ></span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="list.length > 5 && !showAllComment" class="comment-main-btn">
      <span class="hover" @click="showAllComment = true">查看更多评论 ></span>
    </div>
  </div>
</template>

<script setup name="BlogCommentCell">
import ComUser from '@/components/ComUser.vue'

import { ElMessage } from 'element-plus'

import { fetchBlogCommentDetail } from '@/api/blog.js'
import useBlog from '@/hooks/useBlog.js'

const props = defineProps({
  id: String,
  userId: String
})

const { handleReply, handleLike } = useBlog()

const emit = defineEmits(['updateCount'])

const router = useRouter()
const list = ref([])
// 展开所有评论
const showAllComment = ref(false)
// 评论下标
const clickCommentIndex = ref('')
// 隐藏评论输入框
const closeReplyEditor = ref(false)
// 回复内容
const comment = ref('')
const loading = ref(false)
// 已展开的回复
const showReplyIds = ref([])

// 回复按钮点击
const handleCommentClick = (index, idx) => {
  comment.value = ''
  const clickIndex = idx >= 0 ? index + '_' + idx : index + ''
  if (clickIndex === clickCommentIndex.value) {
    closeReplyEditor.value = true
    clickCommentIndex.value = ''
  } else {
    closeReplyEditor.value = false
    clickCommentIndex.value = clickIndex
  }
}

// 获取评论信息
const getCommentList = id => {
  fetchBlogCommentDetail(id).then(res => {
    if (res.code !== 0) {
      return
    }
    list.value = res.data || []
    handleUpdateCount(list.value)
  })
}

// 更新评论数量
const handleUpdateCount = arr => {
  let count = 0
  arr.forEach(item => {
    count++
    item?.children.forEach(() => {
      count++
    })
  })
  emit('updateCount', count)
}

// 添加回复
const handleCommentAdd = (blog_id, parent_id, parent_user_id) => {
  loading.value = true
  if (!comment.value) {
    loading.value = false
    ElMessage({
      message: '请输入评论',
      type: 'warning'
    })
    return
  }
  loading.value = false

  handleReply(blog_id, comment.value, parent_id, parent_user_id).then(res => {
    loading.value = false
    if (res.code !== 0) {
      ElMessage({
        message: res.msg || '评论失败',
        type: 'warning'
      })
      return
    }

    ElMessage({
      message: '评论成功',
      type: 'success'
    })
    closeReplyEditor.value = true
    clickCommentIndex.value = ''
    getCommentList(props.id)
  })
}

// 点赞
const handleLikeClick = (id, type) => {
  handleLike(id, type)
    .then(() => {
      getCommentList(props.id)
    })
    .catch(() => {
      ElMessage({
        message: '点赞失败',
        type: 'warning'
      })
    })
}

const jumpAuthor = id => {
  router.push(`/authorIndex/${id}`)
}

watch(
  () => props.id,
  newVal => {
    getCommentList(newVal)
  },
  {
    immediate: true
  }
)

defineExpose({
  getCommentList
})
</script>

<style lang="scss" scoped>
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
.comment-main {
  margin-top: 40px;
  padding: 40px 30px;
  background: #fff;
  border-radius: 4px;
  .comment-cell {
    margin-bottom: 40px;
    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > div {
        display: flex;
        align-items: center;
      }
      .comment-time {
        line-height: 17px;
        margin-left: 20px;
        font-size: 12px;
        color: #9196a6;
      }
    }
    &-main {
      padding-left: 44px;
      button {
        width: 56px;
        height: 28px;
        line-height: 28px;
        border-radius: 2px;
        font-size: 12px;
        color: #6d717d;
        background: #eef3fd;
        border: none;
        appearance: none;
        &:hover {
          background: #eef3fd;
        }
      }
      .comment-reply {
        margin: 20px 0;
        &-cell {
          .comment-reply-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            & > div {
              display: flex;
              align-items: center;
            }
            .comment-reply-type {
              margin: 0 10px;
              font-size: 14px;
              line-height: 20px;
              color: #9196a6;
            }
            .comment-reply-user {
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              margin-right: 20px;
              color: #333;
            }
            .comment-reply-time {
              font-size: 12px;
              line-height: 17px;
              color: #9196a6;
            }
          }
        }
        &-more {
          display: flex;
          align-items: center;
          height: 20px;
          font-size: 14px;
          color: #0175ff;
        }
      }
      .reply-form {
        margin-top: 16px;
        :deep(.el-textarea) {
          border-radius: 4px;
          overflow: hidden;
          textarea {
            resize: none;
          }
        }
        &-btn {
          display: flex;
          justify-content: flex-end;
          button {
            width: 56px;
            height: 32px;
            line-height: 32px;
            margin-top: 10px;
            font-size: 12px;
            background: #0175ff;
            border-radius: 2px;
            border: none;
            appearance: none;
            color: #fff;
          }
        }
      }
    }
  }
  &-btn {
    font-size: 16px;
    line-height: 22px;
    color: #0175ff;
    text-align: center;
  }
}

.comment-content {
  margin: 6px 0 10px;
  &.reply-content {
    padding-left: 44px;
  }
  :deep(.el-textarea__inner) {
    padding: 0;
    box-shadow: none;
    resize: none;
  }
}
.comment-reply-btn {
  display: flex;
  align-items: center;
  user-select: none;
  &-text {
    margin-left: 2px;
    font-size: 14px;
    line-height: 20px;
    color: #9196a6;
  }
}
.comment-like {
  display: flex;
  align-items: center;
  margin-left: 16px;
  user-select: none;
  img {
    width: 18px;
    height: 18px;
  }
  &-count {
    margin-left: 2px;
    font-size: 14px;
    line-height: 20px;
    color: #9196a6;
  }
}
</style>
