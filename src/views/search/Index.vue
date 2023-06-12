<template>
  <!-- banner -->
  <div class="blog-banner">
    <div class="blog-banner-content">
      <div class="banner-search">
        <input v-model="searchWord" @keyup.enter="handleSearch()" />
        <img @click="handleSearch()" src="@/assets/img/index/g-search.png" />
      </div>
      <div v-if="historyWordList.length" class="history-search-list">
        <label> 历史搜索：</label>
        <div class="word-list">
          <span v-for="(item, index) in historyWordList.slice(0, 5)" :key="index" @click="handleSearch(item)">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- main -->
  <div class="blog-main">
    <div class="blog-content">
      <div class="blog-content__left">
        <!-- tab -->
        <div class="tab">
          <div class="tab-list">
            <span class="tab-name" :class="{ active: curTabIndex === index }" v-for="(item, index) in tabList" :key="item.index" @click="handleTabClick(item)">
              {{ item.name }}
            </span>
          </div>
        </div>
        <!--列表顶部  -->
        <div class="top-list">
          <div class="left">
            共计
            <span class="is-active">{{ page.total }}</span> 条结果
          </div>
          <div class="right">
            <span v-for="(item, index) in sortStatusOptions" :key="index" :class="{ 'is-active': sort === item.value }" @click="sort = item.value">{{ item.label }}</span>
          </div>
        </div>

        <!-- 博客列表 -->
        <BlogList :list="list" :searchWord="searchWord" />
        <!-- 底部加载 -->
        <div class="bottom-load">
          <el-icon v-if="loading" class="is-loading">
            <Loading />
          </el-icon>
          <span v-else :class="{ more: loadStatus === 2 }" @click="loadMore">{{ loadMap[loadStatus] }}</span>
        </div>
      </div>
      <div class="blog-content__right">
        <div class="hot-word-card">
          <div class="hot-name">最新热词</div>
          <div class="word-list">
            <span v-for="(item, index) in hotWordList.slice(0, 10)" :key="index" @click="handleSearch(item)">{{ item }}</span>
          </div>
        </div>

        <!-- 最热 -->
        <SearchHot :list="hotContentList" />
      </div>
    </div>
  </div>

  <!-- 回到顶部 -->
  <el-backtop class="bar-backtop" :bottom="60" :right="40">
    <img src="@/assets/img/blog-index/backtop-btn.png" />
  </el-backtop>
</template>

<script setup name="blogIndex">
import Breadcrumb from '@/components/Breadcrumb.vue'
import AreaHeader from '@/components/AreaHeader.vue'
import { fetchSearchGlob, fetchSearchContent, fetchSearchHistory, fetchSearchKey } from '@/api/index.js'
import BlogHot from '@/views/blog/components/BlogHot.vue'
import { fetchSearchRecordAdd, fetchSearchContentAdd, fetchSearchKeyAdd } from '@/api/index.js'
import SearchHot from './components/SearchHot.vue'
import { useCommonStore } from '@/stores/common.js'
import BlogList from './components/BlogList.vue'

const router = useRouter()
const curTabIndex = ref(0)
const commonStore = useCommonStore()
const searchWordHeader = storeToRefs(commonStore).searchWord
const searchWord = ref(searchWordHeader.value)
const loading = ref(false)
const sort = ref(1)
const list = ref([])
const hotWordList = ref([])
const hotContentList = ref([])
const historyWordList = ref([])
const loadStatus = ref(1)
const sortStatusOptions = reactive([
  // { label: '推荐', value: 0 },
  { label: '最新', value: 1 },
  { label: '最热', value: 2 }
])

const active = ref('')
const tabList = [
  { name: '全部', index: 0, type: '' },
  { name: '博客', index: 1, type: 'blog' },
  { name: '问题', index: 2, type: 'quiz' },
  { name: '题库', index: 3, type: 'question' }
]

const handleAreaChange = area_id => {
  active.value = area_id + ''
}
const handleTabClick = item => {
  curTabIndex.value = item.index
  getList()
}

const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})

