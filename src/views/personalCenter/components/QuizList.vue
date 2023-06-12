<!-- 提问列表 -->
<template>
  <TabHeader :tabLabel="tabLabel" :totalCount="totalCount" :page="page" :menuIndex="menuIndex" @handlePageChange="handlePageChange" />
  <div class="quiz-item" v-for="(item, index) in list" :key="index">
    <!-- 图片列表 -->
    <div v-if="item.image_list && item.image_list.length === 1" class="content-img">
      <img   @click="jumpQuizDetail(index, item.id)" v-for="(url, index) in item.image_list" :key="index" :src="url" alt="" />
    </div>
    <!-- 内容 -->
    <div class="text-content" :class="[{ 'image-left': item.image_list && item.image_list.length === 1 }, { 'image-bottom': item.image_list && item.image_list.length > 1 }]">
      <div class="content-header">
        <div class="quiz-title" @click="jumpQuizDetail(index, item.id)">{{ item.title }}</div>
        <IconCollect v-if="route.path.includes('myCollect')" @click.stop="handleState('collect', item.id, index)"></IconCollect>
      </div>
      <div class="quiz-content">
        {{ item.content }}
      </div>
      <!-- 图片列表 -->
      <div v-if="item.image_list && item.image_list.length > 1" class="content-img">
        <img @click="jumpQuizDetail(index, item.id)" v-for="(url, index) in item.image_list.slice(0, 3)" :key="index" :src="url" alt="" />
      </div>

      <div class="quiz-footer">
        <div class="message-icon-list">
          <p>
            <span class="quiz-total">{{ item.comment_count }}人回答</span>
          </p>
          <!-- 浏览 -->
          <p>
            <img src="@/assets/img/view.png" alt="浏览" />
            <span>{{ item.look_count !== undefined ? item.look_count : item.browse_count }}</span>
          </p>
          <!-- 收藏 -->
          <p>
            <img src="@/assets/img/collect.png" alt="收藏" />
            <span>{{ item.star_count }}</span>
          </p>
          <span class="quiz-time">{{ formatDate(item.created_time || item.gmt_created, 'yyyy-mm-dd') }}</span>
        </div>

        <!-- 提问列表 个人视角可编辑 -->
        <template v-if="!route.params.id && route.path.includes('myWriting')">
          <div class="edit-set">
            <span @click.stop="jumpEditQuestion(item)" class="edit-content">
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
import http from '@/utils/https.js'
import { formatDate } from '@/utils/format.js'
import { fetchQuizAnswer, updateCollect, updateLike } from '@/api/answer.js'
import { useLoginStore } from '@/stores/login.js'
import { fetchCollectQuiz, fetchQuizList } from '@/api/personalCenter.js'
import IconCollect from '@/components/IconCollect.vue'
import { fetchMyAnswerList, fetchDeleteMyAsk, fetchTotal, fetchUpdateMyAsk } from '@/api/answer.js'
import { ElMessage, ElMessageBox } from 'element-plus'

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

//处理显示文字长度
// const handleContent = (str) => {
//   let newStr = ''
//   let length = 0
//   for (let i = 0; i < str.length; i++) {
//     if (length > 124) {
//       newStr = newStr + '...'
//       break
//     }
//     //使用的正则表达式
//     str.charAt(i).match(/[^\x00-\xff]/g) ? length += 2 : length += 1
//     newStr += str[i]
//   }
//   return newStr
// }

// 跳转详情页
const jumpQuizDetail = (index, id) => {
  const routeUrl = router.resolve({
    path: `/questionAnswerDetail/${id}`,
  })
  window.open(routeUrl.href, '_blank')
}

// 跳转提问编辑
const jumpEditQuestion = item => {
  router.push({
    path: '/publishQuestion',
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
    getList('more')
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
  fetchFunction({ article_id: id, article_type: 1 })
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

// 删除提问
const handleDelete = (id, index) => {
  ElMessageBox.confirm('确定删除当前提问吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fetchDeleteMyAsk(id)
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

// 提问列表-获取一条
const getListOne = curPage => {
  loading.value = true
  const params = {
    page_size: 1,
    curr_page: curPage,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      issue: 1,
      sort_status: 1,
      user_id: id.value,
      keyword: searchValue.value
    }
  }
  let fetchFunction = fetchQuizList
  if (route.path.includes('myCollect')) {
    fetchFunction = fetchCollectQuiz
    params.entity = { keywords: searchValue.value }
  }
  fetchFunction(params).then(res => {
    loading.value = false
    res.data.list.forEach(item => (item.isMore = false))
    list.value = [...list.value, ...res.data.list]
    handleFinish(page.pageIndex, page.totalPage, list.value)
  })
}

// 提问列表
function getList() {
  loading.value = true
  const params = {
    page_size: page.pageSize,
    curr_page: page.pageIndex,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      issue: 1,
      sort_status: 1,
      user_id: id.value,
      keyword: searchValue.value
    }
  }
  let fetchFunction = fetchQuizList
  if (route.path.includes('myCollect')) {
    fetchFunction = fetchCollectQuiz
    params.entity = { keywords: searchValue.value }
  }
  fetchFunction(params)
    .then(res => {
      loading.value = false
      if (res.code === 0 && res.data) {
        page.pageIndex = res.data.curr_page
        page.pageSize = res.data.page_size
        page.totalPage = res.data.total_page
        totalCount.value = res.data.total_count
        res.data.list.forEach(item => (item.isMore = false))
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
.quiz-item {
  margin-bottom: 20px;
  padding: 16px;
  background: #ffffff;
  border-radius: 4px;
  width: 910px;
  min-width: 910px;
  display: flex;
  align-items: center;
  &:hover {
    box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  }
  .content-img {
    img {
      cursor: pointer;
      width: 210px;
      height: 150px;
      border-radius: 4px;
      margin-right: 16px;
    }
  }
  .text-content {
    flex: 1;
    height: 100%;
    width: 100%;
    &.image-left {
      .quiz-footer {
        margin-top: 40px;
      }
    }
    &.image-bottom {
      .quiz-footer {
        margin-top: 8px;
      }
      .quiz-content {
        margin-bottom: 10px;
        max-height: 40px;
        height: inherit;
      }
    }
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .quiz-title {
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        height: 24px;
        margin-bottom: 10px;
      }
    }
    .quiz-content {
      cursor: pointer;
      height: 40px;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .quiz-footer {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .message-icon-list {
        display: flex;
        align-items: center;
        color: #9196a6;

        p {
          margin-right: 20px;
          display: flex;
          align-items: center;
          .quiz-total {
            height: 32px;
            line-height: 32px;
            padding: 0 12px;
            color: #0175ff;
            background: #eef3fd;
            border-radius: 4px;
          }
          img {
            margin-right: 2px;
          }
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
