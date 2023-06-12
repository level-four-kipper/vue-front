<!-- 回答列表 -->
<template>
  <TabHeader :tabLabel="tabLabel" :totalCount="totalCount" :page="page" :menuIndex="menuIndex" @handlePageChange="handlePageChange" />
  <div class="answer-item" v-for="(item, index) in list" :key="item.id">
    <!-- 图片列表 -->
    <div v-if="item.img_content && item.img_content.length === 1" class="content-img">
      <img v-for="(url, index) in item.img_content" :key="index" :src="url" alt="" />
    </div>
    <div class="text-content" :class="[{ 'image-left': item.img_content && item.img_content.length === 1 }, { 'image-bottom': item.img_content && item.img_content.length > 1 }]">
      <div class="answer-head">
        <div class="head-left" @click="jumpAnswerDetail(item.question_id)">
          <img src="@/assets/img/authorPhoto/问题.png" class="answer-photo" />
          <p class="answer-title">{{ item.title }}</p>
          <span class="answer-total">{{ item.answer_count }}个回答</span>
        </div>
        <div v-if="route.path.includes('myCollect')" class="head-right">
          <IconCollect @click="handleState('collect', item.id, index)"></IconCollect>
        </div>
      </div>
      <div class="answer-content">
        {{ item.content || item.content_no_image }}
      </div>
      <!-- 图片列表 -->
      <div v-if="item.img_content && item.img_content.length > 1" class="content-img">
        <img v-for="(url, index) in item.img_content.slice(0, 3)" :key="index" :src="url" alt="" />
      </div>
      <div class="answer-foot">
        <div class="message-icon-list">
          <!-- 点赞 -->
          <p class="approval-count">
            <!-- <img v-show="!item.like_flag" src="@/assets/img/approval.png" alt="未点赞" /> -->
            <img src="@/assets/img/approvaled.png" alt="点赞" />
            <span>{{ item.like_count }}人赞同</span>
          </p>
          <!-- 收藏 -->
          <p>
            <img src="@/assets/img/collect.png" alt="收藏" />
            <span>{{ item.star_count }}</span>
          </p>
          <p>
            <img src="@/assets/img/comment.png" />
            <span>{{ item.comment_count }}</span>
          </p>
          <span class="quiz-time">{{ formatDate(item.answer_time || item.gmt_created, 'yyyy-mm-dd') }}</span>
        </div>
        <!-- 提问列表 个人视角可编辑 -->
        <template v-if="!route.params.id && route.path.includes('myWriting')">
          <div class="edit-set">
            <span @click.stop="jumpEditAnswer(item)" class="edit-content">
              <img src="@/assets/img/personalCenter/edit.png" />
              <img src="@/assets/img/personalCenter/edit-active.png" />
              <span>编辑</span>
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
      </div>
    </div>
  </div>
  <div class="bottom-load">
    <el-icon v-if="loading" class="is-loading">
      <Loading />
    </el-icon>
    <span v-else :class="{ more: loadStatus === 2 }" @click="loadMore">{{ loadMap[loadStatus] }}</span>
  </div>
</template>

<script setup>
import TabHeader from './TabHeader.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateCollect, updateLike } from '@/api/answer.js'
import { useLoginStore } from '@/stores/login.js'
import { htmlToString } from '@/utils/utils.js'
import { fetchCollectQuizAnswer, fetchQuizAnswer, deleteAnswer } from '@/api/personalCenter.js'
import { formatDate } from '@/utils/format.js'
import IconCollect from '@/components/IconCollect.vue'
import EditSet from './EditSet.vue'

const props = defineProps({
  tabLabel: String,
  menuIndex: Number,
})

const { searchValue } = inject('searchValue')
const loginStore = useLoginStore()
const { id: userId } = storeToRefs(loginStore)
const router = useRouter()
const route = useRoute()
const currentIndex = ref(0) //博客列表下标
const list = ref([])
const loading = ref(false)
const totalCount = ref(0)
const loadStatus = ref(1)
const id = computed(() => {
  return route.params.id || userId.value
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

const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了',
})

const emit = defineEmits(['handleAction'])

//路由变化重新初始化数据
watch(route, () => {
  resetPage()
  list.value = []
  getList()
})


// 跳转详情页
const jumpAnswerDetail = id => {
  const routeUrl = router.resolve({
    path: `/questionAnswerDetail/${id}`,
  })
  window.open(routeUrl.href, '_blank')
}

