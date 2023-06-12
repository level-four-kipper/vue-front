<template>
  <div>
    <!-- tab -->
    <CreationSubTab ref="subTabRef" :list="tabList" @handleClick="handleTabClick" @search="searchByKey" />
    <!-- 内容 -->
    <div class="main" v-infinite-scroll="loadMore">
      <CreationHeader :tabLabel="tabLabel" :totalCount="totalCount" :page="page"
        :operation="operation"
        @handlePageChange="handlePageChange" />
      <!-- 列表 -->
      <div v-if="questions.length">
        <QuestionCard
        v-for="(item, index) in questions" :key="index"
        :question="item"
        :showCount="showCount"
        @delete="handleDelete(item, index)"
        @jumpEdit="jumpToEdit"
        @jumpDetail="jumpToDetail"/>
      </div>
      <div class="bottom-load">
        <el-icon v-if="loading" class="is-loading">
          <Loading />
        </el-icon>
        <span v-else :class="{'more': loadStatus === 2}" @click="loadMore">{{ loadMap[loadStatus] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import CreationSubTab from '@/views/creation/components/CreationSubTab.vue'
import CreationHeader from '@/views/creation/components/CreationHeader.vue'
import QuestionCard from '@/views/creation/components/QuestionCard.vue'
import { fetchQuizList, deleteQuiz } from '@/api/creation.js'

const operation = ref({
  title: '问题',
  params: {
    path: '/publishQuestion'
  }
})

const subTabRef = ref(null)

let questions = reactive([])
const totalCount = ref(0)
const loadStatus = ref(1)
const loading = ref(false)
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})


const router = useRouter()
const route = useRoute()

const tab = reactive({
  index: 0,
  subIndex: 0
})

const tabList = computed(() => {
  return [
      { label: '已发布', value: 1 },
      { label: '草稿箱', value: 0 }
    ]
})
const tabLabel = ref(tabList.value[tab.index].label)

const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1
})
const showCount = computed(() => {
  return tab.index != 1
})
// 更多
const loadMore = () => {
  if(loadStatus.value === 2){
    page.pageIndex ++
    getQuizList(tab.index, subTabRef?.value?.textValue)
  }
}

// tab点击返回 {index, subIndex, label}
const handleTabClick = e => {
  tab.index = e.index
  tab.subIndex = e.subIndex
  tabLabel.value = e.label
  page.pageIndex = 1
  questions.length = 0
  getQuizList(e.index, subTabRef?.value?.textValue)
}

// 加载完成
const handleFinish = (curr_page, total_page, arr) => {
  if (arr.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (curr_page < total_page) {
    // // 加载更多
    // page.pageIndex = curr_page + 1
    loadStatus.value = 2
  } else if (curr_page === total_page) {
    // 没有更多了
    loadStatus.value = 3
  }
  console.log('handleFinish-----2----', curr_page, total_page)
}

// 列表-获取一条
function getListOne() {
  const params = {
    curr_page: questions.length + 1,
    entity: {
      issue: tab.index || 0,
      keyword: subTabRef?.value?.textValue || ''
    },
    page_size: 1
  }
  fetchQuizList(params).then(res => {
    if (res.code === 0 && res?.data?.list?.length) {
      res.data.list.forEach(item => item.isMore = false)
      questions.push(...res.data.list)
      handleFinish(page.pageIndex, page.totalPage, questions)
    }
  }).catch(err => console.log(err))
}

// 提问列表
function getQuizList(issue, keyword) {
  const params = {
    curr_page: page.pageIndex,
    entity: {
      issue: tab.index || issue || 0,
      keyword: keyword || ''
    },
    page_size: page.pageSize
  }
  fetchQuizList(params).then(res => {
    if (res.code === 0 && res?.data) {
      let data = res?.data?.list || []
      questions.push( ...data)
      totalCount.value = res.data.total_count
      page.totalPage = res.data.total_page
      handleFinish(res.data.curr_page, res.data.total_page, data)
    }
  }).catch(err => console.log(err))
}


const jumpToEdit = (item) => {
  const routeUrl = router.resolve({
    path: '/publishQuestion',
    query: {
      id: item.id
    }
  })
  window.open(routeUrl.href, '_blank')
}

const jumpToDetail = (item) => {
  const routerUrl = router.resolve({
    path: '/questionAnswerDetail/' + item.id,
    query: {
      preview: 1
    }
  })
  window.open(routerUrl.href, '_blank')
}

// 删除
const handleDelete = (item, index) => {
  ElMessageBox.confirm( '确定删除当前问题吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    deleteQuiz(item.id).then(res => {
      if (res.code == 0) {
        ElMessage.success('删除成功')
        questions.splice(index, 1)
        totalCount.value--
        if (page.totalPage > 1) {
          page.totalPage = Math.ceil(totalCount.value / page.pageSize)
          //  查询删除后加上的一条数据
          getListOne()
        }
      } else {
        ElMessage.error(res?.msg ||'删除失败')
      }
    }).catch(err => console.log(err))
  })
}

const searchByKey = (keyword) => {
  page.pageIndex = 1
  questions.length = 0
  getQuizList(tab.index, keyword)
}

const handlePageChange = pageIndex => {
  console.log(pageIndex)
}

onMounted(() => {
  subTabRef.value.handleTabClick(route.query.type || 0)
})
</script>

<style lang="scss" scoped>
.main {
  width: 910px;
  margin: 20px auto;
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
