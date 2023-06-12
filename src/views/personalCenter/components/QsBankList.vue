<template>
  <TabHeader :tab-label="tabLabel" :total-count="totalCount" :page="page" :menu-index="menuIndex" @handlePageChange="handlePageChange" />

  <div class="qs-list">
    <div v-for="item in list" :key="item.article_id" class="qs-item">
      <!-- 题目 -->
      <div class="qs-header">
        <div class="btn-2">
          <div class="qs-area">
            <span>{{ item.area }}</span>
          </div>
          <p class="qs-item-title" @click="jumpDetail(item)">{{ item.name }}</p>
        </div>
        <div class="head-right">
          <IconCollect v-if="route.path.includes('myCollect')" @click="handleState('collect', item.id, index)"></IconCollect>
          <span v-else>收录数量：{{ item.total_questions }}</span>
        </div>
      </div>
      <!-- 题目概述 -->
      <p class="qs-content">{{ item.description }}</p>

      <!-- 底部 -->
      <div class="item-footer">
        <template v-if="route.path.includes('myWriting')">
          <div class="message-icon-list">
            <p>
              <img src="@/assets/img/view.png" alt="浏览" />
              <span>{{ item.browse_count }}</span>
            </p>
            <!-- 点赞 -->
            <!-- <p  >
              <img src="@/assets/img/approvaled.png" alt="点赞" />
              <span>{{item.like_count}}人赞同</span>
            </p> -->
            <!-- 收藏 -->
            <p>
              <img src="@/assets/img/collect.png" alt="收藏" />
              <span>{{ item.collect_count }}</span>
            </p>
            <p>
              <img src="@/assets/img/comment.png" />
              <span>{{ 0 }}</span>
            </p>
            <span class="quiz-time">{{ item.gmt_created.slice(0, 10) }}</span>
          </div>
          <div class="edit-set">
            <span class="edit-content" @click.stop="jumpEdit(item)">
              <img src="@/assets/img/personalCenter/edit.png" />
              <img src="@/assets/img/personalCenter/edit-active.png" />
              <span>管理</span>
            </span>
            <el-dropdown @command="handleCommand">
              <span class="more-content">
                <img src="@/assets/img/personalCenter/more.png" class="more" />
                <img src="@/assets/img/personalCenter/more-active.png" class="more" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{ id: item.id, index }">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <template v-else>
          <div class="message-icon-list">
            <p>
              <span>收录数量：{{ item.total_questions }}</span>
            </p>
            <p>
              <span>访问：{{ item.browse_count }}</span>
            </p>
            <p>
              <span>刷题：{{ item.collect_count }}</span>
            </p>
            <p>
              <span>收藏：{{ item.collect_count }}</span>
            </p>
          </div>
          <el-button class="btn-start" @click="jumpDetail(item)">开始学习</el-button>
        </template>
      </div>
    </div>
    <!-- 加载更多 -->
    <div class="bottom-load">
      <el-icon v-if="loading" class="is-loading">
        <Loading />
      </el-icon>
      <span v-else :class="{ more: loadStatus === 2 }" @click="loadMore">{{ loadMap[loadStatus] }}</span>
    </div>
  </div>
</template>
<script setup>
import TabHeader from './TabHeader.vue'
import http from '@/utils/https.js'
import { formatDate } from '@/utils/format.js'
import { fetchQuizAnswer, updateCollect, updateLike } from '@/api/answer.js'
import { useLoginStore } from '@/stores/login.js'
import { fetchCollectQuiz, fetchQuizList, fetchDeleteQsBank } from '@/api/personalCenter.js'
import IconCollect from '@/components/IconCollect.vue'
import EditSet from './EditSet.vue'
import { fetchMyAnswerList, fetchDeleteMyAsk, fetchTotal, fetchUpdateMyAsk } from '@/api/answer.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchQuestionBank } from '@/api/qsBankManage.js'

const props = defineProps({
  tabLabel: String,
  menuIndex: String,
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
  3: '没有更多了',
})
const initPage = {
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1,
}
const page = reactive({ ...initPage })
const resetPage = () => {
  Object.assign(page, initPage)
}

// 跳转编辑
const jumpEdit = item => {
  router.push({
    path: '/questionBank/editor',
    query: { id: item.id },
  })
}
// 跳转详情
const jumpDetail = item => {
  router.push({
    path: '/questionBank/detail',
    query: { id: item.id },
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
    getList(true)
  }
}

const handleCommand = e => {
  handleDelete(e.id, e.index)
}

// 翻页
const handlePageChange = curPage => {
  page.pageIndex = curPage
  getList()
}

// 处理点赞、收藏 type : like | collect
function handleState(type, id, index) {
  const fetchFunction = type === 'like' ? updateLike : updateCollect
  fetchFunction({ article_id: id, article_type: 5 })
    .then(res => {
      if (res.code !== 0) {
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
    })
    .catch(err => console.log(err))
}

// 删除题库
const handleDelete = (id, index) => {
  ElMessageBox.confirm('确定删除当前题库吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    fetchDeleteQsBank(id).then(res => {
      if (res.code !== 0) {
        ElMessage.error(res.msg)
        return
      }
      ElMessage.success('删除成功')
      list.value.splice(index, 1)
      totalCount.value--
      if (page.totalPage > 1) {
        page.totalPage = Math.ceil(totalCount.value / page.pageSize)
        //  查询删除后加上的一条数据
        getListOne(list.value.length + 1)
      }
    })
  })
}