// 跳转提问编辑
const jumpEditAnswer = item => {
  router.push({ path: `/publishAnswer/${item.question_id}`, query: { id: item.id } })
}

// 加载完成
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
    getList('more')
  }
}

const handleCommand = e => {
  handleDelete(e.id, e.index)
}

const handlePageChange = curPage => {
  page.pageIndex = curPage
  getList()
}

const handleDelete = (id, index) => {
  ElMessageBox.confirm('确定删除当前回答吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteAnswer(id)
      .then(res => {
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
      .catch(err => ElMessage.error('删除失败'))
  })
}
// 处理点赞、收藏 type : like | collect
function handleState(type, id, index) {
  const fetchFunction = type === 'like' ? updateLike : updateCollect
  fetchFunction({ article_id: id, article_type: 1 })
    .then(res => {
      emit('handleAction')
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

// 列表-获取一条
const getListOne = curPage => {
  loading.value = true
  const params = {
    page_size: 1,
    curr_page: curPage,
    entity: {
      issue: 1, //1是已发布
      keyword: searchValue.value,
      user_id: id.value,
    },
  }
  let fetchFunction = fetchQuizAnswer
  if (route.path.includes('myCollect')) {
    fetchFunction = fetchCollectQuizAnswer
    params.entity = { keywords: searchValue.value }
  }
  fetchFunction(params)
    .then(res => {
      loading.value = false
      if (res.code === 0 && res.data) {
        loading.value = false
        const result = res.data
        result.list.forEach(item => {
          item.isMore = false
        })
        list.value = [...list.value, ...result.list]
        handleFinish(page.pageIndex, page.totalPage, list.value)
      }
    })
    .catch(err => console.log(err))
}

// 回答列表
function getList(type) {
  loading.value = true
  const params = {
    page_size: page.pageSize,
    curr_page: page.pageIndex,
    entity: {
      issue: 1,
      keyword: searchValue.value,
      user_id: id.value,
    },
  }
  let fetchFunction = fetchQuizAnswer
  if (route.path.includes('myCollect')) {
    fetchFunction = fetchCollectQuizAnswer
    params.entity = { keywords: searchValue.value }
  }
  fetchFunction(params).then(res => {
    loading.value = false
    const result = res.data
    page.totalPage = result.total_page
    totalCount.value = result.total_count
    result.list.forEach(item => {
      item.isMore = false
    })
    list.value = type ? [...list.value, ...res.data.list] : res.data.list
    handleFinish(page.pageIndex, page.totalPage, list.value)
  })
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.answer-item {
  display: flex;
  margin-bottom: 20px;
  padding: 20px 16px;
  border-radius: 4px;
  background: #fff;
  align-items: center;
  &:hover {
    // cursor: pointer;
    box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  }
  .content-img {
    cursor: pointer;
    img {
      width: 210px;
      height: 150px;
      border-radius: 4px;
      margin-right: 16px;
    }
  }
  .text-content {
    flex: 1;
    width: 100%;
    height: 100%;
    &.image-bottom {
      .answer-content {
        margin-bottom: 10px;
        max-height: 40px;
        height: inherit;
      }
    }

    .answer-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 42px;
      border-radius: 4px;
      margin-bottom: 20px;
      .head-left {
        display: flex;
        background-color: #eef3fd;
        align-items: center;
        height: 100%;
        cursor: pointer;
        .answer-photo {
          margin-left: 11.7px;
          width: 28.4px;
          height: 28.4px;
          margin-right: 11.9px;
        }
        .answer-title {
          color: #6d717d;
          margin-right: 20px;
        }
        .answer-total {
          color: #0175ff;
          margin-right: 16px;
        }
      }
      .head-right {
        height: 100%;
        img {
          margin-right: 16px;
        }
      }
    }
    .answer-content {
      height: 40px;
      line-height: 20px;
      font-size: 14px;
      color: #333;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .qa-time {
      margin-top: 10px;
      color: #9196a6;
      height: 20px;
      line-height: 20px;
    }
    .answer-foot {
      margin-top: 8px;
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

      .edit {
        display: flex;
        align-items: center;
        margin-right: 16px;
        justify-content: center;
        .more {
          margin-left: 16px;
        }
        .btn-delete {
          position: absolute;
          top: 30px;
          right: -20px;
          background: #ffffff;
          border: none;
          color: #333;
          box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
        }
      }
    }
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
