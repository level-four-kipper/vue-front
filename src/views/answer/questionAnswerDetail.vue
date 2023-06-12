<template>
  <div class="qaDetail">
    <div class="qa-center">
      <div class="qaDetail-banner">
        <Breadcrumb :list="[{name: '问答',path: '/quizIndex'},{name: '问答详情',path: ''}]" />
        <QuestionDetail v-if="qaDetail.id" :detail="qaDetail" @subscribe="toggleQuestionCollect" />
      </div>
    </div>

    <div class="qaDetail-answer">
      <div class="qaDetail-content">

        <AnswerDetail ref="answerDetailRef" :detail="qaDetail" @updateComment="updateComment" />
        <!-- 关联问题和博文 -->
        <div class="qaDetail-related" v-if="qaDetail.list_tags">
          <DetailRelate :tags="qaDetail.list_tags" @subscribe="toggleAnswerCollect" />
        </div>
      </div>
    </div>
    <DetailFix :star_flag="qaDetail.star_flag" @collect="toggleQuestionCollect" @focusMyAnswer="focusMyAnswer" />
  </div>
</template>

<script setup name="questionAnswerDetail">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchAnswerIndex, updateCollect } from '@/api/answer.js'
import Breadcrumb from '@/components/Breadcrumb.vue'
import DetailFix from './components/DetailFix.vue'
import DetailRelate from './components/DetailRelate.vue'
import QuestionDetail from './components/QuestionDetail.vue'
import AnswerDetail from './components/AnswerDetail.vue'

// 数据
const breadcrumbList = ['首页', '问答', '问答详情']
const qaDetail = ref({ myAnswer: '' })
const answerDetailRef = ref()

const toggleQuestionCollect = async () => {
  await toggleCollect(qaDetail.value.id, 1)
  await getAnswerDetail()
}

const toggleAnswerCollect = async id => {
  await toggleCollect(id, 3)
}

const toggleCollect = async (id, type) => {
  const params = {
    article_id: id,
    article_type: type
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

const route = useRoute()

// 请求问答主页的展示
function getAnswerDetail() {
  const params = {
    id: String(route.params.id),
    sort_status: 0
  }
  fetchAnswerIndex(params)
    .then(res => {
      if (res.code === 0 && res?.data) {
        qaDetail.value = { ...res.data, myAnswer: '' }
      }
    })
    .catch(err => console.log(err))
}

const focusMyAnswer = () => {
  console.log(answerDetailRef)
  answerDetailRef.value.focusMyAnswer()
}

const updateComment = count => {
  qaDetail.value.comment_count = count
}

onMounted(async () => {
  await getAnswerDetail()
})
defineExpose({})
</script>

<style lang="scss" scoped>
.qaDetail {
  width: 100%;
  .qa-center{
    display: flex;
    justify-content: center;
    .qaDetail-banner {
      min-width: 1200px;
      background-color: #ffffff;
    }
  }

  .qaDetail-answer {
    display: flex;
    justify-content: center;
    background-color: #eef3fd;
    padding-top: 40px;
    .qaDetail-content{
      display: flex;
      justify-content: space-between;
      min-height: calc(100vh - 538px);
      width: 1200px;
      margin-bottom: 60px;
      .qaDetail-related {
        color: #333333;
        font-size: 14px;
        width: 30%;
      }
    }
  }
}
</style>
