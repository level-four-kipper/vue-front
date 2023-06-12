<!-- 提问列表 -->
<template>
  <div class="card">
    <div v-if="question?.img_content?.length === 1" class="cover-img">
      <el-image class="image" :src="question?.img_content[0]" alt=""></el-image>
    </div>
    <div class="content">
      <slot name="header">
        <div class="content-header">
          <div class="content-title" @click="jumpToDetail(question)">{{ question?.title }}</div>
        </div>
      </slot>
      <slot name="content-text">
        <div class="content-text">{{ question?.content_no_image }}</div>
      </slot>

      <slot name="content-image">
        <div v-if="question?.img_content?.length && question?.img_content?.length > 1" class="content-image">
          <el-image class="image" :src="item" v-for="item in question.img_content" :key="item"></el-image>
        </div>
      </slot>

      <div class="card-footer">
        <!-- 统计 -->
        <div class="message-list">
          <slot name="total">
            <span v-if="showCount" class="quiz-total">{{ question?.answer_count || 0 }}人回答</span>
          </slot>
          <!-- 浏览 -->
          <span v-if="showCount"><img src="@/assets/img/view.png" alt="浏览" />{{ question?.look_count || 0 }}</span>
          <!-- 收藏 -->
          <span v-if="showCount"><img src="@/assets/img/collect.png" alt="收藏" />{{ question?.star_count || 0 }}</span>
          <!-- 时间 -->
          <span v-if="showCount" class="quiz-time">{{ question?.created ? formatDate(question.created, 'yyyy-mm-dd') : '' }}</span>
        </div>

        <div class="edit-set">
          <span @click.stop="jumpEditQuestion(question)" class="edit-content">
            <img src="@/assets/img/personalCenter/edit.png" />
            <img src="@/assets/img/personalCenter/edit-active.png" />
            <span>编辑</span>
          </span>
          <el-dropdown @command="handleDelete">
            <span class="more-content">
              <img src="@/assets/img/personalCenter/more.png" class="more" />
              <img src="@/assets/img/personalCenter/more-active.png" class="more" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{ question }">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { formatDate } from '@/utils/format.js'
const props = defineProps({
  question: { type: Object, default: () => {} },
  showCount: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['delete', 'jumpEdit', 'jumpDetail'])
const router = useRouter()
const route = useRoute()
const isMore = ref(false)

// 删除问答
const handleDelete = item => {
  emits('delete', item)
}

// 跳转详情
function jumpToDetail(item) {
  emits('jumpDetail', item)
}

// 跳转提问编辑
const jumpEditQuestion = item => {
  if (route.path.includes('creationList/answer')) {
    router.push({ path: `/publishAnswer/${item.question_id}`, query: { id: item.id } })
  } else {
    router.push({
      path: '/publishQuestion',
      query: { id: item.id }
    })
  }
}

onMounted(() => {})
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
    box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  }
  .cover-img {
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
    flex-direction: column;
    display: flex;
    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      line-height: 22px;
      .content-title {
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        height: 25px;
      }
    }
    .content-text {
      color: #4d4e54;
      font-size: 14px;
      max-height: 40px;
      line-height: 20px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
    }
    .content-image {
      height: 150px;
      margin-top: 10px;
    }
    .card-footer {
      display: flex;
      margin-top: auto;
      align-items: center;
      justify-content: space-between;
      padding-top: 18px;
      .message-list {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #9196a6;
        span {
          display: flex;
          margin-right: 20px;
          align-items: center;
          img {
            margin-right: 2px;
          }
        }
        .quiz-total {
          color: #0175ff;
          background: #eef3fd;
          border-radius: 4px;
          line-height: 32px;
          padding: 0px 12px;
          height: 32px;
        }
      }
      .edit {
        display: flex;
        align-items: center;
        > span {
          cursor: pointer;
          align-items: center;
          display: flex;
        }
        .more {
          margin-left: 16px;
          cursor: pointer;
        }
        .btn-delete {
          cursor: pointer;
          position: absolute;
          top: 30px;
          right: -8px;
          background: #ffffff;
          border: none;
          color: #333;
          box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
        }
      }
    }
  }

  .quiz-time {
    color: #9196a6;
    height: 20px;
  }

  .edit-set {
    margin-top: 1px;
    background: #fff;
    padding: 0 10px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    .edit-content {
      margin-right: 16px;
      img:nth-child(2) {
        display: none;
      }
      &:hover {
        img:nth-child(1) {
          display: none;
        }
        img:nth-child(2) {
          display: inline-block;
        }
        span {
          color: #0175ff;
          opacity: 0.85;
        }
      }
    }
    .more-content {
      img:nth-child(2) {
        display: none;
      }
      &:hover {
        img:nth-child(1) {
          display: none;
        }
        img:nth-child(2) {
          display: inline-block;
        }
      }
    }
    img {
      cursor: pointer;
    }
    & > span {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .btn-delete {
      z-index: 99;
      position: absolute;
      top: 30px;
      right: -8px;
      background: #ffffff;
      border: none;
      color: #333;
      box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
    }
  }
}
</style>
