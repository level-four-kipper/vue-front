 <!-- 提问列表 -->
<template>
  <div class="card" >
    <div class="content">
      <slot name="header">
        <div class="content-header">
          <div class="content-title">
            <span class="tag" />
          </div>
        </div>
      </slot>
      <slot name="content-text">
        <div class="content-text"> {{ questionBank.description}} </div>
      </slot>

      <slot name="content-image">

      </slot>

      <div class="footer">
        <!-- 统计 -->
        <div class="message-list">
          <!-- 浏览 -->
          <span><img src="@/assets/img/view.png" alt="浏览" />{{ questionBank.browse_count || 0 }}</span>
          <!-- 评论 -->
          <span><img src="@/assets/img/comment.png" alt="评论" />{{ questionBank.comment_count || 0 }}</span>
          <!-- 点赞 -->
          <span><img src="@/assets/img/approval.png" alt="点赞" />{{ questionBank.like_count || 0 }}</span>
          <!-- 收藏 -->
          <span><img src="@/assets/img/collect.png" alt="收藏" />{{ questionBank.collect_count || 0 }}</span>
          <!-- 时间 -->
          <span class="quiz-time">{{formatDate(questionBank.gmt_created,'yyyy-mm-dd')}}</span>
        </div>

        <!-- 提问列表 个人视角可编辑 -->
        <div class="edit">
          <span @click.stop="jumpToEdit(item)">
            <img src="@/assets/img/authorPhoto/icon/编辑.png">
            <span>管理</span>
          </span>
          <img v-show="showDelete" src="@/assets/img/authorPhoto/icon/更多.png" ref="moreRef" class="more" @click="isMore = !isMore " />
          <el-button v-show="isMore" class="btn-delete" @click="handleDelete(questionBank)">删除</el-button>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup>
import { formatDate } from '@/utils/format.js'

defineProps({
  questionBank: { type: Object, default: () => {} },
  showDelete: { type: Boolean, default: false },
})

const isMore = ref(false)

const emits = defineEmits(['delete', 'jumpEdit', 'jumpDetail'])

// 删除问答
const handleDelete = (item) => {
  emits('delete', item)
}
// 跳转编辑
function jumpToEdit (item) {
  emits('jumpEdit', item)
}

// 跳转详情
function jumpToDetail (item) {
  emits('jumpDetail', item)
}

onMounted(() => {
})
</script>
<style lang="scss" scoped>
.card {
  width: 910px;
  padding: 16px;
  min-width: 910px;
  border-radius: 4px;
  margin-bottom: 20px;
  background: #ffffff;
  display: flex;
  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  }
  .cover-img{
    height: 150px;
  }
  .image {
    width: 210px;
    height: 150px;
    margin-right: 20px;
    border-radius: 4px;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      line-height: 22px;
      .content-title {
        font-size: 18px;
        font-weight: 600;
        height: 25px;
      }
    }
    .content-text{
      color: #6D717D;
      font-size: 14px;
      font-size: 14px;
      max-height: 40px;
      line-height: 20px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
    }
    .content-image{
      height: 150px;
      margin-top: 10px;
    }
    .footer {
      display: flex;
      margin-top: auto;
      align-items: center;
      justify-content: space-between;
      padding-top: 18px;
      .message-list {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #9196A6;
        span {
          display: flex;
          margin-right: 20px;
          align-items: center;
          img {
            margin-right: 2px;
          }
        }
      }
      .edit {
        display: flex;
        align-items: center;
        line-height: 26px;
        > span {
          display: flex;
          align-items: center;
        }
        .more {
          margin-left: 16px;
          cursor: pointer;
        }
        .btn-delete {
          cursor: pointer;
          color: #333;
          border: none;
          background: #ffffff;
          box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
          position: absolute;
          right: -8px;
          top: 28px;
        }
      }
    }
  }
  .quiz-time {
    color: #9196a6;
    height: 20px;
  }

}
</style>
