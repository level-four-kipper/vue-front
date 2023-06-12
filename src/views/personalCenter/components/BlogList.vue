<template>
  <TabHeader :tabLabel="tabLabel" :totalCount="totalCount" :page="page" @handlePageChange="handlePageChange" />
  <div class="blog-list">
    <div class="blog-card" v-for="(item, index) in list" :key="item.id">
      <div class="blog-item">
        <div class="blog-img" @click="jumpBlogDetail(item.id)">
          <img class="tag-blog" v-show="item.creation_type" src="@/assets/img/personalCenter/tag-reproduce.png" alt="" />
          <img class="tag-blog" v-show="!item.creation_type" src="@/assets/img/personalCenter/tag-original.png" alt="" />
          <el-image :src="item.image" fit="contain">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture />
                </el-icon>
                <div>暂无图片</div>
              </div>
            </template>
          </el-image>
          <IconCollect v-if="route.path.includes('myCollect')" @click.stop="handleState('collect', item.id, index)"></IconCollect>
        </div>
        <div class="blog-title" @click="jumpBlogDetail(item.id)">{{ item.title }}</div>
        <div class="blog-time">{{ item.gmt_created.slice(0, 10) }}</div>
        <div class="blog-btns">
          <div>
            <img src="@/assets/img/view.png" alt="浏览" />
            <span>{{ item.browse_count }}</span>
          </div>
          <div>
            <img src="@/assets/img/comment.png" alt="评论" />
            <span>{{ item.comment_count }}</span>
          </div>
          <div>
            <img src="@/assets/img/approval.png" alt="点赞" />
            <span>{{ item.like_count }}</span>
          </div>
          <div>
            <img src="@/assets/img/collect.png" alt="收藏" />
            <span>{{ item.star_count }}</span>
          </div>
        </div>
      </div>

      <template v-if="!route.params.id && route.path.includes('myWriting')">
        <div class="edit-set">
          <span @click.stop="jumpPublishBlog(item)" class="edit-content">
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
  <div class="bottom-load">
    <el-icon v-if="loading" class="is-loading">
      <Loading />
    </el-icon>
    <span v-else :class="{ more: loadStatus === 2 }" @click="loadMore">{{ loadMap[loadStatus] }}</span>
  </div>
</template>

<script setup>
import EditSet from './EditSet.vue'
import TabHeader from './TabHeader.vue'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { fetchBlogTouristView } from '@/api/blog.js'
import { fetchCollectBlogList, fetchDeleteBlog, fetchBlogList } from '@/api/personalCenter.js'
import useBlog from '@/hooks/useBlog.js'
import { fetchQuizAnswer, updateCollect, updateLike } from '@/api/answer.js'
import { useLoginStore } from '@/stores/login.js'
import { formatDate } from '@/utils/format.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import IconCollect from '@/components/IconCollect.vue'

const props = defineProps({
  tabLabel: String
})

const { searchValue } = inject('searchValue')
const emit = defineEmits(['handleAction'])
const loginStore = useLoginStore()
const { id } = storeToRefs(loginStore)
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const loadStatus = ref(1)
const list = ref([])
const totalCount = ref(0)
const currentIndex = ref(0) //点击列表下标
const userId = computed(() => {
  return route.params.id || id.value
})

const { handleLike, handleCollect } = useBlog()
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})

const initPage = {
  pageIndex: 1,
  pageSize: 9,
  totalPage: 1
}
const page = reactive({ ...initPage })
const resetPage = () => {
  Object.assign(page, initPage)
}

// 跳转博客编辑
const jumpPublishBlog = item => {
  router.push({
    path: '/publishBlog',
    query: { id: item.id }
  })
}

// 跳转博客详情
const jumpBlogDetail = id => {
  const routeUrl = router.resolve({
    path: `/blogDetail/${id}`
  })
  window.open(routeUrl.href, '_blank')
}

