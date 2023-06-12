<template>
  <div class="blog-hot">
    <div class="blog-hot-name">热门搜索</div>
    <div v-for="(item, index) in list" :key="item.id" class="blog-hot-cell">
      <div class="blog-hot-top">
        <img v-if="index < 3" class="blog-hot-icon" :src="[BlogIndexToponeIcon, BlogIndexToptwoIcon, BlogIndexTopthreeIcon][index]" />
        <span v-else class="blog-hot-sort">{{ index + 1 }}</span>
        <span class="blog-hot-title text-overflow" @click="jumpPage(item)">{{ item.title }}</span>
      </div>
      <div v-if="index < 3" class="blog-hot-content">{{ item.content }}</div>
    </div>
  </div>
</template>
<script setup name="blogHot">
import { fetchHotBlog } from '@/api/blog.js'
import { htmlToString } from '@/utils/utils.js'
import { fetchSearchRecordAdd, fetchSearchContentAdd, fetchSearchKeyAdd } from '@/api/index.js'

const props = defineProps({
  tag: {
    // 博文分类
    type: String,
    default: '1'
  },
  list: { type: Array, default: [] }
})
const router = useRouter()
const typeMap = {
  blog: 0,
  quiz: 1,
  question: 5
}
const jumpPage = item => {
  //增加热搜内容
  const params = { ...item }
  fetchSearchContentAdd(params).then(res => {})
  let routeUrl = ''
  if (item.type === typeMap['blog']) {
    routeUrl = router.resolve({
      path: `/blogDetail/${item.id}`
    })
  } else if (item.type === typeMap['quiz']) {
    routeUrl = router.resolve({
      path: `/questionAnswerDetail/${item.id}`
    })
  } else if (item.type === typeMap['question']) {
    routeUrl = router.resolve({
      path: `/questionBank/detail`,
      query: { id: item.id }
    })
  }

  window.open(routeUrl.href, '_blank')
}
</script>

<style lang="scss" scoped>
.text-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.blog-hot {
  &-name {
    line-height: 25px;
    margin-bottom: 21px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  &-cell {
    margin-top: 20px;
  }
  &-top {
    display: flex;
    align-items: center;
    margin-bottom: 7px;
  }
  &-title {
    max-width: 284px;
    font-size: 16px;
    line-height: 22px;
    color: #333;
    &:hover {
      cursor: pointer;
      opacity: 0.85;
      text-decoration: underline;
    }
  }
  &-icon {
    width: 20px;
    height: 22px;
    margin-right: 12px;
  }
  &-sort {
    margin-right: 10px;
    font-family: Impact;
    font-size: 16px;
    line-height: 19px;
    color: #ea846c;
  }
  &-content {
    font-size: 14px;
    line-height: 20px;
    color: #6d717d;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
