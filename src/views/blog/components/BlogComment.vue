<template>
  <div class="comment">
    <div class="comment-head">
      <div class="comment-head-name">
        <span>评论</span>
        <span>{{commentCount}}</span>
      </div>
      <div class="comment-head-editor">
        <img class="comment-avatar" :src="avatar" />
        <el-input
          ref="inputRef"
          v-model="comment"
          :autosize="{ minRows: 3, maxRows: 5 }"
          maxlength="200"
          show-word-limit
          type="textarea"
          placeholder="说两句吧～"
        />
      </div>
      <div class="comment-head-btn">
        <button class="hover" :disabled="loading" @click="handleCommentAdd">发表评论</button>
      </div>
    </div>
    <!-- 评论列表 -->
    <BlogCommentList ref="commentlistRef" :id="id" :userId="userId" @updateCount="updateCount" />
  </div>
</template>

<script setup name="BlogComment">
import BlogCommentList from './BlogCommentList.vue'

import { ElMessage } from 'element-plus'

import useBlog from '@/hooks/useBlog.js'
import { useLoginStore } from '@/stores/login.js'

const props = defineProps({
  id: String,
  userId: String
})

const emit = defineEmits(['updateComment'])
const loginStore = useLoginStore()
const { avatar } = storeToRefs(loginStore)
// 评论
const inputRef = ref(null)
const comment = ref('')
const loading = ref(false)
// 评论数量
const commentCount = ref(0)
const commentlistRef = ref(null)

const { handleReply } = useBlog()

// 发表评论
const handleCommentAdd = () => {
  loading.value = true
  if (!comment.value) {
    loading.value = false
    ElMessage({
      message: '请输入评论',
      type: 'warning'
    })
    return
  }

  handleReply(props.id, comment.value).then(res => {
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
    comment.value = ''
    commentlistRef.value.getCommentList(props.id)
  })
}

// 更新评论数量
const updateCount = count => {
  commentCount.value = count
  emit('updateComment', count)
}

// 聚焦输入框
const focusInput = () => {
  nextTick(() => {
    inputRef.value.focus()
  })
}

defineExpose({
  focusInput
})
</script>

<style lang="scss" scoped>
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}

.comment {
  width: 780px;
  padding: 0 0 40px;
  &-head {
    &-name {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span {
        font-size: 18px;
        font-weight: 600;
        line-height: 25px;
        margin-right: 10px;
        &:first-child {
          color: #333;
        }
        &:last-child {
          color: #9196a6;
        }
      }
    }
    &-editor {
      display: flex;
      margin-bottom: 16px;
      .comment-avatar {
        width: 54px;
        height: 54px;
        margin-right: 17px;
        border-radius: 54px;
        background: #fff;
      }
      :deep(.el-textarea) {
        width: 708px;
        border-radius: 4px;
        overflow: hidden;
        textarea {
          resize: none;
        }
      }
    }
    &-btn {
      display: flex;
      justify-content: flex-end;
      button {
        width: 120px;
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        background: #0175ff;
        border-radius: 4px;
        color: #fff;
        border: none;
        appearance: none;
      }
    }
  }
}
</style>
