<!-- 提问列表 -->
<template>
  <div class="question-card">
    <div class="question-header">
      <div>
        {{ index + '. ' }}
        {{ types[question.type_id] }}
        <span class="title">{{ question?.title }}</span>
      </div>
      <div :class="['question-level', 'level-' + (question?.difficulty || '1')]" />
    </div>
    <!-- 题目描述 -->
    <el-input
      v-if="question?.description"
      ref="textareaRef"
      :value="question?.description"
      :disabled="true"
      class="topic-desc"
      autosize
      type="textarea"
      placeholder="" />
    <Selection v-if="[0, 1].includes(question?.type_id)" :type="question.type_id" :options="question?.option_volist"></Selection>

    <InputAnswer v-if="[2, 3].includes(question?.type_id)" :min="8" :border="true"></InputAnswer>

    <Answer :question="question"> </Answer>
  </div>
</template>
<script setup>
import Selection from '@/views/questionBank/components/Selection.vue'
import InputAnswer from '@/views/questionBank/components/InputAnswer.vue'
import Answer from './Answer.vue'
import { fetchQuestionId } from '@/api/qsBankManage.js'

defineProps({
  index: { type: Number, default: 1 },
  question: { type: Object, default: () => {} },
})

const route = useRoute()

const question = ref({})
const showAnswer = ref(false)
const types = ['单选', '多选', '简答', '编程']
const textareaRef = ref()

// 题库的详情
function getQuestionById() {
  fetchQuestionId(String(route.query.id))
    .then(res => {
      if (res.code === 0 && res?.data) {
        question.value = { ...res.data }
        // 解决textarea autosize失效问题
        nextTick(() => {
          textareaRef.value.resizeTextarea()
        })
      }
    })
    .catch(err => console.log(err))
}

onMounted(() => {
  getQuestionById()
})
</script>
<style lang="scss" scoped>
.question-card {
  width: 1200px;
  padding: 16px;
  min-width: 910px;
  border-radius: 4px;
  margin-bottom: 20px;
  min-height: 100px;
  padding: 20px;
  background: #ffffff;
  &:hover {
    box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  }

  .question-header {
    color: #333333;
    display: flex;
    font-size: 18px;
    line-height: 25px;
    height: 25px;
    .title {
      padding: 0 10px 0px 20px;
      font-weight: 600;
    }
    .question-level {
      transform: scaleX(-1);
      border-radius: 8px 1px 8px 1px;
    }
    .level-0 {
      background-image: linear-gradient(270deg, #61b4ff 0%, #2f8cff 100%);
    }
    .level-1 {
      background-image: linear-gradient(270deg, #b0f585 0%, #94d565 100%);
    }
    .level-2 {
      background-image: linear-gradient(270deg, #7694ff 0%, #6e78ff 100%);
    }
    .level-3 {
      background-image: linear-gradient(270deg, #f5bc85 0%, #d5a665 100%);
    }
    .check-answer {
      cursor: pointer;
      margin-left: auto;
      font-size: 14px;
      color: #0175ff;
    }
    .hide-answer {
      cursor: pointer;
      margin-left: auto;
      color: #9196a6;
      font-size: 14px;
    }
  }
  .topic-desc {
    margin-top: 5px;
    font-size: 12px;
    color: #a4a9b1;
    :deep(.el-textarea__inner) {
      background-color: #fff;
    }
  }
  .leftDivider {
    margin: 16px 0;
    // background-color: #C8C8DB;
    // border-top: 1px #C8C8DB;
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
}
</style>
