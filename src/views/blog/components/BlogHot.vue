<template>
  <div class="blog-hot">
    <div class="blog-hot-name">最热博客</div>
    <div class="blog-hot-cell" v-for="(item, index) in list" :key="item.id">
      <div class="blog-hot-top">
        <img
          v-if="index < 3"
          class="blog-hot-icon"
          :src="[BlogIndexToponeIcon, BlogIndexToptwoIcon, BlogIndexTopthreeIcon][index]"
        />
        <span v-else class="blog-hot-sort">{{index + 1}}</span>
        <span
          class="blog-hot-title text-overflow"
          @click="jumpPage(`/blogDetail/${item.id}`)"
        >{{item.title}}</span>
      </div>
      <div v-if="index < 3" class="blog-hot-content">{{item.content}}</div>
    </div>
  </div>
</template>
<script setup name="blogHot">
import { fetchHotBlog } from '@/api/blog.js'
import { htmlToString } from '@/utils/utils.js'

const list = ref([])

const router = useRouter()
const jumpPage = path => {
  const routeUrl = router.resolve({
    path
  })
  window.open(routeUrl.href, '_blank')
}

const getHotBlog = () => {
  fetchHotBlog().then(res => {
    if (res.code !== 0) {
      return
    }
    list.value = res.data.map(item => {
      item.content = htmlToString(item.content)
      return item
    })
  })
}

getHotBlog()
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
      color: #0175ff;
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
