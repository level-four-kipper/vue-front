<!-- 粉丝列表 | 关注列表 -->
<template>
  <TabHeader :tabLabel="tabLabel" :totalCount="totalCount" :page="page" @handlePageChange="handlePageChange" />
  <div class="fan-item" v-for="(item, index) in followList" :key="index">
    <div class="left" @click="jumpAuthorIndex(item.user_id)">
      <img class="people-avatar" :src="item.img_url" alt="评论" />
      <div class="people-basic-message">
        <div class="nickname">{{ item.username }}</div>
        <div class="signature">{{ item.intro || 'Ta还没想好写什么' }}</div>
      </div>
    </div>
    <div class="right">
      <div class="message-list">
        <span class="quiz-total">{{ item.article_count }}博客</span>
        <span class="quiz-total">{{ item.quiz_count }}提问</span>
        <span class="quiz-total">{{ item.followers_number }}粉丝</span>
      </div>
      <el-button v-if="route.path.includes('myConcern')" type="primary" @click="updateFollower(item.user_id)">× 取关</el-button>
      <el-button v-else-if="!item.follow_flag" type="primary" @click="updateFollower(item.user_id)">+ 关注</el-button>
      <el-button v-else class="is-concern" type="primary">互相关注</el-button>
    </div>
  </div>
</template>
<script setup>
import TabHeader from './TabHeader.vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/https.js'
import { formatDate } from '@/utils/format.js'
import { fetchAnswerList } from '@/api/answer.js'
import { fetchQuizAnswer, updateCollect, updateLike } from '@/api/answer.js'
import { useLoginStore } from '@/stores/login.js'
import { fetchFansList, fetchConcernList, fetchUpdateFollower } from '@/api/personalCenter.js'

const props = defineProps({
  tabLabel: String //控制列表上面的统计文案
})
const { searchValue } = inject('searchValue')
const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const { id: userId } = storeToRefs(loginStore)
const id = computed(() => {
  return route.params.id || userId.value
})
const followList = ref([])
const totalCount = ref(0)
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1
})

watch(searchValue, () => {
  getFollowList()
})

const updateFollower = id => {
  const formData = new FormData()
  formData.append('authorId', id || id.value)
  fetchUpdateFollower(formData).then(res => {
    if (res.code === 0) {
      getFollowList()
    } else {
      ElMessage.error('操作失败')
    }
  })
}
// 粉丝| 关注列表
function getFollowList() {
  const params = {
    page_size: page.pageSize,
    curr_page: page.pageIndex,
    order: 'desc',
    sidx: 'gmt_created',
    entity: {
      user_id: id.value,
      keyword: searchValue.value
    }
  }

  const fetchFunction = route.path.includes('myConcern') ? fetchConcernList : fetchFansList
  fetchFunction(params)
    .then(res => {
      if (res.code === 0 && res.data) {
        followList.value = res.data.list
        totalCount.value = res.data.total_count
        page.totalPage = res.data.total_page
      } else {
        ElMessage.error(res.data.error || res.msg)
      }
    })
    .catch(err => console.log(err))
}

// 跳转详情页
const jumpAuthorIndex = id => {
  const routeUrl = router.resolve({
    path: `/authorIndex/${id}`
  })
  window.open(routeUrl.href, '_blank')
}

// 收藏 添加收藏状态后再加上是否收藏的参数
const addCollect = (index, id) => {
  http
    .post('/collect-info/add', {
      article_id: id,
      article_type: 1
    })
    .then(res => {
      getFansList()
    })
    .catch(err => console.log(err))
}

// 翻页
const handlePageChange = curPage => {
  page.pageIndex = curPage
  getFansList()
}

// 处理点赞、收藏 type : like | collect
function handleAnswerState(type, id) {
  const fetchFunction = type === 'like' ? updateLike : updateCollect
  fetchFunction({ article_id: id, article_type: 1 })
    .then(res => {
      if (res.code == 0) {
        getFansList()
        emit('handleAction')
      } else {
        console.log(res.msg || res.data.error)
      }
    })
    .catch(err => console.log(err))
}

onMounted(() => {
  getFollowList()
})
</script>
<style lang="scss" scoped>
.fan-item {
  height: 94px;
  width: 910px;
  margin-bottom: 12px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  .left {
    display: flex;
    align-items: center;
    height: 54px;
    cursor: pointer;
    .people-avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
    }
    .people-basic-message {
      height: 100%;
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      .nickname {
        height: 28px;
        font-size: 18px;
        color: #333333;
        font-weight: 600;
      }
      .signature {
        color: #9196a6;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .message-list {
      span {
        font-size: 14px;
        font-weight: 400;
        color: #6d717d;
        margin-right: 20px;
      }
    }
    .el-button {
      background: #0175ff;
      margin-left: 20px;
      width: 80px;
      &.is-concern {
        background-color: #eef3fd;
        color: #6d717d;
        border: none;
        cursor: auto;
      }
    }
  }
}
</style>