// 加载完成
const handleFinish = (curr_page, total_page, arr) => {
  console.log(curr_page, total_page, arr, 'curr_page, total_page, arr')
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

// 删除博客
const handleDelete = (id, index) => {
  ElMessageBox.confirm('确定删除当前博客吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fetchDeleteBlog(id)
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

const handleCommand = e => {
  handleDelete(e.id, e.index)
}

//加载更多
const loadMore = () => {
  if (loadStatus.value === 2) {
    page.pageIndex++
    getList('more')
  }
}

// 列表-获取一条
const getListOne = curPage => {
  loading.value = true
  const params = {
    curr_page: curPage,
    page_size: 1,
    entity: {
      creator: userId.value,
      status: 1,
      keyword: searchValue.value
    }
  }
  let fetchFunction = fetchBlogList
  if (route.path.includes('myCollect')) {
    fetchFunction = fetchCollectBlogList
    params.entity = { keywords: searchValue.value }
  }
  fetchFunction(params).then(res => {
    loading.value = false
    res.data.list.forEach(item => (item.isMore = false))
    list.value = [...list.value, ...res.data.list]
    handleFinish(page.pageIndex, page.totalPage, list.value)
  })
}

// 获取列表
const getList = type => {
  loading.value = true
  const params = {
    curr_page: page.pageIndex,
    page_size: page.pageSize,
    entity: {
      creator: userId.value,
      status: 1,
      keyword: searchValue.value
    }
  }
  let fetchFunction = fetchBlogList
  if (route.path.includes('myCollect')) {
    fetchFunction = fetchCollectBlogList
    params.entity = { keywords: searchValue.value }
  }
  fetchFunction(params).then(res => {
    loading.value = false
    if (res.code == 0 && res.data) {
      page.totalPage = res.data.total_page
      totalCount.value = res.data.total_count
      res.data.list.forEach(item => (item.isMore = false))
      if (type) {
        list.value = [...list.value, ...res.data.list]
      } else {
        list.value = res.data.list
      }
      handleFinish(page.pageIndex, page.totalPage, list.value)
    }
  })
}

//关键字搜索
watch(searchValue, () => {
  resetPage()
  list.value = []
  getList()
})

//关键字搜索
watch(route, () => {
  getList()
})

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.blog-list {
  display: flex;
  flex-wrap: wrap;
  .blog-card {
    width: 290px;
    border-radius: 4px;
    margin: 0 20px 20px 0;
    &:nth-child(3n) {
      margin-right: 0;
    }
    &:hover {
      box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
    }
    .blog-item {
      background: #fff;
      padding: 10px;
      padding-bottom: 14px;
      height: 300px;
      .blog-img {
        padding: 0;
        .tag-blog {
          position: absolute;
          top: -1px;
          left: 0;
          z-index: 99;
        }
        .el-image {
          width: 270px;
          height: 168px;
          cursor: pointer;
          img {
            border-radius: 4px;
          }
        }
        .collect {
          position: absolute;
          right: 0;
          top: 0;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 4px;
          height: 30px;
          width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover::after {
            left: 34px;
            top: 4px;
          }
        }
      }
      & > div {
        padding: 0 5px;
      }
      .blog-title {
        cursor: pointer;
        height: 44px;
        line-height: 22px;
        font-size: 16px;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .blog-time {
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #9196a6;
      }
      .blog-btns {
        display: flex;
        align-items: center;
        margin: 10px 0;
        & > div {
          display: flex;
          align-items: center;
          margin-right: 21px;
          span {
            line-height: 20px;
            margin-left: 2px;
            font-size: 14px;
            color: #9196a6;
          }
        }
      }
    }
    .blog-edit {
      margin-top: 1px;
      background: #fff;
      padding: 0 10px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 400;
      .edit-content {
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
}
.image-slot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  .el-icon {
    font-size: 28px;
  }
  div {
    font-size: 14px;
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
</style>
