<template>
  <!-- 题库详情 -->
  <div class="question-bank">
    <div class="question-bank-banner">
      <div>
        <Breadcrumb :list="breadcrumbList" />
        <Header :detail="questionBank" :exercise-enable="exerciseEnable"></Header>
      </div>
    </div>

    <ListSearch ref="listSearchRef" :count="totalCount" @search="searchByKey"></ListSearch>

    <div v-for="(item, index) in questions" :key="item.id" class="question-cards">
      <QuestionCard ref="questionCardRef" :question="item" :index="index + 1"></QuestionCard>
    </div>

    <div class="bottom-load">
      <el-icon v-if="loading" class="is-loading">
        <Loading />
      </el-icon>
      <span v-else :class="{ more: loadStatus === 2 }" @click="loadMore">{{ loadMap[loadStatus] }}</span>
    </div>
  </div>
</template>

<script setup name="questionAnswerDetail">
import { fetchQuestions } from '@/api/questionBank.js'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Header from './components/Header.vue'
import ListSearch from './components/ListSearch.vue'
import QuestionCard from './components/QuestionCard.vue'

// 数据
const breadcrumbList = [
  { name: '题库', path: '/questionBank/index' },
  { name: '题库详情', path: '' },
]
const questionBank = ref({})
const questions = reactive([])

const totalCount = ref(0)

const loadStatus = ref(1)
const loading = ref(false)
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了',
})
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1,
})

let exerciseEnable = ref(false)

const listSearchRef = ref(null)

const route = useRoute()

// 更多
const loadMore = () => {
  if (loadStatus.value === 2) {
    getQuestions()
  }
}

const searchByKey = () => {
  page.pageIndex = 1
  questions.length = 0
  getQuestions()
}

// 题库的列表
function getQuestions() {
  const params = {
    curr_page: page.pageIndex,
    entity: {
      question_bank_id: route.query.id || '',
      keyword: listSearchRef.value.keyword || '',
    },
    order: 'desc',
    sql_filter: '',
    page_size: page.pageSize,
    page: {},
    sidx: '',
  }
  fetchQuestions(params)
    .then(res => {
      if (res.code === 0 && res?.data) {
        let data = res.data.list || []
        questions.push(...data)
        page.totalPage = res.data.total_page
        totalCount.value = res.data.total_count
        handleFinish(res.data.curr_page, res.data.total_page, data)
        exerciseEnable.value = data?.some(item => [0, 1].includes(item.type_id))
      }
    })
    .catch(err => console.log(err))
}

// 加载完成
const handleFinish = (curr_page, total_page, arr) => {
  if (arr.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (curr_page < total_page) {
    // 加载更多
    page.pageIndex = curr_page + 1
    loadStatus.value = 2
  } else if (curr_page === total_page) {
    // 没有更多了
    loadStatus.value = 3
  }
}

onMounted(async () => {
  await getQuestions()
})
defineExpose({})
</script>

<style lang="scss" scoped>
.question-bank {
  width: 100%;
  background-color: #f5f8fe;
  .question-bank-banner {
    display: flex;
    background-color: #ffffff;
    justify-content: center;
    height: 250px;
    div {
      width: 1200px;
    }
  }
  .question-cards {
    display: flex;
    background: #eef3fd;
    justify-content: center;
  }
  .bottom-load {
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    background-color: #eef3fd;
    padding: 20px 0px 40px 0px;
    span {
      color: #6d717d;
      &.more {
        color: #0175ff;
        &:hover {
          cursor: pointer;
          opacity: 0.85;
        }
      }
    }
  }
}
</style>