const initPage = {
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1,
  total: 0
}
const page = reactive({ ...initPage })
const resetPage = () => {
  Object.assign(page, initPage)
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

// 内容列表
const getContentList = () => {
  fetchSearchContent().then(res => {
    if (res.code !== 0) return
    hotContentList.value = res.data
  })
}

// 热词列表
const getKeyList = () => {
  fetchSearchKey().then(res => {
    if (res.code !== 0) return
    hotWordList.value = res.data
  })
}
// 历史搜索记录
const getHistoryRecord = () => {
  fetchSearchHistory().then(res => {
    if (res.code !== 0) return
    historyWordList.value = res.data
  })
}

const handleAdd = (type, params) => {
  if (type === 'history') {
    fetchSearchRecordAdd({ message: searchWord.value }).then(res => {})
  } else if (type === 'keyword') {
    fetchSearchKeyAdd({ message: searchWord.value }).then(res => {})
  } else if (type === 'content') {
    fetchSearchContentAdd(params)
  }
}

// 获取搜索结果列表
const getList = type => {
  loading.value = false
  const params = {
    curr_page: page.pageIndex,
    keyword: searchWord.value,
    page_size: page.pageSize,
    sort: sort.value,
    type: tabList[curTabIndex.value].type
  }
  fetchSearchGlob(params).then(res => {
    loading.value = false
    if (res.code !== 0) return
    if (res.code == 0 && res.data) {
      page.totalPage = res.data.total_page
      page.total = res.data.total_count
      list.value = type ? [...list.value, ...res.data.list] : res.data.list
      handleFinish(page.pageIndex, page.totalPage, list.value)
    }
  })
}

const updateSearchResult = async () => {
  await getContentList()
  await getKeyList()
  await getHistoryRecord()

  await handleAdd('keyword')
  await handleAdd('history')
}

// 搜索
const handleSearch = value => {
  value && (searchWord.value = value)
  getList()
  updateSearchResult()
}

watch(
  searchWordHeader,
  (val, old) => {
    // if (val) {
    //   handleSearch()
    // } else {
    //   getContentList()
    //   getKeyList()
    //   getHistoryRecord()
    // }
    handleSearch()
  },
  { immediate: true }
)

watch(sort, (val, old) => {
  getList()
})
</script>

<style lang="scss" scoped>
.blog-banner {
  position: relative;
  min-width: 1200px;
  height: 200px;
  background: url('@/assets/img/index/search-banner.png') no-repeat center;
  background-size: cover;
  color: #333;
  &-content {
    top: 50%;
    transform: translateY(-50%);
    width: 680px;
    margin: 0 auto;
    .banner-search {
      display: flex;
      align-items: center;
      width: 100%;
      height: 48px;
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0px 6px 12px 0px rgba(130, 153, 204, 0.25);
      padding: 0 16px;
      input {
        background: #ffffff;
        border-radius: 4px;
        flex: 1;
        height: 100%;
        outline: none;
        font-size: 14px;
        border: none;
      }
      img {
        width: 20px;
        height: 20px;
        margin-left: 16px;
      }
    }
    .history-search-list {
      width: 100%;
      margin-top: 16px;
      display: flex;
      align-items: center;
      .word-list {
        // display: flex;
        // justify-content: flex-start;
        align-items: center;
        color: #6d717d;
        span {
          margin-left: 16px;
          margin-bottom: 20px;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            color: #0175ff;
          }
        }
      }
    }
  }
}
.blog-main {
  width: 1200px;
  // position: absolute;
  margin: 20px auto;
  .blog-content {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    &__left {
      width: 780px;
      .tab {
        .tab-list {
          height: 32px;
          border-bottom: 1px solid rgb(200, 200, 219, 0.5);
          .tab-name {
            margin-right: 40px;
            font-size: 16px;
            color: #333333;
            padding-bottom: 10px;
            cursor: pointer;
            &:hover {
              color: #0175ff;
              font-weight: 600;
            }
            &.active {
              color: #0175ff;
              font-weight: 600;
              &::before {
                content: '';
                position: absolute;
                bottom: 1px;
                left: 25%;
                width: 50%;
                height: 3px;
                background: #0175ff;
              }
            }
          }
        }
      }
      .top-list {
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #333;
        margin-top: 25px;
        .left {
          font-size: 14px;
          line-height: 20px;
          span {
            margin: 0;
          }
        }
        span {
          font-size: 14px;
          margin-left: 20px;
          &:hover,
          &.is-active {
            cursor: pointer;
            color: #0175ff;
          }
        }
      }
    }
    &__right {
      width: 360px;
      .hot-word-card {
        padding-bottom: 40px;
        .hot-name {
          line-height: 25px;
          margin-bottom: 21px;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .word-list {
          margin-bottom: 20px;
          span {
            margin-right: 20px;
            cursor: pointer;
            &:hover {
              color: #0175ff;
            }
          }
        }
      }

      .blog-btn {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        div {
          width: 170px;
          height: 83px;
          line-height: 0;
          text-align: center;
          background: #ffffff;
          box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
          border-radius: 4px;
          &:hover {
            cursor: pointer;
            opacity: 0.85;
          }
          img {
            width: 34px;
            height: 30px;
            margin: 16px 0 5px;
          }
          p {
            font-size: 14px;
            line-height: 20px;
            color: #333;
          }
        }
      }
    }
  }
}
.bottom-load {
  margin: 40px 0 20px;
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
.bar-backtop {
  width: 50px;
  height: 50px;
  right: 15.104167% !important;
  border-radius: 50px;
  box-shadow: none;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
</style>
