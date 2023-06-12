<template>
  <TabHeader :tab-label="tabLabel" :total-count="totalCount" :page="page" :menu-index="menuIndex" @handlePageChange="handlePageChange" />

  <div v-for="(item, index) in list" :key="item.id" class="question-cards">
    <QuestionCard ref="questionCardRef" :question="item" :index="(index+1)"></QuestionCard>
    <IconCollect @click="handleState(  item.id,index )"></IconCollect>
  </div>
  <!-- 加载更多 -->
  <div class="bottom-load">
    <el-icon v-if="loading" class="is-loading">
      <Loading />
    </el-icon>
    <span v-else :class="{'more': loadStatus === 2}" @click="loadMore">{{ loadMap[loadStatus] }}</span>
  </div>
</template>

<script setup>
import TabHeader from './TabHeader.vue'
import { formatDate } from '@/utils/format.js'
import { useLoginStore } from '@/stores/login.js'
import { fetchCollectQuiz, fetchQuizList, fetchDeleteQsBank } from '@/api/personalCenter.js'
import IconCollect from "@/components/IconCollect.vue";
import QuestionCard from '@/views/questionBank/components/QuestionCard.vue'
import { fetchMyAnswerList, fetchDeleteMyAsk, fetchTotal, fetchUpdateMyAsk } from '@/api/answer.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchQsCollect, fetchQsCollectUpdate } from '@/api/questionBank.js'


const props = defineProps({
  tabLabel: String,
  menuIndex: String
})


const { searchValue } = inject('searchValue')
const loginStore = useLoginStore()
const { id: userId } = storeToRefs(loginStore)
const emit = defineEmits(['handleAction'])
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const loadStatus = ref(1)
const list = ref([])
const totalCount = ref(0)
const currentIndex = ref(0) //点击列表下标
const id = computed(() => {
  return route.params.id || userId.value
})
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})
const initPage = {
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1
}
const page = reactive({ ...initPage })
const resetPage = () => {
  Object.assign(page, initPage);
}
 


// 跳转编辑
const jumpEdit = (item) => {
  router.push({
    path: '/questionBank/editor',
    query: { id: item.id }
  })
}
// 跳转详情
const jumpDetail = (item) => {
  router.push({
    path: '/questionBank/detail',
    query: { id: item.id }
  })
}


// 加载完成 判断底部状态
const handleFinish = (curr_page, total_page, arr) => {
  if (arr.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (curr_page < total_page) {
    // 加载更多
    loadStatus.value = 2
  } else if (curr_page === total_page) {
    // 没有更多了
    loadStatus.value = 3
  }
}

//加载更多
const loadMore = () => {
  if (loadStatus.value === 2) {
    page.pageIndex++
    getList()
  }
}

const handleCommand = (e) => {
  handleDelete(e.id, e.index)
}

// 翻页
const handlePageChange = curPage => {
  page.pageIndex = curPage
  getList()
}

// 处理点赞、收藏 type : like | collect
function handleState (id, index) {
  fetchQsCollectUpdate(id).then(res => {
    if(res.code !== 0 ) {
      ElMessage.error('取消收藏失败')
      return
      }
    list.value.splice(index, 1)
    totalCount.value--
    if (page.totalPage > 1) {
      page.totalPage = Math.ceil(totalCount.value / page.pageSize)
      //  查询删除后加上的一条数据
      getListOne(list.value.length + 1)
    }
  }).catch(err => console.log(err))
}








// 题目列表-获取一条
const getListOne = (curPage) => {
  loading.value = true
  const params = {
    page_size: 1,
    curr_page: curPage,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      keyword: searchValue.value,
    }
  }
  fetchQsCollect(params).then(res => {
    loading.value = false
    if (res.code !== 0) return
    list.value = [...list.value, ...res.data.list]
    handleFinish(page.pageIndex, page.totalPage, list.value)
  })
}

// 题目列表
function getList () {
  loading.value = true
  const params = {
    page_size: page.pageSize,
    curr_page: page.pageIndex,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      keyword: searchValue.value,
    }
  }
  fetchQsCollect(params).then(res => {
    loading.value = false
    if (res.code === 0 && res.data) {
      page.pageIndex = res.data.curr_page
      page.pageSize = res.data.page_size
      page.totalPage = res.data.total_page
      totalCount.value = res.data.total_count
      list.value = [...list.value, ...res.data.list]
      handleFinish(page.pageIndex, page.totalPage, list.value)
    }
  })
    .catch(err => console.log(err))
}


 
//关键字搜索
watch(searchValue, () => {
  resetPage()
  list.value = []
  getList()
})

onMounted(() => {
  getList()

})
</script>

<style lang="scss" scoped>
.bottom-load {
  // margin-top: 30px;
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
.question-cards {
  position: relative;
  width: 910px;
  justify-content: center;
  .question-card {
    width: 910px;
    :deep(.question-header) {
      width: 830px;
      .hide-answer,
      .check-answer {
        margin-left: 20px;
      }
       .check-answer {
       width: 100px;
      }
    }
  }
  .collect {
    position: absolute;
    right: 20px;
    top:  20px;
    z-index: 99;
  }
}
</style>
