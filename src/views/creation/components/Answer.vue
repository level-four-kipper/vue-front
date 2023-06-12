<template>
  <div>
    <!-- tab -->
    <CreationSubTab ref="subTabRef" :list="tabList" @handleClick="handleTabClick" @search="searchByKey" />
    <!-- 内容 -->
    <div class="main" v-infinite-scroll="loadMore">
      <CreationHeader :tabLabel="tabLabel" :totalCount="totalCount" :page="page" :operation="operation" @handlePageChange="handlePageChange" />
      <!-- 列表 -->
      <div v-if="answers.length">
        <QuestionCard v-for="(item, index) in answers" :key="index"
          :question="item"
          :showCount="showCount"
          @delete="handleDelete(item, index)"
          @jumpEdit="jumpToEdit"
          @jumpDetail="jumpToDetail"
         >
          <template #header>
            <div class="header">
              <div @click="jumpToQuiz(item)" class="title">
                <img src="@/assets/img/creation/question.png" alt="问题" />
                {{ item.title }}
                <span v-if="showCount" class="total">{{ item?.answer_count || 0 }} 个回答</span>
              </div>
            </div>
          </template>
          <template #content-text>
            <div class="content-text">{{ item?.content_no_image }}</div>
          </template>
          <template v-if="showCount" #total>
            <span class="like-count">{{ item?.like_count || 0 }}人赞同</span>
          </template>
        </QuestionCard>
      </div>
      <div class="bottom-load">
        <el-icon v-if="loading" class="is-loading">
          <Loading />
        </el-icon>
        <span v-else :class="{ more: loadStatus === 2 }" @click="loadMore">{{ loadMap[loadStatus] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import CreationHeader from '@/views/creation/components/CreationHeader.vue'
import CreationSubTab from '@/views/creation/components/CreationSubTab.vue'
import QuestionCard from '@/views/creation/components/QuestionCard.vue'
import { fetchAnswerList, deleteAnswer } from '@/api/creation.js'

const operation = ref({
  title: '问题',
  params: {
    path: '/publishQuestion'
  }
})

let answers = reactive([])
const totalCount = ref(0)
const subTabRef = ref(null)

const router = useRouter()
const route = useRoute()

const loadStatus = ref(1)
const loading = ref(false)
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})

const tab = reactive({
  index: 0,
  subIndex: 0
})

const tabList = computed(() => {
  return [
    { label: '已发布', value: 1 },
    { label: '草稿箱', value: 2 }
  ]
})
const tabLabel = ref(tabList.value[tab.index].label)
const showCount = computed(() => {
  return tab.index != 1
})
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1
})

// 更多
const loadMore = () => {
  if (loadStatus.value === 2) {
    page.pageIndex++
    getAnswerList(tab.index, subTabRef?.value?.textValue)
  }
}

// tab点击返回 {index, subIndex, label}
const handleTabClick = e => {
  tab.index = e.index
  tab.subIndex = e.subIndex
  tabLabel.value = e.label
  page.pageIndex = 1
  answers.length = 0
  getAnswerList(e.index, subTabRef?.value?.textValue)
}

// 加载完成
const handleFinish = (curr_page, total_page, arr) => {
  if (arr.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (curr_page < total_page) {
    // 加载更多
    // page.pageIndex = curr_page + 1
    loadStatus.value = 2
  } else if (curr_page === total_page) {
    // 没有更多了
    loadStatus.value = 3
  }
}

// 列表-获取一条
const getListOne = () => {
  const params = {
    curr_page: answers.length + 1,
    entity: {
      issue: parseInt(tab.index) + 1 || 0,
      keyword: subTabRef?.value?.textValue || ''
    },
    page_size: 1
  }
  fetchAnswerList(params)
    .then(res => {
      if (res.code === 0 && res.data) {
        res.data.list.forEach(item => (item.isMore = false))
        // answers.push(...res.data.list)
        answers.push(...res.data.list)
        handleFinish(page.pageIndex, page.totalPage, answers)
        // let data = res?.data?.list || []
        // answers.push( ...data)
        // totalCount.value = res.data.total_count
        // page.totalPage = res.data.total_page
        // handleFinish(page.pageIndex, page.totalPage, data)
      }
    })
    .catch(err => console.log(err))
}

// 提问列表
function getAnswerList(issue, keyword) {
  const params = {
    curr_page: page.pageIndex,
    entity: {
      issue: parseInt(tab.index) + 1 || issue || 0,
      keyword: keyword || ''
    },
    page_size: page.pageSize
  }
  fetchAnswerList(params)
    .then(res => {
      if (res.code === 0 && res.data) {
        let data = res?.data?.list || []
        answers.push(...data)
        totalCount.value = res.data.total_count
        page.totalPage = res.data.total_page
        handleFinish(res.data.curr_page, res.data.total_page, data)
      }
    })
    .catch(err => console.log(err))
}

const jumpToEdit = item => {
  const routeUrl = router.resolve({ path: '/publishAnswer/' + item.question_id, query: { id: item.id } })
  window.open(routeUrl.href, '_blank')
}
const jumpToQuiz = item => {
  const routeUrl = router.resolve({ path: '/questionAnswerDetail/' + item.question_id })
  window.open(routeUrl.href, '_blank')
}

const jumpToDetail = item => {
  const routeUrl = router.resolve({
    path: `/publishAnswer`,
    query: { id: item.question_id }
  })
  window.open(routeUrl.href, '_blank')
}

const handleDelete = (item, index) => {
  ElMessageBox.confirm('确定删除当前回答吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteAnswer(item.id)
      .then(res => {
        if (res.code == 0) {
          ElMessage.success('删除成功')
          answers.splice(index, 1)
          totalCount.value--
          if (page.totalPage > 1) {
            page.totalPage = Math.ceil(totalCount.value / page.pageSize)
            //  查询删除后加上的一条数据
            getListOne()
          }
        } else {
          ElMessage.error(res?.msg || '删除失败')
        }
      })
      .catch(err => console.log(err))
  })
}

const searchByKey = keyword => {
  page.pageIndex = 1
  answers.length = 0
  getAnswerList(tab.index, keyword)
}

const handlePageChange = pageIndex => {
  console.log(pageIndex)
}

onMounted(() => {
  subTabRef.value.handleTabClick(route.query.type || 0)
  console.log(route.query)
})
</script>

<style lang="scss" scoped>
.main {
  width: 910px;
  margin: 20px auto;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    margin-bottom: 10px;
    line-height: 22px;
    .title {
      display: flex;
      color: #333333;
      background: #eef3fd;
      font-weight: 600;
      font-size: 14px;
      height: 42px;
      border-radius: 4px;
      padding: 7px 16px 7px 12px;
      align-items: center;
      cursor: pointer;
      img {
        height: 28px;
        margin-right: 12px;
        width: 28px;
      }
      .total {
        margin-left: 20px;
        color: #0175ff;
      }
    }
  }
  .content-text {
    margin-top: 10px;
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
  .like-count {
    color: #0175ff;
    background: #eef3fd;
    border-radius: 4px;
    margin-right: 20px;
    line-height: 32px;
    padding: 0px 12px;
    height: 32px;
  }
  .bottom-load {
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
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
