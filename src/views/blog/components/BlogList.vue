<template>
  <div class="blog-list">
    <div class="blog-list__top">
      <div class="left">
        已为您展示
        <span class="is-active">{{ list.length }}</span> 条
      </div>
      <div class="right">
        <span
          v-for="(item, index) in blogStatusOptions"
          :key="item.value"
          :class="{'is-active' : blogStatus === item.value}"
          @click="handleTypeChange(item.value)"
        >{{item.label}}</span>
      </div>
    </div>
    <!-- 列表 -->
    <div class="blog-list__content">
      <template v-for="(item, index) in list" :key="item.id">
        <BlogListCell :item="item" :index="index" @handleUpdate="handleUpdate" />
      </template>
      <div class="blog-load">
        <el-icon v-if="loading" class="is-loading">
          <Loading />
        </el-icon>
        <span
          v-else
          :class="{more: loadStatus === 2}"
          @click="loadStatus === 2 && getBlogList(tag)"
        >{{loadMap[loadStatus]}}</span>
      </div>
    </div>
  </div>
</template>

<script setup name="BlogList">
import BlogListCell from './BlogListCell.vue'
import { htmlToString } from '@/utils/utils.js'

import { fetchRecommendedBlogsByDomain, fetchLatestBlogsByDomain, fetchHotBlogsByDomain } from '@/api/blog.js'

const props = defineProps({
  tag: {
    // 博文分类
    type: String,
    default: '1'
  }
})

const blogStatus = ref(1)
const blogStatusOptions = reactive([
  // { label: '推荐', value: 0 },
  { label: '最新', value: 1 },
  { label: '最热', value: 2 }
])
const list = ref([])
const loading = ref(false)
const pageIndex = ref(1)
const pageSize = 10
const loadStatus = ref(1)
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})

// 加载完成
const handleFinish = (curr_page, total_page, arr) => {
  arr.forEach(item => {
    item.content = htmlToString(item.content)
  })
  list.value = [...list.value, ...arr]
  if (list.value.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (curr_page < total_page) {
    // 加载更多
    pageIndex.value = curr_page + 1
    loadStatus.value = 2
  } else if (curr_page === total_page) {
    // 没有更多了
    loadStatus.value = 3
  }
}

// 博文领域
const getBlogList = tag => {
  loading.value = true
  let requestApi = fetchRecommendedBlogsByDomain
  if (blogStatus.value === 1) {
    requestApi = fetchLatestBlogsByDomain
  } else if (blogStatus.value === 2) {
    requestApi = fetchHotBlogsByDomain
  }
  requestApi({
    curr_page: pageIndex.value,
    entity: { domain_id: tag === '' ? '' : Number(tag) },
    page_size: pageSize
  }).then(res => {
    loading.value = false
    if (res.code !== 0) {
      return
    }

    handleFinish(res?.data?.curr_page || 1, res?.data?.total_page || 1, res?.data?.list || [])
  })
}

const handleTypeChange = val => {
  blogStatus.value = val
  list.value = []
  pageIndex.value = 1
  getBlogList(props.tag)
}

watch(
  () => props.tag,
  newVal => {
    list.value = []
    pageIndex.value = 1
    getBlogList(newVal)
  },
  {
    immediate: true
  }
)

// 更新指定博文数据
const handleUpdate = (index, obj = {}) => {
  list.value.splice(index, 1, { ...list.value[index], ...obj })
}
</script>

<style lang="scss" scoped>
.blog-list {
  &__top {
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333;
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
  .blog-load {
    margin: 30px 0 60px;
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
