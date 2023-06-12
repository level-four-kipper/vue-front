<template>
  <!-- 题目详情 -->
  <div class="question-exercise">
    <div class="question-exercise-banner">
      <Breadcrumb
        :list="[
          { name: '题库', path: '/questionBank/index' },
          { name: '题库详情', path: `/questionBank/detail?id=${route?.query?.questionBankId || ''}` },
          { name: '题目详情', path: '' },
        ]" />
    </div>

    <div class="question-cards">
      <ExerciseCard :question="questionExercise" :index="1" />
    </div>

    <div class="comment-cards">
      <div class="question-exercise-comment">
        <BlogComment v-if="id" :id="id" ref="commentRef" :user-id="questionExercise.user_id" @updateComment="updateComment" />
        <!-- 关联问题和博文 -->
        <div class="question-exercise-related">
          <DetailRelate :tags="questionExercise.list_tags" @subscribe="toggleAnswerCollect" />
        </div>
      </div>
    </div>
    <!-- <DetailFix :star_flag="questionExercise.star_flag" @collect="toggleQuestionCollect" @focusMyAnswer="focusMyAnswer" /> -->
  </div>
</template>

<script setup name="QuestionExercise">
import { ElMessage } from 'element-plus'
import { updateCollect } from '@/api/answer.js'
import Breadcrumb from '@/components/Breadcrumb.vue'
import ExerciseCard from '@/views/questionBank/exerciseModel/components/ExerciseCard.vue'
import BlogComment from '@/views/blog/components/BlogComment.vue'

import DetailRelate from '@/views/answer/components/DetailRelate.vue'
import DetailFix from '@/views/answer/components/DetailFix.vue'

const route = useRoute()

// 数据
const questionExercise = ref({ myAnswer: '' })
const answerDetailRef = ref()
const id = ref('')
const toggleQuestionCollect = async () => {
  await toggleCollect(questionExercise.value.id, 1)
}

const toggleAnswerCollect = async id => {
  await toggleCollect(id, 3)
}

const toggleCollect = async (id, type) => {
  const params = {
    article_id: id,
    article_type: type,
  }
  await updateCollect(params)
    .then(res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: res.msg, type: 'error' })
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const focusMyAnswer = () => {
  console.log(answerDetailRef)
  answerDetailRef.value.focusMyAnswer()
}

const updateComment = count => {
  questionExercise.value.comment_count = count
}

onMounted(async () => {
  id.value = route.query.id
})
defineExpose({})
</script>

<style lang="scss" scoped>
.question-exercise {
  width: 100%;
  margin-top: -20px;
  background-color: #eef3fd;
  .question-exercise-banner {
    background-color: #eef3fd;
    margin: 20px auto;
    padding-top: 2px;
  }
  .question-cards {
    display: flex;
    justify-content: center;
    margin-top: 35px;
    background: #eef3fd;
  }
  .comment-cards {
    display: flex;
    justify-content: center;
    padding: 60px 0 100px 0;
    .question-exercise-comment {
      display: flex;
      background-color: #eef3fd;
      justify-content: space-between;
      min-height: calc(100vh - 538px);
      width: 1200px;
      .comment {
        padding: 0;
        margin: 0;
      }
      .question-exercise-related {
        color: #333333;
        font-size: 14px;
        width: 30%;
      }
    }
  }
}
</style>