// 题库列表-获取一条
const getListOne = curPage => {
  loading.value = true
  const params = {
    page_size: 1,
    curr_page: curPage,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      keyword: searchValue.value,
    },
  }
  let fetchFunction = route.path.includes('myCollect') ? fetchCollectQuiz : fetchQuizList
  if (!route.params.id) {
    params.entity.condition = route.path.includes('myCollect') ? 3 : 1
  } else {
    params.entity.user_id = id.value
  }
  fetchFunction(params).then(res => {
    loading.value = false
    list.value = [...list.value, ...res.data.list]
    handleFinish(page.pageIndex, page.totalPage, list.value)
  })
}

// 题库列表
function getList(type) {
  loading.value = true
  const params = {
    page_size: page.pageSize,
    curr_page: page.pageIndex,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      keyword: searchValue.value,
    },
  }
  if (!route.params.id) {
    params.entity.condition = route.path.includes('myCollect') ? 3 : 1
  } else {
    params.entity.user_id = id.value
  }
  fetchQuestionBank(params)
    .then(res => {
      loading.value = false
      if (res.code === 0 && res.data) {
        page.pageIndex = res.data.curr_page
        page.pageSize = res.data.page_size
        page.totalPage = res.data.total_page
        totalCount.value = res.data.total_count
        list.value = type ? [...list.value, ...res.data.list] : res.data.list
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
.qs-list-head {
  .all-question {
    display: flex;
    font-size: 18px;
    color: #333333;
    margin-top: 30px;
    font-weight: 600;
  }
  .module-list {
    display: flex;
    float: right;
    justify-content: flex-end;
    width: 108px;
    margin-top: -20px;
    .index {
      width: 28px;
      margin-left: 20px;
      text-align: center;
      span:hover {
        color: #0175ff;
      }
      .active {
        color: #0175ff;
      }
    }
    span {
      display: flex;
      cursor: pointer;
      font-size: 14px;
      color: #333333;
    }
  }
}
.qs-list {
  display: flex;
  flex-flow: column;
  position: relative;
  .qs-item {
    width: 910px;
    height: 146px;
    padding: 16px;
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 15px;
    &:hover {
      box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
    }
  }
  .qs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 22px;
    font-weight: 600;
    font-size: 16px;
    .btn-2 {
      display: inline;
      align-items: center;
      display: flex;
      .qs-area {
        display: inline-block;
        vertical-align: middle;
        min-width: 40px;
        height: 18px;
        margin-right: 16px;
        padding: 0 5px;
        background-image: linear-gradient(-270deg, #61b4ff 0%, #2f8cff 100%);
        border-radius: 1px 8px 1px 8px;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          line-height: 15px;
          top: 2px;
          text-align: center;
          color: #ffffff;
        }
      }
      .qs-item-title {
        font-size: 16px;
        line-height: 22px;
        font-weight: 600;
        color: #333333;
        letter-spacing: 0;
        cursor: pointer;
      }
    }
    .head-right {
      color: #9196a6;
    }
    .qs-message-data {
      display: flex;
      font-size: 14px;
      align-items: center;
      color: #9196a6;
      float: right;
      cursor: pointer;
      img {
        top: 2px;
      }
      span {
        margin-left: 6px;
      }
    }
  }

  .qs-content {
    height: 50px;
    font-size: 14px;
    line-height: 20px;
    color: #6d717d;
    letter-spacing: 0;
    margin-top: 12px;
    // width: 548px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .item-footer {
    height: 20px;
    margin-top: 10px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    .message-icon-list {
      display: flex;
      align-items: center;
      color: #9196a6;
      p {
        margin-right: 20px;
        display: flex;
        align-items: center;
        &.approval-count {
          height: 32px;
          line-height: 32px;
          padding: 0 12px;
          color: #0175ff;
          background: #eef3fd;
          border-radius: 4px;
          span {
            margin-left: 6px;
          }
        }
        img {
          margin-right: 2px;
        }
      }
    }

    .edit-set {
      margin-top: 1px;
      background: #fff;
      padding: 0 10px;
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
    .btn-start {
      background-color: #ffffff;
      color: #0175ff;
      border-color: #0175ff;
      width: 88px;
      &:hover {
        background-color: #0175ff;
        color: #fff;
      }
    }
  }
}
.bottom-load {
  margin-top: 30px;
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
</style>
