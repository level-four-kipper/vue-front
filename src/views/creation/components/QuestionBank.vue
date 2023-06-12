<template>
  <div>
    <!-- tab -->
    <CreationSubTab ref="subTabRef" :list="tabList" @handle-click="handleTabClick" @search="searchByKey" />
    <!-- 内容 -->
    <div class="main">
      <CreationHeader
        :tab-label="tabLabel"
        :total-count="totalCount"
        :page="page"
        :operation="operation"
        @handle-page-change="handlePageChange" />
      <!-- 列表 -->
      <QuestionBankCard
        v-for="(item, index) in questionBanks"
        :key="index"
        :question-bank="item"
        :show-delete="tab.index === 0"
        @jump-edit="jumpToEdit(item)"
        @delete="handleDelete(item, index)">
        <template #header>
          <div class="header">
            <span class="tag">{{ item.area }}</span>
            <span class="title" @click="jumpToDetail(item)">{{ item.name }}</span>
            <span class="total">收录题量：{{ item.total_questions }}</span>
          </div>
        </template>
      </QuestionBankCard>
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
import CreationSubTab from '@/views/creation/components/CreationSubTab.vue'
import QuestionBankCard from '@/views/creation/components/QuestionBankCard.vue'
import CreationHeader from '@/views/creation/components/CreationHeader.vue'
import { fetchQuestionBanks, deleteQuestionBanks } from '@/api/creation.js'

const operation = {
  title: '题库',
  params: {
    path: '/questionBank/create',
  },
}

const subTabRef = ref(null)
const questionBanks = reactive([])
const totalCount = ref(0)
const loadStatus = ref(1)
const loading = ref(false)
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了',
})

const router = useRouter()
const route = useRoute()

const tab = reactive({
  index: 0,
  subIndex: 0,
})

const tabList = computed(() => {
  return [
    { label: '已创建', value: 0 },
    { label: '已参与', value: 1 },
  ]
})
const tabLabel = ref(tabList.value[tab.index].label)

const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1,
})

// 更多
const loadMore = () => {
  if (loadStatus.value === 2) {
    getQuestionBanks(subTabRef?.value?.textValue)
  }
}

// tab点击返回 {index, subIndex, label}
const handleTabClick = e => {
  tab.index = e.index
  tab.subIndex = e.subIndex
  tabLabel.value = e.label
  page.pageIndex = 1
  questionBanks.length = 0
  getQuestionBanks(subTabRef?.value?.textValue)
}

// 题库列表
function getQuestionBanks(keyword) {
  const params = {
    curr_page: page.pageIndex,
    page_size: page.pageSize,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      condition: tab.index + 1,
      keyword: keyword || '',
    },
  }
  fetchQuestionBanks(params)
    .then(res => {
      if (res.code === 0 && res.data) {
        let data = res.data.list || []
        questionBanks.push(...data)
        totalCount.value = res.data.total_count
        page.totalPage = res.data.total_page
        handleFinish(res.data.curr_page, res.data.total_page, data)
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

// 删除
const handleDelete = (item, index) => {
  ElMessageBox.confirm('确定删除当前题库吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteQuestionBanks(item.id)
      .then(res => {
        if (res.code == 0) {
          ElMessage.success('删除成功')
          questionBanks.splice(index, 1)
          totalCount.value--
        } else {
          ElMessage.error(res?.msg || '删除失败')
        }
      })
      .catch(err => console.log(err))
  })
}

const searchByKey = keyword => {
  page.pageIndex = 1
  questionBanks.length = 0
  getQuestionBanks(keyword)
}

// 跳转详情
const jumpToDetail = item => {
  const routerUrl = router.resolve({
    path: '/questionBank/detail',
    query: {
      id: item.id,
    },
  })
  window.open(routerUrl.href, '_blank')
}

const jumpToEdit = item => {
  // 角色id：0-管理员，1-编辑人员，2-审核人员
  const jumpToAudit = tabLabel.value === '已参与' && item.role_id === 2
  const routerUrl = router.resolve({
    path: '/questionBank/' + (jumpToAudit ? 'audit' : 'editor'),
    query: {
      id: item.id,
    },
  })
  window.open(routerUrl.href, '_blank')
}

onMounted(() => {
  subTabRef.value.handleTabClick(route.query.index || 0)
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
    margin-bottom: 12px;
    line-height: 22px;
    width: 100%;
    .title {
      color: #333333;
      font-size: 16px;
      font-weight: 600;
      align-items: center;
      height: 22px;
    }
    .tag {
      color: #ffffff;
      padding: 0px 6px;
      background-image: linear-gradient(270deg, #61b4ff 0%, #2f8cff 100%);
      border-radius: 1px 8px 1px 8px;
      margin-right: 14px;
      line-height: 16px;
      font-size: 12px;
      height: 18px;
    }
    .total {
      font-size: 14px;
      margin-left: auto;
      color: #9196a6;
    }
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
:deep(.btn-delete) {
  z-index: 1;
}
</style>
